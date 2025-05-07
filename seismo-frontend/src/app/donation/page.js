import Img from "@/components/utils/Img"
import PageTitle from "@/components/utils/PageTitle"
import PageSubTitle from "@/components/utils/PageSubTitle"
import EyeBrowText from "@/components/utils/EyeBrowText"
import Section from "@/components/utils/Section"
import SeismologicalStationImage from '@/images/seismological-station.jpg'
import DonateButton from "@/components/donate/DonateButton"
import Container from "@/components/utils/Container"

export default function DonationPage() {
    return (
        <Section>
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-8 lg:gap-24">
                    <div className="space-y-4">
                        <EyeBrowText className="text-center lg:text-start" text="seismology for everyone" />
                        <PageTitle className="text-center lg:text-start" text="Support Our Mission" />
                        <PageSubTitle className="text-center lg:text-start" text="Contribute to our cause and help us make a positive impact with your donation. Your support makes all the difference." />
                        <div className="mt-8  text-center lg:text-start">
                            <DonateButton />
                        </div>
                    </div>
                    <div>
                        <Img
                            src={SeismologicalStationImage}
                            className="size-full object-contain"
                            alt="an old seismogram at a seismological station"
                        />
                    </div>
                </div>
            </Container>
        </Section>
    )
}