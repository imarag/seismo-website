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

export function Title({text, styledText = null, className=null}) {
    return (
        <h1 className={`text-4xl md:text-6xl text-center font-normal ${className && className}`}>
            {text}
            <br />
            {styledText && <span className="text-primary">{styledText}</span>}
        </h1>
    );
}

export function SubTitle({ text, className=null }) {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl text-center font-extralight ${className && className}`}>
                {text}
            </h2>
        </div>
    );
}

export function Paragraph({ text, small = false, className }) {
    return (
        <p className={`${small === true ? "text-sm" : "text-lg"} ${className}`}>
            {text}
        </p>
    )
}