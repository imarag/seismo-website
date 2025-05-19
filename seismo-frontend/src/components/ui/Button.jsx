export default function Button({
  style = "primary",
  size = "medium",
  tooltiptext = null,
  outline = false,
  className = "",
  loading = false,
  children,
  ...attrs
}) {
  const baseClass =
    "btn z-30 rounded-md inline-flex items-center gap-2 disabled:btn-disabled";
  const sizeMapping = {
    "extra-small": "btn-xs",
    small: "btn-sm",
    medium: "btn-md",
    large: "btn-lg",
    "extra-large": "btn-xl",
  };
  const styleMapping = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    neutral: "btn-neutral",
    info: "btn-info",
    success: "btn-success",
    warning: "btn-warning",
    error: "btn-error",
    ghost: "btn-ghost",
  };

  const sizeClass = sizeMapping[size] || sizeMapping["medium"];
  const styleClass = styleMapping[style] || styleMapping["primary"];
  const outlineClass = outline ? "btn-outline" : "";
  const globalClass = `${baseClass} ${sizeClass} ${styleClass} ${outlineClass} ${className}`;

  const button = (
    <button
      className={globalClass}
      disabled={attrs.disabled || loading}
      {...attrs}
    >
      {loading && <span className="loading loading-spinner"></span>}
      {children}
    </button>
  );

  return tooltiptext ? (
    <div className="tooltip z-30" data-tip={tooltiptext}>
      {button}
    </div>
  ) : (
    button
  );
}
