export default function Button({
  variant = "primary",
  tooltipText = null,
  className = "",
  children,
  ...props
}) {
  const baseStyles =
    "btn z-30 rounded-md inline-flex items-center gap-2 disabled:bg-transparent";

  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    error: "btn-error",
    info: "btn-info",
    success: "btn-success",
    ghost: "btn-ghost",
  };

  const selectedVariant = variants[variant] || variants.primary;
  const globalClass = `${baseStyles} ${selectedVariant} ${className}`;

  const button = (
    <button className={globalClass} {...props}>
      {children}
    </button>
  );

  return tooltipText ? (
    <div className="tooltip z-30" data-tip={tooltipText}>
      {button}
    </div>
  ) : (
    button
  );
}
