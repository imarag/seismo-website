import Image from "next/image"
import LogoImage from "@/images/logo.png"

export default function Logo() {
    return (
        <Image 
            src={LogoImage} 
            alt="logo of the website" 
            className="block mx-auto w-24"
        />
    )
}