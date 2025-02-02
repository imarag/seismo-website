import Image from "@/components/ui/Image"

import SocialMedia from "@/components/ui/SocialMedia"
import ContactForm from "@/components/ui/ContactForm"
import AlignVertical from "@/components/ui/AlignVertical"
import Section from "@/components/ui/Section"
import { Title, SubTitle } from "@/components/ui/Typography"
import Container from "@/components/ui/Container"
import SeismogramLargeCropped from "@/images/seismogram-large-cropped.svg";
import OldSeismogram from "@/images/seismometer2.jpg"

export default function Contact() {
    return (
        <Section>
            <Container>
              
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <div>
                        <AlignVertical align="stretch">
                            <Title text="Contact Us" />
                            <SubTitle text="Connect with us and share your suggestions and improvements" />
                            <SocialMedia bg="base-200" bgHover="base-300" />
                            <ContactForm />
                        </AlignVertical>
                    </div>
                    <div className="hidden xl:block">
                        <Image 
                            src={SeismogramLargeCropped} 
                            className="h-full max-w-full object-contain" 
                            alt="an old seismogram at a seismological station" 
                        />
                    </div>
                </div>
            </Container>
        </Section>
    )
}