
export default function ButtonWithIcon({ text, onClick, disabled, children }) {
  return (
    <button onClick={onClick} className="btn btn-light flex align-items-center gap-2" disabled={disabled}>
        { children }
        <span>{ text }</span>
    </button>
  )
}
