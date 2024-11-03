export default function CoordItem({ coordLabel, coordValue, coords, setCoords }) {
    return (
        <div className="flex flex-col items-stretch">
            <label htmlFor={ coordValue } className="text-start text-gray-500 font-light mb-1">
                { coordLabel }
            </label>
            <input 
                className="rounded-md border-0 py-1.5 pl-7 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg" 
                id={ coordValue } 
                name={ coordValue } 
                type="number"
                value={coords[coordValue]} 
                onChange={(e) => setCoords({...coords, [coordValue]: e.target.value})}
            />
        </div>
    )
}