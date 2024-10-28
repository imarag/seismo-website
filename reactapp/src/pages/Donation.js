import MainTitle from "../components/MainTitle"
import SeismologicalStationImage from "../img/seismological-station.jpg"

export default function Donation() {
  return (
    <div>
        <MainTitle title="Donation" subtitle="Contribute to our cause and help us make a positive impact with your donation"/>
        <div className="flex flex-row items-center justify-center my-12">
            <form action="https://www.paypal.com/donate" method="post" target="_top">
                <input type="hidden" name="hosted_button_id" value="KQY62PZ3955Q4" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0"
                    name="submit" title="PayPal - The safer, easier way to pay online!"
                    alt="Donate with PayPal button" />
                <img alt="" border="0" src="https://www.paypal.com/en_GR/i/scr/pixel.gif" width="1" height="1" />
            </form>
        </div>
        <img className="block mx-auto" src={SeismologicalStationImage} />
    </div>
  )
}
