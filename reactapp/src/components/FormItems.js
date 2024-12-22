export function RadioButton({ label=null, id="", name="", value=null, checked=false, onChange=null, disabled=false, style={}, small=false }) {
    return (
        <div className="form-check">
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="form-check-input"
                style={style}
            />
            <label htmlFor={id} className="form-check-label">{label}</label>
        </div>
    );
}

export function Slider({ id="", name="", value=null, min=0, max=1, step=1, onChange=null, disabled=false, className=className, style={}, small=false }) {
    return (
        <div className="form-group">
            <input
                type="range"
                id={id}
                name={name}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={onChange}
                disabled={disabled}
                className={"form-control-range " + className}
                style={style}
            />
        </div>
    );
}

export function InputText({ label=null, id="", name="", value=null, onChange=null, disabled=false, placeholder, style={}, small=false }) {
    return (
        <div className="form-group">
            {
                label !== null && (
                    <label className="form-label" htmlFor={id}>{label}</label>
                )
            }
            <input
                type="text"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={"form-control" + " " + (small ? "form-control-sm": "")}
                style={style}
            />
        </div>
    );
}

export function InputNumber({ label=null, id="", name="", value=null, onChange=null, disabled=false, placeholder, style={}, small=false }) {
    return (
        <div className="form-group">
            {
                label !== null && (
                    <label className="form-label" htmlFor={id}>{label}</label>
                )
            }
            <input
                type="number"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={"form-control" + " " + (small ? "form-control-sm": "")}
                style={style}
            />
        </div>
    );
}

export function InputDate({ label=null, id="", name="", value=null, onChange=null, disabled=false, style={}, small=false }) {
    return (
        <div className="form-group">
            {
                label !== null && (
                    <label className="form-label" htmlFor={id}>{label}</label>
                )
            }
            <input
                type="date"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={"form-control" + " " + (small ? "form-control-sm": "")}
                style={style}
            />
        </div>
    );
}

export function InputTime({ label=null, id="", name="", value=null, onChange=null, disabled=false, style={}, small=false }) {
    return (
        <div className="form-group">
            {
                label !== null && (
                    <label className="form-label" htmlFor={id}>{label}</label>
                )
            }
            <input
                type="time"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={"form-control" + " " + (small ? "form-control-sm": "")}
                style={style}
            />
        </div>
    );
}

export function Checkbox({ label=null, id="", name="", checked=null, onChange=null, disabled=false, style={}, small=false }) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="form-check-input"
                style={style}
            />
            <label htmlFor={id} className="form-check-label">{label}</label>
        </div>
    );
}

export function Dropdown({ label=null, id="", name="", value=null, onChange=null, codeOptions=null, disabled=false, style={}, small=false }) {
    return (
        <div className="form-group">
            {
                label !== null && (
                    <label className="form-label" htmlFor={id}>{label}</label>
                )
            }
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={"form-control" + " " + (small ? "form-control-sm": "")}
                style={style}
            >
                {codeOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
