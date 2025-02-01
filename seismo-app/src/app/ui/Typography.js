export function HeroTitle({text, styledText = null}) {
    return (
        <h1 className="text-4xl md:text-8xl text-center font-semibold">
            {text}
            <br />
            {styledText && <span className="text-primary">{styledText}</span>}
        </h1>
    );
}

export function HeroSubTitle({text}) {
    return (
        <h2 className="text-center py-6 font-normal text-lg md:text-3xl">
            {text}
        </h2>
    );
}

export function Title({text, styledText = null}) {
    return (
        <h1 className="text-3xl md:text-5xl text-center font-normal">
            {text}
            <br />
            {styledText && <span className="text-primary">{styledText}</span>}
        </h1>
    );
}

export function SubTitle({ text }) {
    return (
        <h2 className="text-xl md:text-2xl text-center font-light">
            {text}
        </h2>
    );
}

export function Paragraph({ text, small = false, className }) {
    return (
        <p className={`${small === true ? "text-sm" : "text-lg"} ${className}`}>
            {text}
        </p>
    )
}