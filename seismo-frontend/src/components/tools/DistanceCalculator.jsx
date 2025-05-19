import { useState } from "react";
import Button from "../ui/Button";
import fetchRequest from "../../assets/utils/fetchRequest";
import { fastapiEndpoints } from "../../assets/data/static.js";
import Label from "../ui/Label";
import Input from "../ui/Input";

function CoordContainer({ label, children }) {
  return (
    <div>
      <h1 className="text-start flex flex-row items-center justify-center md:justify-start gap-2 mb-1">
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
  <div className="flex flex-col items-stretch justify-center gap-2">
    <Label htmlFor={coordValue} label={coordLabel} />
    <Input
      type="number"
      id={coordValue}
      name={coordValue}
      value={coords[coordValue]}
      onChange={(e) => setCoords({ ...coords, [coordValue]: e.target.value })}
      size="sm"
    />
  </div>;
}

export default function DistanceCalculator() {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState([]);
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
    const data = await fetchRequest({
      endpoint: fastapiEndpoints["CALCULATE-DISTANCE"] + queryParams,
      setError: setError,
      setSuccess: setSuccess,
      setLoading: setLoading,
      method: "GET",
      successMessage: "The distance has been succesfully calculated",
    });

    setGps2azimuth(data);
  }

  return (
    <>
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
      {error.length !== 0 && (
        <Message
          setError={setError}
          setSuccess={setSuccess}
          type="error"
          text={error}
        />
      )}
      {success && (
        <Message
          setError={setError}
          setSuccess={setSuccess}
          type="success"
          text={success}
        />
      )}
      <CoordinatesFields coords={coords} setCoords={setCoords} />
      <div className="my-8">
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
          <Symbol name="calculator" />
        </Button>
      </div>
      {gps2azimuth["distance_km"] && (
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
    </>
  );
}
