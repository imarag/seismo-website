import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import { useEffect } from "react";
import L from 'leaflet';

// Import the default Leaflet marker images
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up default icon configuration
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Apply the default icon globally
L.Marker.prototype.options.icon = DefaultIcon;

function MapComponent({ coords }) {
    let lat1 = coords["lat1"];
    let lon1 = coords["lon1"];
    let lat2 = coords["lat2"];
    let lon2 = coords["lon2"];
    let lons = [lon1, lon2];
    let lats = [lat1, lat2];
    const map = useMap();
    const latCenter =
        Math.min(...lats) + Math.abs(coords["lat2"] - coords["lat1"]) / 2;
    const lonCenter =
        Math.min(...lons) + Math.abs(coords["lon2"] - coords["lon1"]) / 2;

    useEffect(() => {
        map.setView([latCenter, lonCenter], 8);
    }, [map, coords]);

    return null;
}

export default function Map({ coords }) {
    let lat1 = coords["lat1"];
    let lon1 = coords["lon1"];
    let lat2 = coords["lat2"];
    let lon2 = coords["lon2"];

    return (
        <MapContainer
            center={[23, 43]}
            zoom={5}
            scrollWheelZoom={true}
            style={{height: "500px"}}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat1, lon1]}></Marker>
            <Marker position={[lat2, lon2]}></Marker>
            <MapComponent coords={coords} />
        </MapContainer>
    );
}
