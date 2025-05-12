import Img from "@/components/utils/Img";
import LinkTag from "@/components/ui/LinkTag";

export function CardTitle({ text, center = true, className = null }) {
  return (
    <h2
      className={`text-primary font-semibold text-lg ${className || ""}`}
    >
      {text}
    </h2>
  );
}

export function CardImage({ src, alt, className = null }) {
  return (
    <Img src={src} alt={alt} className={`w-32 block mx-auto ${className || ""}`} />
  );
}

export function CardParagraph({ text, center = true, className = null }) {
  return (
    <p
      className={`font-light ${className || ""}`}
    >
      {text}
    </p>
  );
}

export function CardLink({ text = "Go to page", href, className = null }) {
  return (
    <div className="text-center">
      <LinkTag href={href} variant="button" className={className}>
        {text}
      </LinkTag>
    </div>
  );
}

export function CardContainer({ children, className = "" }) {
  return (
    <div
      className={`space-y-4 p-8 rounded-lg bg-base-200 ${className}`}
    >
      {children}
    </div>
  );
}
