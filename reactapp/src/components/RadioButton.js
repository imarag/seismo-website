

export default function RadioButton({ label, id, name, value, checked, onChange, disabled}) {
  return (
    <div className="form-check form-check-inline">
        <label htmlFor={id} className="form-check-label">{ label }</label>
        <input
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="form-check-input"
        />
    </div>
  )
}
