
export default function ButtonWithIcon({ text, onClick, disabled, icon, align="center" }) {
  return (
    <button 
      onClick={onClick} 
      className={"btn btn-light d-flex flex-row justify-content-center align-items-center gap-2 my-3 " + (align === "center" ? "mx-auto" : "")}  
      disabled={disabled}
    >
        <span>{ icon }</span>
        <span>{ text }</span>
    </button>
  )
}
