import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";

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

function MapComponent({ coordsObj, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (coordsObj?.mapCenter) {
      map.flyTo(coordsObj.mapCenter, zoom);
    }
  }, [coordsObj]);

  return (
    <>
      {coordsObj.coords.map((el, ind) => (
        <Marker key={ind} position={[el.lat, el.lon]}>
          <Popup>
            {el?.popup
              ? el.popup
              : `Lat: ${el.lat.toFixed(4)}, Lng: ${el.lon.toFixed(4)}`}
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function MouseTracker() {
  const [pos, setPos] = useState(null);

  useMapEvents({
    mousemove(e) {
      setPos(e.latlng);
    },
  });

  return pos ? (
    <div
      className="absolute start-4 bottom-4 bg-white px-2 py-1 rounded-sm z-50 text-gray-500 text-xs shadow-lg "
      style={{
        zIndex: 1000,
      }}
    >
      Lat: {pos.lat.toFixed(4)}, Lng: {pos.lng.toFixed(4)}
    </div>
  ) : null;
}

export default function Map({
  zoom = 5,
  initCenter = [38, 28],
  coordsObj = null,
}) {
  return (
    <div className="h-96 z-40">
      <MapContainer
        zoom={zoom}
        onMou
        scrollWheelZoom={true}
        center={initCenter}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MouseTracker />
        {coordsObj && <MapComponent coordsObj={coordsObj} zoom={zoom} />}
      </MapContainer>
    </div>
  );
}
