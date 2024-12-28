
export default function ButtonWithIcon({ text, onClick, disabled, icon, align="center" }) {
  return (
    <button 
      onClick={onClick} 
      className={"btn btn-primary flex flex-row justify-center align-center gap-2 my-3 " + (align === "center" ? "mx-auto" : "")}  
      disabled={disabled}
    >
        <span>{ icon }</span>
        <span>{ text }</span>
    </button>
  )
}
