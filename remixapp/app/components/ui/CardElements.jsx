import Image from "@/components/utils/Image";
import LinkTag from "@/components/ui/LinkTag";

export function CardTitle({ text, center = true, className = "" }) {
    return (
        <h1 className={`${center ? "text-center" : "text-start"} font-semibold text-xl mb-1 ${className}`}>
            { text }
        </h1>
    );
}

export function CardImage({ src, alt, className = "" }) {
    return (
        <Image 
            src={src} 
            alt={alt} 
            className={`w-32 block mx-auto ${className}`} 
        />
    );
}

export function CardParagraph({ text, center = true, className = "" }) {
    return (
        <p className={`${center ? "text-center" : "text-start"} font-light text-lg ${className}`}>
            { text }
        </p>
    );
}

export function CardLink({ text = "Go to page", href, className = "" }) {
    return (
        <LinkTag href={href} variant="button" className={className}>
            { text }
        </LinkTag>
    );
}

export function CardContainer({ children, className = "" }) {
    return (
        <div className={`flex flex-col items-center p-8 gap-4 rounded-lg  ${className}`}>
            { children }
        </div>
    );
}
