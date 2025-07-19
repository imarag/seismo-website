import { useEffect, useState, useRef } from "react";
import CustomMap from "../ui/CustomMap";
import { apiRequest } from "../../assets/utils/apiRequest";
import Message from "../ui/Message";
import Symbol from "../ui/Symbol";
import MenuDropdown from "../ui/MenuDropdown";
import Section from "../utils/Section";
import Button from "../ui/Button"
import Collapse from "../ui/Collapse";
import ToolTip from "../ui/ToolTip";
import Table from "../ui/Table";
import { RxLapTimer } from "react-icons/rx";
import { IoMdSettings } from "react-icons/io";
import Label from "../ui/Label";
import Select from "../ui/Select";

function MapOptions({ selectedMagnitude, setSelectedMagnitude, selectedTimeRange, setSelectedTimeRange }) {
    const magnitudeOptions = [
        { label: "All Earthquakes", value: "all" },
        { label: "Magnitude 1.0+", value: "1.0" },
        { label: "Magnitude 2.5+", value: "2.5" },
        { label: "Magnitude 4.5+", value: "4.5" },
        { label: "Significant Earthquakes", value: "significant" },
    ];

    const timeRangeOptions = [
        { label: "Past Hour", value: "hour" },
        { label: "Past Day", value: "day" },
        { label: "Past 7 Days", value: "week" },
        { label: "Past 30 Days", value: "month" },
    ];

    return (
        <>
            <Label>Time range options</Label>
            <Select optionsList={timeRangeOptions} value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)} />
            <Label>Magnitude options</Label>
            <Select optionsList={magnitudeOptions} value={selectedMagnitude} onChange={(e) => setSelectedMagnitude(e.target.value)} />
        </>
    )
}

export default function LiveMap() {
    const [showMessage, setShowMessage] = useState({ message: "", type: "" });
    const [data, setData] = useState(null);
    const intervalRef = useRef(null);
    const [remainSeconds, setRemainSeconds] = useState(0);
    const [selectedTimeRange, setSelectedTimeRange] = useState("hour");
    const [selectedMagnitude, setSelectedMagnitude] = useState("all");

    useEffect(() => {
        async function fetchLatestData() {
            const { resData: seismoData } = await apiRequest({
                url: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${selectedMagnitude}_${selectedTimeRange}.geojson`,
                method: "get",
                setShowMessage,
                successMessage: "Live earthquake data has been downloaded successfully.",
                errorMessage: "Cannot get the latest earthquakes.",
            });
            setData(seismoData);
        }

        function handleStart() {
            const now = new Date();
            const utcSeconds = now.getUTCSeconds();
            if (utcSeconds < 30) {
                setRemainSeconds(30 - utcSeconds)
            }
            else if (utcSeconds == 30) {
                fetchLatestData();
                setRemainSeconds(0)
            }
            else {
                setRemainSeconds(90 - utcSeconds)
            }

        }

        fetchLatestData(); // Run once on mount immediately

        intervalRef.current = setInterval(handleStart, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [selectedMagnitude, selectedTimeRange]);

    const features = data?.features;
    if (!features) {
        return [];
    }
    const earthquakeInfo = features.map(feature => {
        const properties = feature?.properties;
        if (!properties) {
            return null;  // or skip with filter later
        }
        return {
            Magnitude: properties.mag || "N/A",
            "Birth Date": properties.time ? new Date(properties.time).toLocaleString() : "N/A",
            Location: properties.place || "N/A",
            "Magnitude Type": properties.magType || "N/A",
        };
    }).filter(item => item !== null);


    function onEachFeature(feature, layer) {
        if (feature.properties) {
            const { mag, title, time, place, magType } = feature.properties;
            const formattedTime = time ? new Date(time).toLocaleString() : "N/A";

            const popupContent = `
                <div style="font-size: 14px;">
                    <strong>${title || "No Title"}</strong><br/>
                    Magnitude: ${mag ?? "N/A"} (${magType || "N/A"})<br/>
                    Location: ${place || "Unknown"}<br/>
                    Time: ${formattedTime}
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    }
    const layerGroups = [
        {
            name: "Latest earthquakes",
            type: "geojson",
            data: data,
            onEachFeature: onEachFeature,
        },
    ];

    return (
        <Section>
            {showMessage.message && (
                <Message
                    message={showMessage.message}
                    type={showMessage.type}
                    onClose={() => setShowMessage({ type: "", message: "" })}
                />
            )}
            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                <p className="text-center md:text-start">
                    {
                        data?.features?.length > 0 ? (
                            `There are ${data.features.length} recorded earthquakes for the selected options, globally.`) : ("")
                    }
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
            <CustomMap
                center={[51.505, -0.09]}
                zoom={3}
                layerGroups={data ? layerGroups : []}
                showLayersControl={false}
                showCoordsOnHover={true}
            />
            <Collapse label="Show/Hide earthquake information">
                <Table records={earthquakeInfo} />
            </Collapse>
            <p>
                The live earthquake data displayed on this map is retrieved from the official USGS (United States Geological Survey) Earthquake Feed.
                The data is updated automatically at regular intervals, providing real-time information about seismic activity worldwide within the past hour.
                The map fetches earthquake data every 1 minute from the USGS Earthquake API (all_hour.geojson feed). The USGS updates this feed approximately
                once per minute, reflecting seismic events detected within the past hour.
            </p>
        </Section>
    );
}
