import Image from "@/components/ui/Image"

import { Title, SubTitle } from "@/components/ui/Typography"
import Section from "@/components/ui/Section"
import AlignVertical from "@/components/ui/AlignVertical"

import SeismologicalStationImage from '@/images/seismological-station.jpg'

function DonateButton() {
    return (
        <form action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="hosted_button_id" value="99CHCLP5E9XE4" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
            <img alt="" border="0" src="https://www.paypal.com/en_GR/i/scr/pixel.gif" width="1" height="1" />
        </form>
    )
}

export default function Donation() {
    return (
        <Section>
            <AlignVertical>
                <Title text="Donation" />
                <SubTitle text="Contribute to our cause and help us make a positive impact with your donation" />
                <DonateButton />
                <Image src={SeismologicalStationImage} className="w-full" alt="an old seismological station" />
            </AlignVertical>
        </Section>
    )
}
