export function RadioButtonElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="radio" 
            className={`radio border-gray-700 ${className ? className : ""}`}
        />
    );
}

export function SelectElement({ className, optionsList, ...props }) {
    return (
        <select {...props} className={`select select-bordered  ${className ? className: ""}`}>
            {
                optionsList.map(el => (
                    <option key={el.label} value={el.value}>{el.label}</option>
                ))
            }
        </select>
    );
}

export function NumberInputElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="number" 
            className={`input input-bordered  ${className ? className: ""}`}
            readOnly={props.readOnly ? true : false}
        />
    );
}

export function DateInputElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="date" 
            className={`input input-bordered  ${className ? className: ""}`}
        />
    );
}

export function TimeInputElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="time" 
            className={`input input-bordered  ${className ? className: ""}`}
        />
    );
}

export function TextInputElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="text" 
            className={`input input-bordered  ${className ? className: ""}`}
            readOnly={props.readOnly ? true : false}
        />
    );
}

export function EmailInputElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="email" 
            className={`input input-bordered  ${className ? className: ""}`}
            readOnly={props.readOnly ? true : false}
        />
    );
}

export function TextAreaElement({ className, ...props }) {
    return (
        <textarea 
            {...props}
            type="email" 
            className={`textarea textarea-bordered  ${className ? className: ""}`}
            readOnly={props.readOnly ? true : false}
        ></textarea>
    );
}

export function SearchInputElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="search" 
            className={`input input-bordered  ${className ? className: ""}`}
        />
    );
}

export function SliderElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="range" 
            className={`range  ${className ? className: ""}`}
        />
    );
}

export function CheckboxElement({ className, ...props }) {
    return (
        <input 
            {...props}
            type="checkbox" 
            className={`checkbox  ${className ? className: ""}`}
        />
    );
}

export function LabelElement({ className, ...props }) {
    return (
        <label 
            className={`label label-text block py-1 ${className ? className : ""}`} 
            htmlFor={props.id}
        >
            {props.label}
        </label>
    )
}