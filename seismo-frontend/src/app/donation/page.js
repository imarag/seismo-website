import Img from "@/components/utils/Img"
import { Title, SubTitle } from "@/components/utils/Typography"
import Section from "@/components/utils/Section"
import AlignVertical from "@/components/utils/AlignVertical"
import SeismologicalStationImage from '@/images/seismological-station.jpg'
import DonateButton from "@/components/donate/DonateButton"

export default function DonationPage() {
    return (
        <Section>
            <AlignVertical>
                <Title text="Donation" />
                <SubTitle text="Contribute to our cause and help us make a positive impact with your donation" />
                <DonateButton />
                <Img src={SeismologicalStationImage} className="w-full" alt="an old seismological station" />
            </AlignVertical>
        </Section>
    )
}