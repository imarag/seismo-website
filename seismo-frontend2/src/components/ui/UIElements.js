export function FormElement({ 
    type = "text", 
    className = "", 
    size="md",
    optionsList = [], 
    name, 
    id, 
    ...props 
  }) {
    const elementClasses = {
      radio: `radio radio-${size}`,
      checkbox: `checkbox checkbox-${size}`,
      text: `input input-${size} input-bordered`,
      email: `input input-${size} input-bordered`,
      number: `input input-${size} input-bordered`,
      search: `input input-${size} input-bordered`,
      date: `input input-${size} input-bordered`,
      time: `input input-${size} input-bordered`,
      range: `range range-${size}`,
      select: `select select-${size} select-bordered`,
      textarea: `textarea textarea-${size} textarea-bordered`
    };
  
    const mainElementClass = `${elementClasses[type]} ${className} rounded-md`;
  
    if (type === "select") {
      return (
        <select className={mainElementClass} name={name} id={id} {...props}>
          {optionsList.map((el) => (
            <option key={el.value} value={el.value}>
              {el.label}
            </option>
          ))}
        </select>
      );
    }
  
    if (type === "textarea") {
      return <textarea className={mainElementClass} name={name} id={id} {...props}></textarea>;
    }
  
    return <input className={mainElementClass} type={type} name={name} id={id} {...props} />;
  }
  
  export function LabelElement({ label, htmlFor, className = "", ...props }) {
    const labelElementClass = `label label-text ${className} px-0 py-1`;
  
    return (
      <label
        className={labelElementClass}  
        htmlFor={htmlFor}  
        {...props} 
      >
        {label} 
      </label>
    );
  }
  
  