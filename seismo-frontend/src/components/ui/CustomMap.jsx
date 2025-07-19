import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  GeoJSON,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issue (required for correct marker icons)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to render an array of markers inside a LayerGroup
function MarkersComponent({ markers }) {
  return (
    <LayerGroup>
      {markers.map((marker, idx) => (
        <Marker key={idx} position={marker.position}>
          <div className="max-h-52 overflow-scroll bg-amber-300">
            {marker.popupText && <Popup>{marker.popupText}</Popup>}
          </div>
        </Marker>
      ))}
    </LayerGroup>
  );
}

// Component to show live mouse coordinates on the map
function MouseTracker() {
  const [pos, setPos] = useState(null);

  useMapEvents({
    mousemove(e) {
      setPos(e.latlng);
    },
  });

  return pos ? (
    <div
      style={{
        position: "absolute",
        left: "1rem",
        bottom: "1rem",
        backgroundColor: "white",
        padding: "0.25rem 0.5rem",
        borderRadius: "0.25rem",
        fontSize: "0.75rem",
        color: "#555",
        zIndex: 1000,
      }}
    >
      Lat: {pos.lat.toFixed(4)}, Lng: {pos.lng.toFixed(4)}
    </div>
  ) : null;
}

/**
 * CustomMap component
 *
 * Props:
 * - center: [lat, lng] initial map center
 * - zoom: number initial zoom level
 * - layerGroups: Array of layer group objects with this shape:
 *   [
 *     {
 *       name: string,             // Label for LayersControl
 *       type: 'markers' | 'geojson', // How to render the data
 *       data: Array or GeoJSON,   // Marker array or GeoJSON FeatureCollection
 *       onEachFeature?: function, // Optional for GeoJSON popup/event binding
 *     },
 *     ...
 *   ]
 * - showCoordsOnHover: boolean, whether to display mouse coordinates (default true)
 * - showLayersControl: boolean, whether to show the LayersControl UI (default true)
 */
export default function CustomMap({
  center = [51.505, -0.09],
  zoom = 13,
  layerGroups = [],
  showCoordsOnHover = true,
  showLayersControl = true,
}) {

  return (
    <div className="h-96 " style={{ "zIndex": "1" }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showLayersControl ? (
          <LayersControl position="topright">
            {layerGroups.map(({ name, type, data, onEachFeature }, i) => (
              <LayersControl.Overlay key={i} name={name} checked>
                {type === "markers" ? (
                  <MarkersComponent markers={data} />
                ) : type === "geojson" ? (
                  <GeoJSON data={data} onEachFeature={onEachFeature} />
                ) : null}
              </LayersControl.Overlay>
            ))}
          </LayersControl>
        ) : (
          <>
            {layerGroups.map(({ type, data, onEachFeature }, i) =>
              type === "markers" ? (
                <MarkersComponent key={i} markers={data} />
              ) : type === "geojson" ? (
                <GeoJSON key={i} data={data} onEachFeature={onEachFeature} />
              ) : null
            )}
          </>
        )}

        {/* Mouse position display */}
        {showCoordsOnHover && <MouseTracker />}
      </MapContainer>
    </div>
  );
}

/* --------------------------------------------------
Example of what to pass as `layerGroups` prop:

const layerGroups = [
  {
    name: "Earthquakes < 5",
    type: "markers",
    data: [
      { position: [51.505, -0.09], mag: 4.5, popupText: "Mag 4.5" },
      { position: [51.503, -0.08], mag: 3.2, popupText: "Mag 3.2" },
      // add more markers here
    ],
  },
  {
    name: "Earthquakes ≥ 5",
    type: "markers",
    data: [
      { position: [51.51, -0.1], mag: 5.2, popupText: "Mag 5.2" },
      { position: [51.52, -0.12], mag: 6.1, popupText: "Mag 6.1" },
      // add more markers here
    ],
  },
  {
    name: "Fault Lines",
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Fault Line A" },
          geometry: {
            type: "LineString",
            coordinates: [
              [-0.1, 51.51],
              [-0.12, 51.52],
              [-0.13, 51.5],
            ],
          },
        },
        // more GeoJSON features...
      ],
    },
    onEachFeature: (feature, layer) => {
      if (feature.properties && feature.properties.name) {
        layer.bindPopup(`Fault: ${feature.properties.name}`);
      }
    },
  },
];
-------------------------------------------------- */
