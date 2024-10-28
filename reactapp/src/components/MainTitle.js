
export default function MainTitle({ title, subtitle }) {
    return (
        <>
            <h1 className="text-6xl font-semibold text-center my-8 mb-5">
                { title }
            </h1>
            <p className="text-center font-normal text-2xl"> { subtitle }</p>
        </>
    )
}