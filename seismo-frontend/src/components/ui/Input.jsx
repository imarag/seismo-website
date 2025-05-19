export default function Input({
  type = "text",
  size = "medium",
  className = "",
  ...attrs
}) {
  const sizeMapping = {
    "extra-small": "xs",
    small: "sm",
    medium: "md",
    large: "lg",
  };

  const sizeClass = sizeMapping[size] || sizeMapping["medium"];
  let baseClass;

  if (type === "range") {
    baseClass = `range range-${sizeClass}`;
  } else if (type === "radio") {
    baseClass = `radio radio-${sizeClass}`;
  } else if (type === "checkbox") {
    baseClass = `checkbox checkbox-${sizeClass}`;
  } else {
    baseClass = `input input-bordered rounded-md input-${sizeClass}`;
  }

  const globalClass = `${baseClass} ${className}`;

  return <input type={type} className={globalClass} {...attrs} />;
}
