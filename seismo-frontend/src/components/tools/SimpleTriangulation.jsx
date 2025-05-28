import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap, Circle } from "react-leaflet";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { fastapiEndpoints } from "../../assets/data/static";
import { apiRequest } from "../../assets/utils/apiRequest";
import { FaTrashCan } from "react-icons/fa6";
import "leaflet/dist/leaflet.css";
import { getRandomNumber } from "../../assets/utils/utility-functions";
import L from "leaflet";
import { useState, useEffect } from "react";

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

function MapComponent({ stationInfo, triangDistance }) {
  const map = useMap();

  useEffect(() => {
    if (stationInfo.length < 1) {
      return;
    }

    const lastEditedCoords =
      stationInfo.find((el) => el["last-edited"] === true) ||
      stationInfo[stationInfo.length - 1];
    map.setView(
      [lastEditedCoords["station-lat"], lastEditedCoords["station-lon"]],
      5
    );
  }, [stationInfo]);

  return (
    <>
      {stationInfo.map((el, ind) => (
        <div key={el["station-id"]}>
          <Marker key={ind} position={[el["station-lat"], el["station-lon"]]}>
            <Popup>Station {ind + 1}</Popup>
          </Marker>
          <Circle
            center={[el["station-lat"], el["station-lon"]]}
            radius={triangDistance}
            pathOptions={{ color: "blue", fillOpacity: 0.2 }}
          />
        </div>
      ))}
    </>
  );
}

function Map({ stationInfo, triangDistance }) {
  return (
    <div className="h-96">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapComponent
          stationInfo={stationInfo}
          triangDistance={triangDistance}
        />
      </MapContainer>
    </div>
  );
}

function StationsList({ stationInfo, setStationInfo }) {
  function handleChangeStationProps(stationId, prop, value) {
    const newStationInfo = stationInfo.map((el) => {
      if (stationId === el["station-id"]) {
        return {
          ...el,
          [prop]: value,
          "last-edited": true,
        };
      } else {
        return {
          ...el,
          "last-edited": false,
        };
      }
    });
    setStationInfo(newStationInfo);
  }

  function handleDeleteStation(stationId) {
    const newStations = stationInfo.filter(
      (el) => el["station-id"] !== stationId
    );
    setStationInfo(newStations);
  }

  return (
    <div className="overflow-scroll h-full">
      {stationInfo.map((el, ind) => (
        <div
          key={ind}
          className="border-l-2 flex items-center justify-between gap-2 border-white/10 px-4 rounded-none relative text-sm my-4"
        >
          <div>
            <h2>Station{ind + 1}</h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="station-lat">Station coords: </Label>
              <Input
                type="number"
                size="extra-small"
                id="station-lat"
                name="station-lat"
                className="w-24"
                value={el["station-lat"]}
                onChange={(e) =>
                  handleChangeStationProps(
                    el["station-id"],
                    "station-lat",
                    e.target.value
                  )
                }
              />
              <Input
                type="number"
                size="extra-small"
                id="station-lon"
                name="station-lon"
                className="w-24"
                value={el["station-lon"]}
                onChange={(e) =>
                  handleChangeStationProps(
                    el["station-id"],
                    "station-lon",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="arrival-difference">Arrival difference: </Label>
              <Input
                type="number"
                size="extra-small"
                id="arrival-difference"
                name="arrival-difference"
                className="w-30"
                value={el["arrival-difference"]}
                onChange={(e) =>
                  handleChangeStationProps(
                    el["station-id"],
                    "arrival-difference",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
          <div>
            <Button
              size="extra-small"
              style="error"
              outline={true}
              toolTipText="Delete current station"
              toolTipPosition="left"
              onClick={(e) => handleDeleteStation(el["station-id"])}
            >
              <FaTrashCan />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MainContent({
  stationInfo,
  setStationInfo,
  showMessage,
  setShowMessage,
  loading,
  setLoading,
  triangDistance,
  setTriangDistance,
}) {
  function handleAddStationInfo() {
    const newStationInfo = {
      "station-id": getRandomNumber(),
      "station-lat": 0,
      "station-lon": 0,
      "arrival-difference": 0,
      "last-edited": true,
    };
    setStationInfo([...stationInfo, newStationInfo]);
  }

  async function handleTriangulate() {
    const { resData, error } = await apiRequest({
      url: fastapiEndpoints["TRIANGULATE-STATIONS"],
      method: "post",
      requestData: stationInfo,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      successMessage: "The epicenter has been calculated!",
      errorMessage: "Cannot calculate the hypocenter. Please try again later!",
    });

    if (error) {
      return;
    }

    setTriangDistance(Number(resData));
  }

  return (
    <div className="h-96 flex flex-col">
      <div className="flex items-center gap-4 mb-8 shrink-0 grow-0">
        <Button
          size="small"
          style="info"
          outline={true}
          toolTipText="Add a station"
          onClick={handleAddStationInfo}
        >
          +Add station
        </Button>
        <Button
          size="small"
          style="info"
          outline={true}
          toolTipText="Remove all stations"
          onClick={() => setStationInfo([])}
        >
          Reset
        </Button>
        <Button
          size="small"
          style="primary"
          toolTipText="Compute the epicenter through triangulation"
          onClick={handleTriangulate}
          disabled={stationInfo.length < 3}
        >
          Triangulate
        </Button>
      </div>
      {stationInfo.length < 3 && (
        <p className="text-sm text-error text-start">
          You need at least 3 stations to triangulate!
        </p>
      )}
      <div className="grow overflow-scroll">
        {stationInfo.length > 0 ? (
          <StationsList
            stationInfo={stationInfo}
            setStationInfo={setStationInfo}
          />
        ) : (
          <p className="mt-4 text-sm">No stations added!</p>
        )}
      </div>
    </div>
  );
}

export default function SimpleTriangulation() {
  const [stationInfo, setStationInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState({
    message: "",
    type: "",
  });
  const [triangDistance, setTriangDistance] = useState(0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-8">
      <MainContent
        stationInfo={stationInfo}
        setStationInfo={setStationInfo}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
        loading={loading}
        setLoading={setLoading}
        triangDistance={triangDistance}
        setTriangDistance={setTriangDistance}
      />
      <Map stationInfo={stationInfo} triangDistance={triangDistance} />
    </div>
  );
}
