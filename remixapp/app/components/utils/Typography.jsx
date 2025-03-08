
export function Title({text, styledText = null, className=null}) {
    return (
        <h1 className={`text-4xl md:text-6xl text-center font-normal ${className || ""}`}>
            { text }
            <br />
            {styledText && <span className="text-primary">{styledText}</span>}
        </h1>
    );
}

export function SubTitle({ text, className=null }) {
    return (
        <h2 className={`text-2xl text-center font-extralight max-w-5xl mx-auto ${className || ""}`}>
            { text }
        </h2>
    );
}

export function Paragraph({ children, small = false, className }) {
    return (
        <p className={`my-0 py-0 font-light ${small === true ? "text-sm" : "text-lg"} ${className || ""}`}>
            { children }
        </p>
    )
}