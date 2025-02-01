export default function Button({outline=false, loading=false, variance="primary", block=false, size="medium", children, ...props}) {
  const buttonSize = size === "small" ? "btn-xs" : size === "medium" ? "btn-md" : "btn-lg";
  return (
      <button 
          className={`btn btn-${variance} ${buttonSize} ${outline && "btn-outline"} ${block && "btn-block"}`}
          {...props}
      >
          {loading && <span className="loading loading-spinner"></span>}
          {children}
      </button>
  )
}
