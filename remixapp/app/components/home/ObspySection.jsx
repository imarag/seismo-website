import Image from "@/components/utils/Image"
import { ButtonLinkTag } from "@/components/ui/LinkComponents";
import { Title, SubTitle } from "@/components/utils/Typography"
import ObsPyIcon from "@/images/template-images/resized/obspy-icon.png"
import ObsPyScriptExample from "@/images/obspy-script-example.gif";

export default function ObspySection() {
    return (    
        <>
            <Image src={ObsPyIcon} className="w-20 block mx-auto"  alt="ObsPy Logo" />
            <Title text="Learn about the" styledText="Python ObsPy" />
            <SubTitle
                text="Process seismic data using the various ObsPy functions, manipulate date and time, and plot earthquake recordings."
            />
            <ButtonLinkTag href="/articles-search/obspy">
                Learn More
            </ButtonLinkTag>
            <div className="max-w-4xl mx-auto">
                <Image src={ObsPyScriptExample} alt="python script example" className="block mx-auto max-w-3xl" />
            </div>
        </>
    )
}