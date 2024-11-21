import { useState, useEffect } from "react";
import { CalculatorIcon } from "../../SvgIcons"
import CoordItem from "../../components/CoordItem";
import CoordContainer from "../../components/CoordContainer";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import "leaflet/dist/leaflet.css";
import Map from "../../components/distance-between-points-map"
import { serverUrl } from "../../data";

export default function DistanceBetweenPoints() {
    // set the state that holds the coordinates passed by the user
    const [coords, setCoords] = useState({
        lat1: 34,
        lon1: 22,
        lat2: 32,
        lon2: 24,
    });

    // set the state of the distance that is showing
    const [distance, setDistance] = useState(null);

    // compute the distance
    function handleComputeButton() {
        async function calculateDistance() {
            const queryParams = `lat1=${coords["lat1"]}&lon1=${coords["lon1"]}&lat2=${coords["lat2"]}&lon2=${coords["lon2"]}`;
            const res = await fetch(
                `${serverUrl}/distance-between-points/calculate-distance?` + queryParams,
                {credentials: 'include'}
            );
            const jsonData = await res.json();
            setDistance(jsonData["result"]);
        }
        calculateDistance();
    }

    return (
        <div>
            <div className="d-flex flex-row flex-wrap justify-content-center gap-4">
                <CoordContainer label="Point 1">
                    <CoordItem
                        coordLabel="Latitude"
                        coordValue="lat1"
                        coords={coords}
                        setCoords={setCoords}
                    />
                    <CoordItem
                        coordLabel="Longitude"
                        coordValue="lon1"
                        coords={coords}
                        setCoords={setCoords}
                    />
                </CoordContainer>
                <CoordContainer label="Point 2">
                    <CoordItem
                        coordLabel="Latitude"
                        coordValue="lat2"
                        coords={coords}
                        setCoords={setCoords}
                    />
                    <CoordItem
                        coordLabel="Longitude"
                        coordValue="lon2"
                        coords={coords}
                        setCoords={setCoords}
                    />
                </CoordContainer>
            </div>
            <div className="d-flex flex-row justify-content-center gap-2 my-5">
                <ButtonWithIcon text="Compute" onClick={handleComputeButton} disabled={!coords["lat1"] || !coords["lon1"] || !coords["lat2"] || !coords["lon2"]}>
                    <CalculatorIcon />
                </ButtonWithIcon>
            </div>
            {distance && (
                <p className="text-center my-5">
                    The distance between point 1 (lat: {coords["lat1"]}, lon: {coords["lon1"]}) and point 2 (lat: {coords["lat2"]}, lon: {coords["lon2"]}) is:{" "}
                    <span className="fw-bold">{distance} km</span>
                </p>
            )}
            <Map coords={coords} />
        </div>
    );
}