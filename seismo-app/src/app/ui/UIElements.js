export function RadioButtonElement({ label, id, name, value, checked, onChange, disabled }) {
    return (
        <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text text-xl mx-2">{ label }</span>
                <input 
                    type="radio" 
                    name={name} 
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="radio" 
                    checked={checked} 
                    disabled={disabled}
                />
            </label>
    </div>
    )
}

export function SelectElement({ id, name, value, onChange, disabled, optionsList}) {
    return (
        <select 
            className="select select-bordered  w-full max-w-xs"
            aria-label="dropdown"
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
        >
            {
                optionsList.map(el => (
                    <option key={el.name} value={el.value}>{el.name}</option>
                ))
            }
        </select>
    )
}

export function NumberInputElement({id, name, value, onChange, placeholder, disabled}) {
    return (
        <input 
            type="number" 
            className="input input-bordered w-full max-w-xs" 
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}

export function SearchInputElement({id, name, value, onChange, placeholder, disabled}) {
    return (
        <input 
            type="search" 
            className="input input-bordered input-md w-24 md:w-auto" 
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}