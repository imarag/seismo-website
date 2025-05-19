export default function TextArea({
  className = "",
  size = "medium",
  ...attrs
}) {
  const baseClass = "textarea textarea-bordered rounded-md";
  const sizeMapping = {
    "extra-small": "textarea-xs",
    small: "textarea-sm",
    medium: "textarea-md",
    large: "textarea-lg",
  };
  const globalClass = `${baseClass} ${
    sizeMapping[size] || sizeMapping["medium"]
  } ${className}`;
  return <textarea className={globalClass} {...attrs}></textarea>;
}
