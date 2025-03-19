
import { useState } from "react";

import Button from "@/components/ui/Button";
import LinkTag from "@/components/ui/LinkTag"
import Message from "@/components/ui/Message";
import {
    FormElement,
    LabelElement,
} from "@/components/ui/UIElements";
import { Paragraph } from "@/components/utils/Typography"
import MockupCode from "@/components/utils/MockupCode";
import CenterHorizontally from "@/components/utils/CenterHorizontally";
import HRLine from "@/components/utils/HRLine"
import Icon from "@/components/utils/Icon"

import { fastapiEndpoints } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";

// import "leaflet/dist/leaflet.css";
// import Map from "@/components/tools/distance-between-points-map"

import { LuCalculator } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";


function CoordContainer({ children, label }) {
    return (
        <div>
            <h1 className="text-start flex flex-row items-center justify-center md:justify-start gap-2 mb-1">
                <Icon icon={IoLocationOutline} />
                <span>{ label }</span>
            </h1>
            <HRLine />
            <div className="flex flex-row flex-wrap md:flex-nowrap justify-center gap-2 mt-4">
                { children }
            </div>
        </div>
    )
}


function CoordItem({ coordLabel, coordValue, coords, setCoords }) {
    return (
        <div className="flex flex-col items-stretch justify-center gap-2">
            <LabelElement 
                htmlFor={coordValue} 
                label={coordLabel} 
            />
            <FormElement 
                type="number"
                id={coordValue} 
                name={coordValue} 
                value={coords[coordValue]} 
                onChange={(e) => setCoords({...coords, [coordValue]: e.target.value})}
                size="sm"
            />
        </div>
    )
}

function CoordinatesFields({ coords, setCoords }) {
    return (
        <div className="flex flex-row flex-wrap lg:flex-nowrap justify-center items-center gap-8">
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
    )
}


export default function DistanceBetweenPoints() {

    const [error, setError] = useState([])
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false);
    const [coords, setCoords] = useState({lat1: 34, lon1: 22, lat2: 32, lon2: 24});
    const [gps2azimuth, setGps2azimuth] = useState({
        distance_km: null, 
        azimuth_a_b: null, 
        azimuth_b_a: null
    });

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

        setGps2azimuth(data)
    }

    return (
        <>
            {
                error.length !==0 && <Message setError={setError} setSuccess={setSuccess} type="error" text={error} />
            }
            {
                success && <Message setError={setError} setSuccess={setSuccess} type="success" text={success} />
            }
            <CoordinatesFields
                coords={coords}
                setCoords={setCoords} 
            />
            <CenterHorizontally className="my-8">
                <Button 
                    onClick={handleComputeButton} 
                    disabled={!coords["lat1"] || !coords["lon1"] || !coords["lat2"] || !coords["lon2"]} 
                    loading={loading}
                    toolTipText="Compute the distance between two geographic points on the WGS84 ellipsoid"
                >
                    Compute
                    <Icon icon={LuCalculator} />
                </Button>
            </CenterHorizontally>
            {gps2azimuth["distance_km"] && (
                <CenterHorizontally>
                    <Paragraph>
                        The distance between point 1 and point 2 is {" "}
                        <span className="font-bold">{gps2azimuth.distance_km} km</span> with azimuth of {" "}
                        point 1 to point 2, <span className="font-bold">{gps2azimuth.azimuth_a_b}</span> degrees, {" "}
                        and of point 2 to point 1, <span className="font-bold">{gps2azimuth.azimuth_b_a}</span> degrees
                    </Paragraph>
                </CenterHorizontally>
            )}
            {/* <Map coords={coords} /> */}
            <div className="mt-16">
                <Paragraph>
                    The tool utilizes the {" "}
                    <LinkTag external={true} href="https://docs.obspy.org/packages/autogen/obspy.geodetics.base.gps2dist_azimuth.html">
                        <code>gps2dist_azimuth</code>
                    </LinkTag>
                    {" "} 
                    function to do the calculation.
                </Paragraph>
                <MockupCode 
                    codeItems = {
                        [
                            "from obspy.geodetics.base import gps2dist_azimuth",
                            "gps2dist_azimuth(lat1, lon1, lat2, lon2, a=6378137.0, f=0.0033528106647474805)"
                        ]
                    }
                />
            </div>
        </>
    );
}