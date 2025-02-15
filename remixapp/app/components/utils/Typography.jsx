
export function Title({text, styledText = null, className=null}) {
    return (
        <h1 className={`text-4xl md:text-6xl text-center font-normal ${className || ""}`}>
            {text}
            <br />
            {styledText && <span className="text-primary">{styledText}</span>}
        </h1>
    );
}

export function SubTitle({ text, className=null }) {
    return (
        <h2 className={`text-2xl text-center font-extralight ${className || ""}`}>
            {text}
        </h2>
    );
}

export function Paragraph({ text, small = false, className }) {
    return (
        <p className={`${small === true ? "text-sm" : "text-lg"} ${className || ""}`}>
            {text}
        </p>
    )
}