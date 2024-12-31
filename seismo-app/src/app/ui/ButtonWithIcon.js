
export default function ButtonWithIcon(props) {
  return (
    <button 
      disabled={props.disabled ? true : false}
      onClick={props.onClick}
      className={`btn flex flex-row justify-center align-center gap-2 ${props.className ? props.className : ""}`}  
    >
        <span>{ props.icon }</span>
        <span>{ props.text }</span>
    </button>
  )
}
