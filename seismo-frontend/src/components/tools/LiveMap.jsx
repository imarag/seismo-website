import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import CustomMap from "../ui/CustomMap";
import { apiRequest } from "../../assets/utils/apiRequest";
import Message from "../ui/Message";
import MenuDropdown from "../ui/MenuDropdown";
import Section from "../utils/Section";
import Collapse from "../ui/Collapse";
import ToolTip from "../ui/ToolTip";
import Symbol from "../ui/Symbol";
import Table from "../ui/Table";
import { downloadURI } from "../../assets/utils/utility-functions";
import { fastapiEndpoints } from "../../assets/data/static";
import { trimWithDots, parseNumber, parseDate, getEarthquakeSignature } from "../../assets/utils/utility-functions";
import { liveMapSelectedViewOptions } from "../../assets/data/static";
import Label from "../ui/Label";
import Select from "../ui/Select";
import Button from "../ui/Button";

let STORAGE_KEY = "earthquake_data";

function EarthquakeMap({
    earthquakeData,
    extractFeatureInfo,
    selectedEarthqView,
    getSelViewLatestNumber,
}) {
    function onEachFeature(feature, layer) {
        const featureInfo = extractFeatureInfo(feature);
        const listItems = Object.entries(featureInfo)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join("");
        const popupContent = `
            <ul style="padding-left: 18px; margin: 0;">
                ${listItems}
            </ul>
        `;

        layer.bindPopup(popupContent);
    }

    const latestEarthqData = {
        ...earthquakeData,
        features: earthquakeData?.features
            ? earthquakeData.features
            : [],
    };

    const layerGroups = [
        {
            name: "Latest earthquakes",
            type: "geojson",
            data: latestEarthqData,
            onEachFeature: onEachFeature,
        },
    ];
    return (
        <CustomMap
            center={[51.505, -0.09]}
            zoom={3}
            layerGroups={layerGroups}
            showLayersControl={false}
            showCoordsOnHover={true}
            flyToFirst={true}
        />
    );
}

function EarthquakeList({
    earthquakeData,
    extractFeatureInfo,
    setShowMessage,
}) {
    const features = earthquakeData?.features || [];
    const tableRecords = features.map((feature) => extractFeatureInfo(feature));

    async function downloadData() {
        const { resData: blobData, error } = await apiRequest({
            url: fastapiEndpoints["DOWNLOAD-FILE"],
            method: "post",
            requestData: {
                data: earthquakeData,
                file_name: "earthquakes",
            },
            setShowMessage: setShowMessage,
            successMessage: "Data has been succesfully downloaded!",
            errorMessage: "Cannot download the data",
            responseType: "blob",
        });
        if (error) return;

        const url = window.URL.createObjectURL(blobData);
        downloadURI(url, "earthquakes.json");
    }

    return (
        <Section>
            {/* Title and summary */}
            <h2 className="text-center md:text-start text-lg font-semibold mb-2">
                Earthquake Activity Overview
            </h2>
            <p className="text-center md:text-start text-sm mb-4">
                {earthquakeData?.features.length > 0
                    ? `Currently, there are ${earthquakeData.features.length
                    } recorded earthquake${earthquakeData.features.length > 1 ? "s" : ""
                    }.`
                    : "No earthquakes have been recorded yet."}
            </p>

            {/* Collapsible detailed table */}
            <Collapse label="Show/Hide earthquake details">
                {tableRecords.length > 0 ? (
                    <>
                        <div className="flex items-center justify-end mb-2">
                            <Button
                                className="flex items-center gap-2"
                                style="ghost"
                                size="small"
                                onClick={downloadData}
                            >
                                <Symbol iconLabel="download-file" />
                                <span>Download GeoJSON data (.json)</span>
                            </Button>
                        </div>
                        <Table records={tableRecords} />
                    </>
                ) : (
                    <p className="text-center text-gray-600">
                        There are currently no recorded earthquakes to display.
                    </p>
                )}
            </Collapse>

            {/* Info note */}
            <p className="mt-4 text-xs text-gray-500">
                The earthquake data displayed on this map is streamed live from the
                SeismicPortal WebSocket service, providing near real-time updates of
                seismic events globally. This live feed ensures you see the most current
                seismic activity without needing to refresh the page.
            </p>
        </Section>
    );
}

function MapOptions({ selectedEarthqView, setSelectedEarthqView }) {
    return (
        <>
            <Label>Earthquake Display</Label>
            <Select
                optionsList={liveMapSelectedViewOptions}
                value={selectedEarthqView}
                size="medium"
                onChange={(e) => setSelectedEarthqView(e.target.value)}
            />
        </>
    );
}

function MapTopMenu({ selectedEarthqView, setSelectedEarthqView }) {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
            <div className="ms-auto flex items-center gap-2">
                <MenuDropdown iconLabel={"settings"} position="center">
                    <MapOptions
                        selectedEarthqView={selectedEarthqView}
                        setSelectedEarthqView={setSelectedEarthqView}
                    />
                </MenuDropdown>
            </div>
        </div>
    );
}

function EarthqSearchAnimation() {
    const timeRef = useRef(null);
    const earthSearchingText = "Fetching live earthquake data";
    const [animateText, setAnimateText] = useState(earthSearchingText);
    useEffect(() => {
        function earthEarthqSearchAnimation() {
            setAnimateText((prevText) => {
                const dotCount = prevText.split(".").length - 1;
                return dotCount < 3 ? prevText + "." : earthSearchingText;
            });
        }

        timeRef.current = setInterval(earthEarthqSearchAnimation, 600);
        return () => clearInterval(timeRef.current);
    }, []);
    return (
        <p className="text-center flex items-center gap-2 justify-center">
            <Symbol iconLabel="map-search" />
            {animateText}
        </p>
    );
}

export default function LiveMap() {
    const [showMessage, setShowMessage] = useState({ message: "", type: "" });
    // the earthquake data will be a geoJSON feature collection that contains features in a list
    const [earthquakeData, setEarthquakeData] = useState({
        type: "FeatureCollection",
        features: [],
    });

    // This is the options to control how many recent earthquakes to show (for the user)
    const [selectedEarthqView, setSelectedEarthqView] = useState(
        liveMapSelectedViewOptions[0]["value"]
    );
    const wsRef = useRef(null);


    function parseEarthqList(earthquakes) {
        const seen = new Set();
        const unique = earthquakes.filter(eq => {
            const signature = getEarthquakeSignature(eq);
            if (!signature || seen.has(signature)) return false;
            seen.add(signature);
            return true;
        });

        // Sort by time (descending)
        unique.sort((a, b) => {
            const timeA = parseDate(a.properties?.time, "epoch");
            const timeB = parseDate(b.properties?.time, "epoch");
            console.log(timeA, timeB)
            return timeB - timeA;
        });

        return unique;
    }



    // here we fetch at the beginning PAST and LATEST earthquakes from USGS
    // so the user has data (latest earthquakes) in the first render
    useEffect(() => {
        async function fetchPastEarthquakes(totalEartqToFetch) {
            const emscWsEventUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=${totalEartqToFetch}`;
            const { resData: latestFeatureCollection, error } = await apiRequest({
                url: emscWsEventUrl,
                method: "get",
                setShowMessage: setShowMessage,
                successMessage: "Latest earthquakes have been downloaded succesfully!",
                errorMessage: "Cannot download the latest earthquakes.",
            });
            if (error) {
                setShowMessage({
                    message: "Cannot fetch the latest earthquakes to show",
                    type: "error",
                });
                return;
            }
            const latestFeatures = latestFeatureCollection?.features ?? [];

            setEarthquakeData(prevData => ({
                ...prevData,
                features: parseEarthqList([...prevData.features, ...latestFeatures]),
            }));
        }

        fetchPastEarthquakes(100)
    }, []);


    // here we initialize the websocket to listen to live earthquakes from seismic portal
    useEffect(() => {
        const ws = new WebSocket(
            "wss://www.seismicportal.eu/standing_order/websocket"
        );
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            setShowMessage({
                type: "success",
                message: "Real-time earthquake updates are now live!",
            });
        };

        ws.onmessage = (event) => {
            try {
                const { action: eventAction, data: eventData } = JSON.parse(event.data);
                setEarthquakeData((prevData) => {
                    let updatedData = null;
                    let userMessage = null;

                    if (eventAction === "create") {
                        updatedData = {
                            ...prevData,
                            features: [eventData, ...prevData.features],
                        };
                        userMessage = {
                            type: "success",
                            message: `New earthquake detected! Magnitude ${eventData.properties.mag} at ${eventData.properties.flynn_region}.`,
                        };
                    } else if (eventAction === "update") {
                        const updatedFeatures = prevData.features.map((feature) =>
                            feature.id === eventData.id ? eventData : feature
                        );
                        updatedData = {
                            ...prevData,
                            features: updatedFeatures,
                        };
                        userMessage = {
                            type: "success",
                            message: `Earthquake updated: Magnitude ${eventData.properties.mag} at ${eventData.properties.flynn_region}.`,
                        };
                    } else if (eventAction === "delete") {
                        const filteredFeatures = prevData.features.filter(
                            (feature) => feature.id !== eventData.id
                        );
                        updatedData = {
                            ...prevData,
                            features: filteredFeatures,
                        };
                        userMessage = {
                            type: "success",
                            message: `Earthquake removed: ID ${eventData.id}.`,
                        };
                    }
                    setShowMessage(userMessage);
                    return updatedData;
                });
            } catch (err) {
                console.error("Failed to parse WebSocket message", err);
                setShowMessage({
                    type: "error",
                    message:
                        "Oops! There was a problem receiving live earthquake updates. Please try refreshing the page.",
                });
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            setShowMessage({
                type: "error",
                message:
                    "Connection problem: live earthquake updates are temporarily unavailable.",
            });
        };

        ws.onclose = () => {
            console.warn("WebSocket closed");
            setShowMessage({
                type: "warning",
                message: "Live earthquake updates connection was lost. Reloading...",
            });

            setTimeout(() => {
                window.location.reload();
            }, 3000); // optional delay to show the message before reload
        };

        return () => {
            ws.close();
        };
    }, []);


    const handleClose = useCallback(() => {
        setShowMessage({ message: "", type: "" });
    }, []);

    // get the number of latest earthquakes to show from the select tag user selected value
    function getSelViewLatestNumber(earthquakeView) {
        return Number(earthquakeView.split("-")[1]);
    }

    // data that are used for displaying earthquakes in the map and the table 
    // affected by user view selected tag and all earthquake data
    console.log(earthquakeData, "^^^^^^^^^^(")
    const displayEarthquakeData = {
        ...earthquakeData,
        features: parseEarthqList(earthquakeData.features).slice(0, getSelViewLatestNumber(selectedEarthqView))
    }

    // Utility to return the first available non-null property from a list of keys (earthq properties)
    const getExistingProperty = (properties, keys, fallback = "N/A") => {
        if (!properties) return fallback;

        // Map lowercase-trimmed keys -> actual keys
        const lowerKeyMap = {};
        for (const actualKey of Object.keys(properties)) {
            lowerKeyMap[actualKey.toLowerCase().trim()] = actualKey.trim();
        }

        for (const key of keys) {
            const keyLower = key.toLowerCase().trim();
            const actualKey = lowerKeyMap[keyLower];
            if (actualKey !== undefined) {
                const value = properties[actualKey];
                if (value != null) return String(value).trim();
            }
        }
        return fallback;
    };

    // Function to extract standardized earthquake properties from a GeoJSON feature
    const extractFeatureInfo = useCallback((feature) => {
        const fallback = "N/A"; // Default fallback for missing/invalid values
        const properties = feature?.properties ?? {}; // Extract properties safely
        const coords = feature?.geometry?.coordinates || []; // GeoJSON: [lon, lat, depth]

        // Try to retrieve time from multiple possible keys
        const rawTime = getExistingProperty(properties, [
            "time", "date", "datetime", "dt", "dtime", "birth", "birth-date", "birth-time"
        ]);

        return {
            // Attempt to find magnitude from common variations
            Magnitude: parseNumber(getExistingProperty(properties, [
                "mag", "magnitude", "magn", "mg"
            ], fallback), 1),

            // Convert the parsed date to ISO string if valid, else fallback
            Date: parseDate(Number(rawTime), "iso") ? parseDate(Number(rawTime), "iso") : fallback,

            // Search for location-related keys and trim whitespace
            Location: trimWithDots(getExistingProperty(properties, [
                "flynn_region", "region", "loc", "location", "place"
            ], fallback).toLowerCase(), 40),

            // Detect magnitude type and convert to uppercase
            "Magnitude Type": trimWithDots(getExistingProperty(properties, [
                "magtype", "magnitudeType", "type"
            ], fallback).toUpperCase(), 6),

            // Latitude and longitude from GeoJSON coords [lon, lat]
            Latitude: parseNumber(coords?.[1]),
            Longitude: parseNumber(coords?.[0]),

            // Depth from GeoJSON or fallback properties
            Depth: parseNumber(
                coords?.[2] ?? getExistingProperty(properties, [
                    "depth", "hypo", "dep", "hypodist", "hypocentral", "hypocentraldist"
                ], fallback)
            )
        };
    }, []);



    return (
        <>
            {showMessage.message && (
                <Message
                    message={showMessage.message}
                    type={showMessage.type}
                    onClose={handleClose}
                />
            )}
            <Section>
                {/* Animation that shows earthquake searching */}
                <EarthqSearchAnimation />
                {/* The top menu above the map */}
                <MapTopMenu
                    selectedEarthqView={selectedEarthqView}
                    setSelectedEarthqView={setSelectedEarthqView}
                />
                {/* Animation that shows earthquake searching */}
                <EarthquakeMap
                    earthquakeData={displayEarthquakeData}
                    extractFeatureInfo={extractFeatureInfo}
                    selectedEarthqView={selectedEarthqView}
                    getSelViewLatestNumber={getSelViewLatestNumber}
                />
                {/* The list of earthquakes in a table */}
                <EarthquakeList
                    earthquakeData={displayEarthquakeData}
                    extractFeatureInfo={extractFeatureInfo}
                    setShowMessage={setShowMessage}
                />
            </Section>
        </>
    );
}
