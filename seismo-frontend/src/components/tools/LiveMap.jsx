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
import Label from "../ui/Label";
import Select from "../ui/Select";
import { magnitudeOptions } from "../../assets/data/static";
import { timeRangeOptions } from "../../assets/data/static";
import Button from "../ui/Button";

let STORAGE_KEY = "earthquake_data";

function EarthquakeMap({ earthquakeData, extractFeatureInfo }) {
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

    const layerGroups = [
        {
            name: "Latest earthquakes",
            type: "geojson",
            data: earthquakeData,
            onEachFeature: onEachFeature,
        },
    ];

    return (
        <CustomMap
            center={[51.505, -0.09]}
            zoom={3}
            layerGroups={earthquakeData ? layerGroups : []}
            showLayersControl={false}
            showCoordsOnHover={true}
            flyToFirst={true}
        />
    );
}

function EarthquakeList({ earthquakeData, extractFeatureInfo, setShowMessage }) {
    const features = earthquakeData?.features;
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
            <p className="text-center md:text-start text-sm">
                {earthquakeData?.features.length > 0
                    ? `There are ${earthquakeData.features.length} recorded earthquakes.`
                    : "No earthquakes found!"}
            </p>
            <Collapse label="Show/Hide earthquakes">
                <div className="flex items-center justify-end">
                    <Button
                        className="flex items-center gap-2"
                        style="ghost"
                        size="small"
                        onClick={downloadData}
                    >
                        <Symbol iconLabel="download-file" />
                        <span>download GeoJSON data (.json)</span>
                    </Button>
                </div>
                {tableRecords.length > 0 ? (
                    <Table records={tableRecords} />
                ) : (
                    <p>No properties found in the GeoJSON data!</p>
                )}
            </Collapse>
            <p>
                The earthquake data displayed on this map is streamed live from the SeismicPortal
                WebSocket service, which provides near real-time updates of seismic events globally.
                This live feed allows you to monitor earthquakes as they happen, ensuring you always
                see the most current seismic activity without needing to refresh the page.
            </p>
        </Section>
    );
}

function MapTopMenu() {
    return <div></div>;
}

export default function LiveMap() {
    const [showMessage, setShowMessage] = useState({ message: "", type: "" });
    const [earthquakeData, setEarthquakeData] = useState({ type: "FeatureCollection", features: [] });
    const wsRef = useRef(null);

    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                setEarthquakeData(JSON.parse(savedData));
            } catch {
                console.log("removinggggggs");
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    useEffect(() => {
        if (earthquakeData?.features.length > 0) {
            console.log(`setting local storage earthquake data: ${earthquakeData.features.length}`);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(earthquakeData));
        }
    }, [earthquakeData]);

    useEffect(() => {
        const ws = new WebSocket("wss://www.seismicportal.eu/standing_order/websocket");
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            setShowMessage({ type: "success", message: "Real-time earthquake updates are now live!" });
        };

        ws.onmessage = (event) => {
            try {
                const { action: eventAction, data: eventData } = JSON.parse(event.data);
                setEarthquakeData((prevData) => {
                    let updatedData = { ...prevData };
                    let userMessage = null;

                    if (eventAction === "create") {
                        updatedData = {
                            ...prevData,
                            features: [eventData, ...prevData.features].slice(0, 100),
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
                            type: "info",
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
                            type: "warning",
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
                    message: "Oops! There was a problem receiving live earthquake updates. Please try refreshing the page.",
                });
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            setShowMessage({
                type: "error",
                message: "Connection problem: live earthquake updates are temporarily unavailable.",
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

    const extractFeatureInfo = useCallback((feature) => {
        const properties = feature?.properties;
        return {
            Magnitude: properties?.mag || "N/A",
            Date: properties?.time ? new Date(properties.time).toISOString() : "N/A",
            Location: (properties?.flynn_region || "N/A").trim(),
            "Magnitude Type": (properties?.magtype || "N/A").trim().toUpperCase(),
        };
    }, []);

    return (
        <Section>
            {showMessage.message && (
                <Message
                    message={showMessage.message}
                    type={showMessage.type}
                    onClose={handleClose}
                />
            )}
            <MapTopMenu />
            <EarthquakeMap earthquakeData={earthquakeData} extractFeatureInfo={extractFeatureInfo} />
            <EarthquakeList
                earthquakeData={earthquakeData}
                extractFeatureInfo={extractFeatureInfo}
                setShowMessage={setShowMessage}
            />
        </Section>
    );
}
