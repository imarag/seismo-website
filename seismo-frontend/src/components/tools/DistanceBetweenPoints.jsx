import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import Button from "../ui/Button";
import Message from "../ui/Message";
import ToolTip from "../ui/ToolTip.jsx";
import Symbol from "../ui/Symbol";
import Input from "../ui/Input.jsx";
import Label from "../ui/Label.jsx";
import { fastapiEndpoints } from "../../assets/data/static";
import { LuCalculator } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { apiRequest } from "../../assets/utils/apiRequest.js";
import { BsFillQuestionCircleFill } from "react-icons/bs";

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapComponent({ gps2azimuth }) {
  const map = useMap();
  const mapCenter = [
    (gps2azimuth.coords.lat1 + gps2azimuth.coords.lat2) / 2,
    (gps2azimuth.coords.lon1 + gps2azimuth.coords.lon2) / 2,
  ];
  const distance = gps2azimuth.distance_km;
  useEffect(() => {
    if (distance >= 0) {
      map.setView(mapCenter, 5);
    }
  }, [gps2azimuth]);

  return (
    <>
      {distance >= 0 && (
        <>
          <Marker position={[gps2azimuth.coords.lat1, gps2azimuth.coords.lon1]}>
            <Popup>
              Point 1: lat={gps2azimuth.coords.lat1}, lon=
              {gps2azimuth.coords.lon1}
            </Popup>
          </Marker>
          <Marker position={[gps2azimuth.coords.lat2, gps2azimuth.coords.lon2]}>
            <Popup>
              Point 2: lat={gps2azimuth.coords.lat2}, lon=
              {gps2azimuth.coords.lon2}
            </Popup>
          </Marker>
        </>
      )}
    </>
  );
}

function Map({ gps2azimuth }) {
  return (
    <div className="h-96 z-40">
      <MapContainer
        zoom={5}
        scrollWheelZoom={true}
        center={[38, 28]}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gps2azimuth && <MapComponent gps2azimuth={gps2azimuth} />}
      </MapContainer>
    </div>
  );
}

function CoordContainer({ children, label }) {
  return (
    <div className="space-y-2">
      <h2 className="text-start flex flex-row items-center justify-center md:justify-start gap-2 mb-1">
        <Symbol IconComponent={IoLocationOutline} />
        <span>{label}</span>
        <ToolTip
          className="ms-auto"
          toolTipText={`Enter coordinates (lat: -90° to 90°, lon: -180° to 180°) for Point 1 and Point 2 to compute the distance and azimuths on the WGS84 ellipsoid. You can preview their positions on the map.`}
        >
          <Symbol IconComponent={BsFillQuestionCircleFill} />
        </ToolTip>
      </h2>
      <hr className="border-neutral-500/30 w-full" />
      <div className="flex flex-row flex-wrap md:flex-nowrap justify-center gap-2 mt-4">
        {children}
      </div>
    </div>
  );
}

function CoordItem({ coordLabel, coordValue, coords, setCoords }) {
  const minValue = coordLabel === "Latitude" ? -90 : -180;
  const maxValue = coordLabel === "Latitude" ? 90 : 180;
  return (
    <div className="flex flex-col items-stretch justify-center gap-2">
      <Label htmlFor={coordValue}>{coordLabel}</Label>
      <Input
        type="number"
        id={coordValue}
        min={minValue}
        max={maxValue}
        name={coordValue}
        value={coords[coordValue]}
        onChange={(e) =>
          setCoords({ ...coords, [coordValue]: Number(e.target.value) })
        }
        className="w-34"
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

function CoordsComputeResult({ gps2azimuth }) {
  return (
    <p>
      The distance between point 1 (latitude: {gps2azimuth.coords.lat1},{" "}
      longitude: {gps2azimuth.coords.lon1}) and point 2 (latitude:{" "}
      {gps2azimuth.coords.lat2}, longitude: {gps2azimuth.coords.lon2}) is{" "}
      <span className="font-bold">{gps2azimuth.distance_km} km</span> with
      azimuth of point 1 to point 2,{" "}
      <span className="font-bold">{gps2azimuth.azimuth_a_b}</span> degrees, and
      of point 2 to point 1,{" "}
      <span className="font-bold">{gps2azimuth.azimuth_b_a}</span> degrees
    </p>
  );
}

function ObspyExample() {
  return (
    <>
      <p>
        The tool utilizes the{" "}
        <a
          className="link link-info link-hover"
          target="_blank"
          href="https://docs.obspy.org/packages/autogen/obspy.geodetics.base.gps2dist_azimuth.html"
        >
          <code>gps2dist_azimuth</code>
        </a>{" "}
        function to do the calculation.
      </p>
      <div className="mockup-code">
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
    </>
  );
}

function validateCoords(coords) {
  const { lat1, lat2, lon1, lon2 } = coords;

  const latitudesAreValid =
    lat1 >= -90 && lat1 <= 90 && lat2 >= -90 && lat2 <= 90;
  const longitudesAreValid =
    lon1 >= -180 && lon1 <= 180 && lon2 >= -180 && lon2 <= 180;

  return latitudesAreValid && longitudesAreValid;
}

export default function DistanceBetweenPoints() {
  const [showMessage, setShowMessage] = useState({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({
    lat1: 0,
    lon1: 0,
    lat2: 0,
    lon2: 0,
  });
  const [gps2azimuth, setGps2azimuth] = useState(null);

  const coordsValid = validateCoords(coords);

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
    <div className="space-y-8">
      {showMessage.message && (
        <Message
          message={showMessage.message}
          type={showMessage.type}
          autoDismiss={5000}
          position="top-right"
          onClose={() =>
            setShowMessage({
              type: "",
              message: "",
            })
          }
        />
      )}
      <CoordinatesFields coords={coords} setCoords={setCoords} />
      {!coordsValid && (
        <p className="text-error text-center text-sm">
          Please enter valid coordinates:
          <br />
          Latitude must be between <strong>-90°</strong> and{" "}
          <strong>90°</strong>, and longitude between <strong>-180°</strong> and{" "}
          <strong>180°</strong>.
        </p>
      )}
      <div className="text-center">
        <Button
          onClick={handleComputeButton}
          loading={loading}
          disabled={!coordsValid}
          toolTipText="Compute the distance between two geographic points on the WGS84 ellipsoid"
        >
          Compute
          <LuCalculator />
        </Button>
      </div>
      {gps2azimuth && <CoordsComputeResult gps2azimuth={gps2azimuth} />}
      <Map gps2azimuth={gps2azimuth} />
      <ObspyExample />
    </div>
  );
}
