import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker  } from "react-leaflet";
import 'leaflet/dist/leaflet.css';


import CoordItem from "../../components/CoordItem"
import CoordContainer from "../../components/CoordContainer"
import CoordButton from "../../components/CoordButton"

function MapComponent({ coords }) {
  let lat1 = coords["lat1"];
  let lon1 = coords["lon1"];
  let lat2 = coords["lat2"];
  let lon2 = coords["lon2"];
  let lons = [lon1, lon2]
  let lats = [lat1, lat2]
  const map = useMap();
  const latCenter = Math.min(...lats) + (Math.abs(coords["lat2"] - coords["lat1"]) / 2)
  const lonCenter = Math.min(...lons) + (Math.abs(coords["lon2"] - coords["lon1"]) / 2)
  
  useEffect(() => {
    map.setView([latCenter, lonCenter], 8);
  }, [map, coords]);

  return null;
}


function Map({ coords }) {
  let lat1 = coords["lat1"];
  let lon1 = coords["lon1"];
  let lat2 = coords["lat2"];
  let lon2 = coords["lon2"];

  return (
    <MapContainer center={[23, 43]} zoom={5} scrollWheelZoom={true} className="h-96">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat1, lon1]}></Marker>
      <Marker position={[lat2, lon2]}></Marker>
      <MapComponent coords={ coords } />
    </MapContainer>
  )
}

 

export default function DistanceBetweenPoints() {

    const [coords, setCoords] = useState({lat1: 34, lon1: 22, lat2: 32, lon2: 24});
    const [distance, setDistance] = useState(null);
    
    function handleComputeButton() {
      async function calculateDistance() {
        const queryParams = `point1-lat=${coords["lat1"]}&point1-lon=${coords["lon1"]}&point2-lat=${coords["lat2"]}&point2-lon=${coords["lon2"]}`
        const res = await fetch("http://127.0.0.1:5000/distance-between-points/calculate-distance?" + queryParams);
        const jsonData = await res.json();
        setDistance(jsonData["result"])
      }
      calculateDistance()
    }


    return (
        <div>
            <h2 className="text-2xl text-center my-12">Calculate the distance between them on the
            WGS84 ellipsoid in kilometers</h2>

            <div className="flex flex-row flex-wrap justify-center gap-8">
                <CoordContainer label="Point 1">
                    <CoordItem coordLabel="Latitude" coordValue="lat1" coords={coords} setCoords={setCoords} />
                    <CoordItem coordLabel="Longitude" coordValue="lon1" coords={coords} setCoords={setCoords} />
                </CoordContainer>
                <CoordContainer label="Point 2">
                    <CoordItem coordLabel="Latitude" coordValue="lat2" coords={coords} setCoords={setCoords} />
                    <CoordItem coordLabel="Longitude" coordValue="lon2" coords={coords} setCoords={setCoords} />
                </CoordContainer>
            </div>
            <div className="flex flex-row justify-center gap-x-2 my-10">
                <CoordButton onClick={handleComputeButton} label="Compute" className="bg-emerald-500" title="calculate the distance between the points">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-calculator-fill" viewBox="0 0 16 16">
                        <path
                            d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-1z" />
                    </svg>
                </CoordButton>
                <CoordButton onClick={() => setCoords({lat1: 34, lon1: 22, lat2: 32, lon2: 24})} label="Reset" className="bg-rose-500" title="empty the coordinate entries">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eraser-fill"
                        viewBox="0 0 16 16">
                        <path
                            d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
                    </svg>
                </CoordButton>
            </div>
            {distance && <p className="text-center my-8">The distance between the points is: <span className="font-bold">{ distance } km</span></p>}
            <Map coords={coords} />
        </div>
    )
}



            {/* <div>
                <h1>Python Script</h1>
                <ReactEmbedGist gist="imarag/152b662271c1f641fef23f65e2499a66"
                 wrapperClass="gist__bash"
                 loadingClass="loading__screen"
                 titleClass="gist__title"
                 file="distance-between-points.py"
                />
            </div> */}