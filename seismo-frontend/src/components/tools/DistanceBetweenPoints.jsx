import { useState } from "react";
import Button from "../ui/Button";
import Message from "../ui/Message";
import Input from "../ui/Input.jsx";
import Label from "../ui/Label.jsx";
import { fastapiEndpoints } from "../../assets/data/static";
import { LuCalculator } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { apiRequest } from "../../assets/utils/apiRequest.js";

function CoordContainer({ children, label }) {
  return (
    <div>
      <h1 className="text-start flex flex-row items-center justify-center md:justify-start gap-2 mb-1">
        <IoLocationOutline />
        <span>{label}</span>
      </h1>
      <hr className="border-neutral-500/50 my-2 w-full" />

      <div className="flex flex-row flex-wrap md:flex-nowrap justify-center gap-2 mt-4">
        {children}
      </div>
    </div>
  );
}

function CoordItem({ coordLabel, coordValue, coords, setCoords }) {
  return (
    <div className="flex flex-col items-stretch justify-center gap-2">
      <Label htmlFor={coordValue}>{coordLabel}</Label>
      <Input
        type="number"
        id={coordValue}
        name={coordValue}
        value={coords[coordValue]}
        onChange={(e) => setCoords({ ...coords, [coordValue]: e.target.value })}
        size="sm"
      />
    </div>
  );
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
  );
}

export default function DistanceBetweenPoints() {
  const [showMessage, setShowMessage] = useState({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({
    lat1: 34,
    lon1: 22,
    lat2: 32,
    lon2: 24,
  });
  const [gps2azimuth, setGps2azimuth] = useState({
    distance_km: null,
    azimuth_a_b: null,
    azimuth_b_a: null,
  });

  async function handleComputeButton() {
    let queryParams = `?lat1=${coords["lat1"]}&lon1=${coords["lon1"]}&lat2=${coords["lat2"]}&lon2=${coords["lon2"]}`;
    const { resData, error } = await apiRequest({
      url: fastapiEndpoints["CALCULATE-DISTANCE"] + queryParams,
      method: "get",
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      successMessage: "Distance calculated successfully.",
      errorMessage:
        "Cannot compute the distance between the points. Please try again later.",
    });

    if (error) {
      return;
    }

    setGps2azimuth(resData);
  }

  return (
    <>
      {showMessage.message && (
        <Message
          message={showMessage.message}
          type={showMessage.type}
          autoDismiss={5000}
          position="bottom-right"
          onClose={() =>
            setShowMessage({
              type: "",
              message: "",
            })
          }
        />
      )}
      <CoordinatesFields coords={coords} setCoords={setCoords} />
      <div className="my-8 text-center">
        <Button
          onClick={handleComputeButton}
          disabled={
            !coords["lat1"] ||
            !coords["lon1"] ||
            !coords["lat2"] ||
            !coords["lon2"]
          }
          loading={loading}
          tooltiptext="Compute the distance between two geographic points on the WGS84 ellipsoid"
        >
          Compute
          <LuCalculator />
        </Button>
      </div>
      {gps2azimuth["distance_km"] >= 0 && (
        <div>
          <p>
            The distance between point 1 and point 2 is{" "}
            <span className="font-bold">{gps2azimuth.distance_km} km</span> with
            azimuth of point 1 to point 2,{" "}
            <span className="font-bold">{gps2azimuth.azimuth_a_b}</span>{" "}
            degrees, and of point 2 to point 1,{" "}
            <span className="font-bold">{gps2azimuth.azimuth_b_a}</span> degrees
          </p>
        </div>
      )}
      {/* <Map coords={coords} /> */}
      <div className="mt-16">
        <p>
          The tool utilizes the{" "}
          <a
            target="_blank"
            href="https://docs.obspy.org/packages/autogen/obspy.geodetics.base.gps2dist_azimuth.html"
          >
            <code>gps2dist_azimuth</code>
          </a>{" "}
          function to do the calculation.
        </p>
        <div className="mockup-code my-4">
          <pre data-prefix={1}>
            <code>from obspy.geodetics.base import gps2dist_azimuth</code>
          </pre>
          <pre data-prefix={2}>
            <code>
              gps2dist_azimuth(lat1, lon1, lat2, lon2, a=6378137.0,
              f=0.0033528106647474805)
            </code>
          </pre>
        </div>
      </div>
    </>
  );
}
