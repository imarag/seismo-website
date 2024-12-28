import OldSeismogram from "@/images/seismometer2.jpg"
import Image from "next/image"
import SocialMedia from "@/components/SocialMedia"
import ContactForm from "@/components/ContactForm"
import Title from "@/components/Title"
import SubTitle from "@/components/SubTitle"

export default function Contact() {
    return (
        <section className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 align-center justify-center">
                <div className="p-5">
                    <Title text1="Contact Us" />
                    <SubTitle text="Connect with us and share your suggestions and improvements" />
                    <SocialMedia />
                    <ContactForm />
                </div>
                <div className="p-5 flex flex-row align-center">
                    <Image src={OldSeismogram} className="object-cover max-h-full" alt="an old seismogram at a seismological station" />
                </div>
            </div>
        </section>
    )
}