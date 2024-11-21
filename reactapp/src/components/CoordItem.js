export default function CoordItem({ coordLabel, coordValue, coords, setCoords }) {
    return (
        <div className="d-flex flex-column items-stretch">
            <label htmlFor={coordValue} className="text-start text-secondary fw-light mb-1">
                { coordLabel }
            </label>
            <input 
                className="form-control"
                id={coordValue} 
                name={coordValue} 
                type="number"
                value={coords[coordValue]} 
                onChange={(e) => setCoords({...coords, [coordValue]: e.target.value})}
            />
        </div>
    )
}