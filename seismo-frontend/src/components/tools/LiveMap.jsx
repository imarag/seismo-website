import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import CustomMap from "../ui/CustomMap";
import { apiRequest } from "../../assets/utils/apiRequest";
import Message from "../ui/Message";
import MenuDropdown from "../ui/MenuDropdown";
import Section from "../utils/Section";
import Collapse from "../ui/Collapse";
import ToolTip from "../ui/ToolTip";
import Table from "../ui/Table";
import { RxLapTimer } from "react-icons/rx";
import { IoMdSettings } from "react-icons/io";
import Label from "../ui/Label";
import Select from "../ui/Select";
import { magnitudeOptions } from "../../assets/data/static";
import { timeRangeOptions } from "../../assets/data/static";

function MapOptions({
    selectedMagnitude,
    setSelectedMagnitude,
    selectedTimeRange,
    setSelectedTimeRange,
}) {
    return (
        <>
            <Label>Time range options</Label>
            <Select
                optionsList={timeRangeOptions}
                value={selectedTimeRange}
                size="medium"
                onChange={(e) => setSelectedTimeRange(e.target.value)}
            />
            <Label>Magnitude options</Label>
            <Select
                optionsList={magnitudeOptions}
                value={selectedMagnitude}
                size="medium"
                onChange={(e) => setSelectedMagnitude(e.target.value)}
            />
        </>
    );
}

function MapTopMenu({
    earthquakeData,
    selectedMagnitude,
    setSelectedMagnitude,
    selectedTimeRange,
    setSelectedTimeRange,
    remainSeconds,
}) {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
            <p className="text-center md:text-start">
                {earthquakeData?.features?.length > 0
                    ? `There are ${earthquakeData.features.length} recorded earthquakes for the selected options, globally.`
                    : "No earthquakes found!"}
            </p>
            <div className="ms-auto">
                <MenuDropdown icon={IoMdSettings} position="center">
                    <MapOptions
                        selectedMagnitude={selectedMagnitude}
                        setSelectedMagnitude={setSelectedMagnitude}
                        selectedTimeRange={selectedTimeRange}
                        setSelectedTimeRange={setSelectedTimeRange}
                    />
                </MenuDropdown>
            </div>
            <div className="flex items-center gap-2">
                <span>{Math.floor(remainSeconds)}</span>
                <ToolTip toolTipText="Seconds until the map updates again!">
                    <RxLapTimer />
                </ToolTip>
            </div>
        </div>
    );
}

function MapBottomInfo({ extractFeatureInfo, earthquakeData }) {
    const features = earthquakeData?.features || [];
    const tableRecords = features.map((feature) => extractFeatureInfo(feature));
    return (
        <Section>
            <Collapse label="Show/Hide earthquake information">
                {tableRecords.length > 0 ? (
                    <Table records={tableRecords} />
                ) : (
                    <p>No properties found in the GeoJSON data!</p>
                )}
            </Collapse>
            <p>
                The earthquake data displayed on this map is retrieved from the official
                USGS (United States Geological Survey) Earthquake Feed. You can explore
                seismic activity from various time ranges, including the past hour, day,
                week, or month. The data is updated automatically every minute using the
                USGS GeoJSON feeds, which are refreshed approximately once per minute to
                reflect the latest detected earthquakes around the world.
            </p>
        </Section>
    );
}

const MemoisedMapBottomInfo = memo(MapBottomInfo);

function EarthquakeMap({ extractFeatureInfo, earthquakeData }) {
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
        />
    );
}

const MemoisedEarthquakeMap = memo(EarthquakeMap);

export default function LiveMap() {
    const [showMessage, setShowMessage] = useState({ message: "", type: "" });
    const [earthquakeData, setEarthquakeData] = useState(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState("hour");
    const [selectedMagnitude, setSelectedMagnitude] = useState("all");
    const [remainSeconds, setRemainSeconds] = useState(0);
    const intervalRef = useRef(null);

    const fetchLatestEarthquakeData = useCallback(async () => {
        const { resData } = await apiRequest({
            url: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${selectedMagnitude}_${selectedTimeRange}.geojson`,
            method: "get",
            setShowMessage,
            successMessage: "Live earthquake data has been downloaded successfully.",
            errorMessage: "Cannot get the latest earthquakes.",
        });
        setEarthquakeData(resData);
    }, [selectedMagnitude, selectedTimeRange]);

    useEffect(() => {
        function handleStart() {
            const now = new Date();
            const utcSeconds = now.getUTCSeconds();
            if (utcSeconds < 30) {
                setRemainSeconds(30 - utcSeconds);
            } else if (utcSeconds === 30) {
                fetchLatestEarthquakeData();
                setRemainSeconds(0);
            } else {
                setRemainSeconds(90 - utcSeconds);
            }
        }

        intervalRef.current = setInterval(handleStart, 1000);
        return () => clearInterval(intervalRef.current);
    }, [fetchLatestEarthquakeData]);

    useEffect(() => {
        fetchLatestEarthquakeData();
    }, [fetchLatestEarthquakeData]);

    const handleClose = useCallback(() => {
        setShowMessage(false);
    }, []);

    const extractFeatureInfo = useCallback((feature) => {
        const properties = feature?.properties;
        return {
            Magnitude: properties?.mag || "N/A",
            Date: properties?.time ? new Date(properties.time).toISOString() : "N/A",
            Location: properties?.place.trim() || "N/A",
            "Magnitude Type": properties?.magType.trim().toUpperCase() || "N/A",
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
            <MapTopMenu
                earthquakeData={earthquakeData}
                selectedMagnitude={selectedMagnitude}
                selectedTimeRange={selectedTimeRange}
                setSelectedMagnitude={setSelectedMagnitude}
                setSelectedTimeRange={setSelectedTimeRange}
                remainSeconds={remainSeconds}
            />
            <MemoisedEarthquakeMap
                extractFeatureInfo={extractFeatureInfo}
                earthquakeData={earthquakeData}
            />
            <MemoisedMapBottomInfo
                extractFeatureInfo={extractFeatureInfo}
                earthquakeData={earthquakeData}
            />
        </Section>
    );
}
