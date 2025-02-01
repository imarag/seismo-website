import Image from "@/components/ui/Image"
import LogoImage from "@/images/logo.png"

export default function Logo() {
    return (
        <Image 
            src={LogoImage} 
            alt="logo of the website" 
            className="w-24"
        />
    )
}