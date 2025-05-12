
export default function Spinner({ visible }) {
    return (
        <p className={`text-center ${visible ? "visible" : "invisible"}`}>
            <span className="loading loading-ring loading-lg"></span>
        </p>
    )
}
