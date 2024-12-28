import { NumberInputElement } from "./UIElements"

export default function CoordItem({ coordLabel, coordValue, coords, setCoords }) {
    return (
        <div className="flex flex-col items-stretch justify-center">
            <label htmlFor={coordValue} className="text-start font-light mb-1">
                { coordLabel }
            </label>
            <NumberInputElement 
                id={coordValue} 
                name={coordValue} 
                value={coords[coordValue]} 
                onChange={(e) => setCoords({...coords, [coordValue]: e.target.value})}
            />
        </div>
    )
}