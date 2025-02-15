
export default function HeroTitle({text, styledText = null}) {
    return (
        <h1 className="text-4xl md:text-8xl text-center font-semibold">
            {text}
            <br />
            {styledText && <span className="text-primary">{styledText}</span>}
        </h1>
    );
}