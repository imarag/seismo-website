'use client';
import { useState, useEffect } from "react";
import { LuCalculator } from "react-icons/lu";
import CoordItem from "@/components/CoordItem";
import CoordContainer from "@/components/CoordContainer";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import "leaflet/dist/leaflet.css";
import Map from "@/components/distance-between-points-map"
import { fastapiEndpoints } from "@/utils/static";
import Spinner from "@/components/Spinner";
import fetchRequest from "@/utils/functions/fetchRequest";
import ErrorMessage from "@/components/ErrorMessage";


export default function DistanceBetweenPoints() {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    // set the state that holds the coordinates passed by the user
    const [coords, setCoords] = useState({
        lat1: 34,
        lon1: 22,
        lat2: 32,
        lon2: 24,
    });

    // set the state of the distance that is showing
    const [distance, setDistance] = useState(null);

    async function handleComputeButton() {
        setLoading(true)
     
        let endpoint = fastapiEndpoints["CALCULATE-DISTANCE"]
        let queryParams = `lat1=${coords["lat1"]}&lon1=${coords["lon1"]}&lat2=${coords["lat2"]}&lon2=${coords["lon2"]}`
        console.log(`${endpoint}?${queryParams}`)
        fetchRequest({endpoint: `${endpoint}?${queryParams}`, method: "GET"})
        .then(jsonData => {
            setDistance(jsonData["result"]);
            // setInfoMessage("The distance has been succesfully calculated");
            // setTimeout(() => setInfoMessage(null), 5000);
        })
        .catch(error => {
            // setErrorMessage(error.message || "Error uploading file. Please try again.");            
            // setTimeout(() => setErrorMessage(null), 5000);
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <section>
            {
                error && <ErrorMessage error={error} />
            }
            <div className="flex flex-row flex-wrap justify-center items-center gap-4">
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
            <div className="flex flex-row justify-center gap-2 my-5">
                <ButtonWithIcon text="Compute" onClick={handleComputeButton} disabled={!coords["lat1"] || !coords["lon1"] || !coords["lat2"] || !coords["lon2"]} icon={<LuCalculator />} />
            </div>
            { loading && <Spinner />}
            {distance && (
                <p className="text-center my-5">
                    The distance between point 1 (lat: {coords["lat1"]}, lon: {coords["lon1"]}) and point 2 (lat: {coords["lat2"]}, lon: {coords["lon2"]}) is:{" "}
                    <span className="fw-bold">{distance} km</span>
                </p>
            )}
            <Map coords={coords} />
            <p className="mt-12 mb-5">The tool uses the <code>obspy.geodetics.base.gps2dist_azimuth</code> function to do the calculation:</p>
            <div className="mockup-code">
                <pre>
                    <code>
                        gps2dist_azimuth(lat1, lon1, lat2, lon2, a=6378137.0, f=0.0033528106647474805)
                    </code>
                </pre>
            </div>
        </section>
    );
}