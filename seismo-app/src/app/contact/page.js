import OldSeismogram from "@/images/seismometer2.jpg"
import Image from "next/image"
import SocialMedia from "@/components/SocialMedia"
import ContactForm from "@/components/ContactForm"
import Title from "@/components/Title"
import SubTitle from "@/components/SubTitle"

export default function Contact() {
    return (
        <section className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="basis-0 grow bg-base-200">
                    <div className="p-5">
                        <Title text1="Contact Us" />
                        <SubTitle text="Connect with us and share your suggestions and improvements" />
                        <SocialMedia />
                        <ContactForm />
                    </div>
                </div>
                <div className="basis-0 grow bg-slate-800">
                <Image 
                    src={OldSeismogram} 
                    className="h-full max-w-full object-cover" 
                    alt="an old seismogram at a seismological station" 
                />
                </div>
            </div>
        </section>
    )
}