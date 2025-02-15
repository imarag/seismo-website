import ToolsGallery from "@/components/home/ToolsGallery";
import { ButtonLinkTag } from "@/components/ui/LinkComponents";
import { Title, SubTitle } from "@/components/utils/Typography"

export default function ToolsSection() {
    return (
        <>
            <Title text="Utilize the" styledText="interactive tools" />
            <SubTitle
                text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
            />
            <ButtonLinkTag href="/tools-search">
                Learn More
            </ButtonLinkTag>
            <div className="max-w-4xl mx-auto">
                <ToolsGallery />
            </div>
        </>
    )
}