export default function Input({
  type = "text",
  size = "medium",
  className = "",
  ...attrs
}) {
  const inputSizeMapping = {
    "extra-small": "input-xs",
    small: "input-sm",
    medium: "input-md",
    large: "input-lg",
  };

  const radioSizeMapping = {
    "extra-small": "radio-xs",
    small: "radio-sm",
    medium: "radio-md",
    large: "radio-lg",
  };

  const checkboxSizeMapping = {
    "extra-small": "checkbox-xs",
    small: "checkbox-sm",
    medium: "checkbox-md",
    large: "checkbox-lg",
  };

  const rangeSizeMapping = {
    "extra-small": "range-xs",
    small: "range-sm",
    medium: "range-md",
    large: "range-lg",
  };

  let baseClass;

  if (type === "range") {
    const sizeClass = rangeSizeMapping[size] || rangeSizeMapping["medium"];
    baseClass = `range ${sizeClass}`;
  } else if (type === "radio") {
    const sizeClass = radioSizeMapping[size] || radioSizeMapping["medium"];
    baseClass = `radio ${sizeClass}`;
  } else if (type === "checkbox") {
    const sizeClass =
      checkboxSizeMapping[size] || checkboxSizeMapping["medium"];
    baseClass = `checkbox ${sizeClass}`;
  } else {
    const sizeClass = inputSizeMapping[size] || inputSizeMapping["medium"];
    baseClass = `input input-bordered rounded-md ${sizeClass}`;
  }

  const globalClass = `${baseClass} ${className}`.trim();

  return <input type={type} className={globalClass} {...attrs} />;
}
