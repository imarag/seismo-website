
export default function Spinner({ center=true}) {
  return (
    <div className={`my-3 d-flex ${center ? "justify-content-center" : "justify-content-start"}`}>
        <div className="spinner-border mx-auto" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}
