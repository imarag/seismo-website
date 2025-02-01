import Image from "@/components/ui/Image"

import SocialMedia from "@/components/ui/SocialMedia"
import ContactForm from "@/components/ui/ContactForm"
import AlignVertical from "@/components/ui/AlignVertical"
import Section from "@/components/ui/Section"
import { Title, SubTitle } from "@/components/ui/Typography"
import Container from "@/components/ui/Container"

import OldSeismogram from "@/images/seismometer2.jpg"

export default function Contact() {
    return (
        <Section>
            <Container>
                <div className="flex flex-row gap-10">
                    <div className="flex-grow">
                        <AlignVertical align="stretch">
                            <Title text="Contact Us" />
                            <SubTitle text="Connect with us and share your suggestions and improvements" />
                            <SocialMedia bg="base-200" bgHover="base-300" />
                            <ContactForm />
                        </AlignVertical>
                    </div>
                    <div className="w-2/6 flex-shrink-0 flex-grow-0">
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