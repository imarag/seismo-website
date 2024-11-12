
export default function Spinner({ hidden, center=true}) {
  return (
    <div className={`d-flex ${center ? "justify-content-center" : "justify-content-start"}`}>
        <div className="spinner-border mx-auto" role="status" hidden={hidden}>
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}
