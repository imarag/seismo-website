import Image from "next/image"
export default function Logo() {
    return (
        <Image src="/img/logo.png" alt="logo of the website" width={100} height={100}/>
    )
}