import SocialMedia from "@/components/utils/SocialMedia"
import Section from "@/components/utils/Section"
import PageTitle from "@/components/utils/PageTitle"
import PageSubTitle from "@/components/utils/PageSubTitle"
import EyeBrowText from "@/components/utils/EyeBrowText"
import Container from "@/components/utils/Container"
import ContactForm from "@/components/contact/ContactForm"
import Img from "@/components/utils/Img"

export default function ContactPage() {
    return (
        <Section>
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-8 lg:gap-24">
                    <div className="space-y-4">
                        <EyeBrowText className="text-center lg:text-start" text="GET IN TOUCH" />
                        <PageTitle className="text-center lg:text-start" text="We’d Love to Hear From You" />
                        <PageSubTitle className="text-center lg:text-start" text="Connect with us and share your suggestions and improvements. Your feedback matters." />
                        <SocialMedia />
                        <ContactForm />
                    </div>
                    <div>
                        <Img
                            src="/images/pages/seismogram-large-cropped-removebg.png"
                            className="h-full max-w-full object-contain hidden lg:grid"
                            alt="an old seismogram at a seismological station"
                        />
                    </div>
                </div>
            </Container>
        </Section>
    )
}