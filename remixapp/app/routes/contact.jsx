import Image from "@/components/utils/Image"
import SocialMedia from "@/components/utils/SocialMedia"
import AlignVertical from "@/components/utils/AlignVertical"
import Section from "@/components/utils/Section"
import { Title, SubTitle } from "@/components/utils/Typography"
import Container from "@/components/utils/Container"
import SeismogramLargeCropped from "@/images/seismogram-large-cropped.svg";
import ContactForm from "@/components/contact/ContactForm"

export default function ContactPage() {
    return (
        <Section>
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <AlignVertical align="stretch">
                            <Title text="Contact Us" />
                            <SubTitle text="Connect with us and share your suggestions and improvements" />
                            <SocialMedia bg="base-200" bgHover="base-300" />
                            <ContactForm />
                        </AlignVertical>
                    </div>
                    <div className="hidden lg:block">
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