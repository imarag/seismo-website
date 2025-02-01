import Image from "next/image"

import SocialMedia from "@/components/SocialMedia"
import ContactForm from "@/components/ContactForm"
import AlignVertical from "@/components/AlignVertical"
import Section from "@/components/Section"
import { Title, SubTitle } from "@/components/Typography"
import Container from "@/components/Container"

import OldSeismogram from "@/images/seismometer2.jpg"

export default function Contact() {
    return (
        <Section>
            <Container>
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="basis-0 grow">
                        <AlignVertical align="stretch">
                            <Title text="Contact Us" />
                            <SubTitle text="Connect with us and share your suggestions and improvements" />
                            <SocialMedia bg="base-200" bgHover="base-300" />
                            <ContactForm />
                        </AlignVertical>
                    </div>
                    <div className="basis-0 grow">
                        <Image 
                            src={OldSeismogram} 
                            className="h-full max-w-full object-cover" 
                            alt="an old seismogram at a seismological station" 
                        />
                    </div>
                </div>
            </Container>
        </Section>
    )
}