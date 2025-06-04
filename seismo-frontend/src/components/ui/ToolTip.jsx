export default function ToolTip({
  toolTipText = "",
  toolTipPosition = "top-center",
  className = "",
  children,
}) {
  const toolTipPositionMapping = {
    "top-center": "bottom-full left-1/2 -translate-x-1/2 mb-2",
    "top-right": "bottom-full left-0 mb-2",
    "top-left": "bottom-full right-0 mb-2",
    "bottom-center": "top-full left-1/2 -translate-x-1/2 mt-2",
    "bottom-right": "top-full left-0 mt-2",
    "bottom-left": "top-full right-0 mt-2",
    "left-center": "top-1/2 right-full -translate-y-1/2 mr-2",
    "right-center": "top-1/2 left-full -translate-y-1/2 ml-2",
  };

  const positionClass =
    toolTipPositionMapping[toolTipPosition] ||
    toolTipPositionMapping["top-center"];

  const tooltipClass = `
    absolute z-50 w-max max-w-60 rounded-md bg-base-300 p-2 text-sm text-white/60 text-center
    hidden transition-all duration-300 border-1 border-white/5
    ${positionClass}
    group-hover:inline-block
  `;

  return (
    <div className={`group relative inline-block ${className}`}>
      <div className={tooltipClass}>{toolTipText}</div>
      <div>{children}</div>
    </div>
  );
}
