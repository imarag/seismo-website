import Image from "next/image"
import LogoImage from "@/images/logo.png"

export default function Logo() {
    return (
        <Image 
            src={LogoImage} 
            alt="logo of the website" 
            width={100} 
            height={100}
            className="block mx-auto"
        />
    )
}