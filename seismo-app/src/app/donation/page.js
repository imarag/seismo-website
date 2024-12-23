import Title from "@/components/Title"
import SubTitle from "@/components/SubTitle"
import Image from 'next/image'
import SeismologicalStationImage from './seismological-station.jpg'

export default function Donation() {
  return (
    <div className="container mx-auto">
        <Title text1="Donation" />
        <SubTitle text="Contribute to our cause and help us make a positive impact with your donation" />
        <div className="row justify-content-center my-5">
          <div className="col-lg-8 text-center">
            <form action="https://www.paypal.com/donate" method="post" target="_top">
              <input type="hidden" name="hosted_button_id" value="Y9D3VPWEBUNYC" />
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
              <img alt="" border="0" src="https://www.paypal.com/en_GR/i/scr/pixel.gif" width="1" height="1" />
            </form>
          </div>
        </div>
        <div className="row justify-content-center my-5">
          <div className="col-lg-8 text-center">
            <Image className="img-fluid block mx-auto mt-10" src={SeismologicalStationImage} alt="a seismological station"/>
          </div>
        </div>
    </div>
  )
}
