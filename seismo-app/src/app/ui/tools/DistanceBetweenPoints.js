'use client';

import { useState } from "react";

import ButtonWithIcon from "@/components/ButtonWithIcon";
import Message from "@/components/Message";
import Spinner from "@/components/Spinner";
import { NumberInputElement } from "@/components/UIElements"
import Section from "@/components/Section";

import { fastapiEndpoints } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";

import "leaflet/dist/leaflet.css";
import Map from "@/components/distance-between-points-map"

import { LuCalculator } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";


function CoordContainer({ children, label }) {
    return (
        <div>
            <h1 className="text-start flex flex-row align-center justify-center md:justify-start gap-2 mb-1">
                <IoLocationOutline />
                <span>{ label }</span>
            </h1>
            <hr className="border-1"/>
            <div className="flex flex-row flex-wrap md:flex-nowrap justify-center gap-2 mt-4">
                { children }
            </div>
        </div>
    )
}


function CoordItem({ coordLabel, coordValue, coords, setCoords }) {
    return (
        <div className="flex flex-col items-stretch justify-center">
            <label htmlFor={coordValue} className="text-start font-light mb-1">
                { coordLabel }
            </label>
            <NumberInputElement 
                id={coordValue} 
                name={coordValue} 
                value={coords[coordValue]} 
                onChange={(e) => setCoords({...coords, [coordValue]: e.target.value})}
                className="input-sm"
            />
        </div>
    )
}


export default function DistanceBetweenPoints() {

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false);
    const [coords, setCoords] = useState({lat1: 34, lon1: 22, lat2: 32, lon2: 24});
    const [distance, setDistance] = useState(null);

    async function handleComputeButton() {
     
        let queryParams = `?lat1=${coords["lat1"]}&lon1=${coords["lon1"]}&lat2=${coords["lat2"]}&lon2=${coords["lon2"]}`

        const data = await fetchRequest({
            endpoint: fastapiEndpoints["CALCULATE-DISTANCE"] + queryParams,
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "GET",
            successMessage: "The distance has been succesfully calculated"
        });

        setDistance(data["result"])
    }

    return (
        <Section>
            {
                error && <Message type="error" text={error} />
            }
            {
                success && <Message type="success" text={success} />
            }
            <div className="flex flex-row flex-wrap justify-center items-center gap-8">
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
            <div className="flex flex-row justify-center gap-2">
                <ButtonWithIcon 
                    text="Compute" 
                    onClick={handleComputeButton} 
                    disabled={!coords["lat1"] || !coords["lon1"] || !coords["lat2"] || !coords["lon2"]} 
                    icon={<LuCalculator />} 
                    className="btn-md btn-primary"
                />
            </div>
            <Spinner visible={loading} />
            {distance && (
                <p className="text-center">
                    The distance between point 1 (lat: {coords["lat1"]}, lon: {coords["lon1"]}) and point 2 (lat: {coords["lat2"]}, lon: {coords["lon2"]}) is:{" "}
                    <span className="font-bold">{distance} km</span>
                </p>
            )}
            <div>
                <Map coords={coords} />
            </div>
            <p>
                The tool uses the ObsPy <a className="link-info" target="_blank" href="https://docs.obspy.org/packages/autogen/obspy.geodetics.base.gps2dist_azimuth.html"><code>gps2dist_azimuth</code> </a> function to do the calculation:
            </p>
            <div className="mockup-code">
                <pre>
                    <code>
                        gps2dist_azimuth(lat1, lon1, lat2, lon2, a=6378137.0, f=0.0033528106647474805)
                    </code>
                </pre>
            </div>
        </Section>
    );
}