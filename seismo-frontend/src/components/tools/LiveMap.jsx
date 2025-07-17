import { useEffect, useState } from "react";
import CustomMap from "../ui/CustomMap";
import { apiRequest } from "../../assets/utils/apiRequest";
import Message from "../ui/Message";


export default function LiveMap() {
    const [showMessage, setShowMessage] = useState({
        message: "",
        type: "",
    });
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        async function fetchLatestData() {
            const { resData: seismoData, error } = await apiRequest({
                url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
                method: "get",
                setShowMessage: setShowMessage,
                setLoading: setLoading,
                successMessage:
                    "Live earthquake data has been downloaded succesfully.",
                errorMessage: "Cannot download the arrivals. Please try again later.",
            });
            setData(seismoData)
        }
        fetchLatestData()
    }, [])
    console.log(data)

    function onEachFeature(feature, layer) {
        console.log(feature.properties, "***************")
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
            console.log(popupContent)

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
        <>
            {showMessage.message && (
                <Message
                    message={showMessage.message}
                    type={showMessage.type}
                    onClose={() =>
                        setShowMessage({
                            type: "",
                            message: "",
                        })
                    }
                />
            )}
            <CustomMap
                center={[51.505, -0.09]}
                zoom={3}
                layerGroups={layerGroups}
                showLayersControl={false}
                showCoordsOnHover={true}
            />
        </>
    )
}