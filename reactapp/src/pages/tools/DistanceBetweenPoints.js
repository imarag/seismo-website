import ReactEmbedGist from 'react-embed-gist';
import { useState } from 'react';

function CoordContainer({ children, label }) {
    return (
        <div>
            <h1 className="text-start flex flex-row items-center gap-x-2 mb-2 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                <span>{ label }</span>
            </h1>
            <hr className="border-1 border-gray-200"/>
            <div className="flex flex-row gap-x-4 mt-4">
                { children }
            </div>
        </div>
    )
}

function CoordItem({ coordLabel, coordValue, coords, setCoords }) {
    return (
        <div className="flex flex-col items-stretch">
            <label htmlFor={ coordValue } className="text-start text-gray-500 font-light">
                { coordLabel }
            </label>
            <input 
                className="rounded-md border-0 py-1.5 pl-7 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                id={ coordValue } 
                name={ coordValue } 
                type="number"
                value={coords[coordValue]} 
                onChange={(e) => setCoords({...coords, [coordValue]: e.target.value})}
            />
        </div>
    )
}

function CoordButton({ label, className, children}) {
    return (
        <button className={"flex flex-row items-center rounded-md font-normal px-3 py-1 " + className}>
            { children }
            { label }
        </button>
    )
}

export default function DistanceBetweenPoints() {

    const [coords, setCoords] = useState({lat1: "", lon1: "", lat2: "", lon2: ""});
    const [distance, setDistance] = useState(null);

    return (
        <div>
            <h2 className="text-2xl text-center my-12">Calculate the distance between them on the
            WGS84 ellipsoid in kilometers</h2>

            <div className="flex flex-row justify-center gap-x-8">
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
                <CoordButton label="Compute" className="bg-emerald-500" title="calculate the distance between the points">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-calculator-fill" viewBox="0 0 16 16">
                        <path
                            d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-1z" />
                    </svg>
                </CoordButton>
                <CoordButton label="Clear" className="bg-rose-500" title="empty the coordinate entries">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eraser-fill"
                        viewBox="0 0 16 16">
                        <path
                            d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
                    </svg>
                </CoordButton>
                <CoordButton label="Locate" className="bg-indigo-400" title="show the defined points on the map">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-crosshair2"
                        viewBox="0 0 16 16">
                        <path
                            d="M8 0a.5.5 0 0 1 .5.5v.518A7.001 7.001 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7.001 7.001 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7.001 7.001 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7.001 7.001 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0Zm-.5 2.02A6.001 6.001 0 0 0 2.02 7.5h1.005A5.002 5.002 0 0 1 7.5 3.025V2.02Zm1 1.005A5.002 5.002 0 0 1 12.975 7.5h1.005A6.001 6.001 0 0 0 8.5 2.02v1.005ZM12.975 8.5A5.002 5.002 0 0 1 8.5 12.975v1.005a6.002 6.002 0 0 0 5.48-5.48h-1.005ZM7.5 12.975A5.002 5.002 0 0 1 3.025 8.5H2.02a6.001 6.001 0 0 0 5.48 5.48v-1.005ZM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
                    </svg>
                </CoordButton>
            </div>
            {distance && <p className="text-center">The distance between the points in km is: { distance }</p>}
            <div>
                <h1>Python Script</h1>
                <ReactEmbedGist gist="imarag/152b662271c1f641fef23f65e2499a66"
                 wrapperClass="gist__bash"
                 loadingClass="loading__screen"
                 titleClass="gist__title"
                 file="distance-between-points.py"
                />
            </div>
        </div>
    )
}
