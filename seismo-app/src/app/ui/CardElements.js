import LinkTag from '@/components/LinkTag'
import Image from 'next/image'

export function CardTitle({ text, center=true }) {
    return (
        <h1 className={`${center ? "text-center" : "text-start"} font-semibold text-xl mb-1`}>{ text }</h1>
    )
}

export function CardImage({ src, alt }) {
    return (
        <Image 
            src={src} 
            alt={alt} 
            className="w-32 block mx-auto" 
        />
    )
}

export function CardParagraph({ text, center=true }) {
    return (
        <p className={`${center ? "text-center" : "text-start"} font-light text-center text-lg`}>{ text }</p>
    )
}

export function CardLink({ text="Go to page", href=null }) {
    return (
        <LinkTag href={href} button={true}>{ text }</LinkTag>
    )
}

export function CardContainer({ children }) {
    return (
        <div className={`flex flex-col items-center p-5 gap-4`}>
            { children }
        </div>
    )
}
