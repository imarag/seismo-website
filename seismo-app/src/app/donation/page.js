import Image from "next/image"
import Title from "@/components/Title"
import SubTitle from "@/components/SubTitle"
import SeismologicalStationImage from '@/images/seismological-station.jpg'

export default function Donation() {
    return (
        <section>
            <Title text1="Donation" />
            <SubTitle text="Contribute to our cause and help us make a positive impact with your donation" />
            <div className="flex flex-row justify-center mb-14">
                <form action="https://www.paypal.com/donate" method="post" target="_top">
                    <input type="hidden" name="hosted_button_id" value="Y9D3VPWEBUNYC" />
                    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                    <img alt="" border="0" src="https://www.paypal.com/en_GR/i/scr/pixel.gif" width="1" height="1" />
                </form>
            </div>
            <div className="relative border">
                <Image src={SeismologicalStationImage} className="w-full" alt="an old seismological station" />
            </div>
        </section>
    )
}
