export default function ErrorMessage({ error }) {
    return (
        <div className="fixed opacity-80 start-0 end-0 top-0 alert alert-error bg-error text-center flex flex-row justify-center">
            { error }
        </div>
    )
}