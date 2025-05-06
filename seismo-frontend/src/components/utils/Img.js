import Image from "next/image";

export default function Img({ src, alt, className, props }) {
  return (
    <Image src={src} alt={alt} className={`${className || ""} max-w-full`} {...props} />
  );
}
