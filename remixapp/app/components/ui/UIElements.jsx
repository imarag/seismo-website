export function RadioButtonElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="radio" 
            className={`radio ${block && "block w-full"}  ${className ? className : ""}`}
        />
    );
}

export function SelectElement({ className, block=false, optionsList, ...props }) {
    return (
        <select {...props} className={`select select-bordered  ${block && "block w-full"}  ${className ? className: ""}`}>
            {
                optionsList.map(el => (
                    <option key={el.label} value={el.value}>{el.label}</option>
                ))
            }
        </select>
    );
}

export function NumberInputElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="number" 
            className={`input input-bordered  ${block && "block w-full"}  ${className ? className: ""}`}
            readOnly={props.readOnly ? true : false}
        />
    );
}

export function DateInputElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="date" 
            className={`input input-bordered  ${block && "block w-full"}  ${className ? className: ""}`}
        />
    );
}

export function TimeInputElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="time" 
            className={`input input-bordered  ${block && "block w-full"}  ${className ? className: ""}`}
        />
    );
}

export function TextInputElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="text" 
            className={`input input-bordered text-sm  ${block && "block w-full"}  ${className ? className: ""}`}
            readOnly={props.readOnly ? true : false}
        />
    );
}

export function EmailInputElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="email" 
            className={`input input-bordered text-sm  ${block && "block w-full"}  ${className ? className: ""}`}
            readOnly={props.readOnly ? true : false}
        />
    );
}

export function TextAreaElement({ className, block=false, ...props }) {
    return (
        <textarea 
            {...props}
            className={`textarea textarea-bordered text-sm  ${block && "block w-full"}  ${className ? className: ""}`}
            readOnly={props.readOnly ? true : false}
        ></textarea>
    );
}

export function SearchInputElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="search" 
            className={`input input-bordered text-sm  ${block && "block w-full"}  ${className ? className: ""}`}
        />
    );
}

export function SliderElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="range" 
            className={`range  ${block && "block w-full"}  ${className ? className: ""}`}
        />
    );
}

export function CheckboxElement({ className, block=false, ...props }) {
    return (
        <input 
            {...props}
            type="checkbox" 
            className={`checkbox ${block && "block w-full"}  ${className ? className: ""}`}
        />
    );
}

export function LabelElement({ className, block=false, ...props }) {
    return (
        <label 
            className={`label label-text ${className ? className : ""}`} 
            htmlFor={props.id}
        >
            {props.label}
        </label>
    )
}