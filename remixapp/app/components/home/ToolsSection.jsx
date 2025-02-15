import ToolsGallery from "@/components/home/ToolsGallery";
import LinkTag from "@/components/ui/LinkTag";
import { Title, SubTitle } from "@/components/utils/Typography"

export default function ToolsSection() {
    return (
        <>
            <Title text="Utilize the" styledText="interactive tools" />
            <SubTitle
                text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
            />
            <LinkTag href="/tools-search" variant="button">
                Learn More
            </LinkTag>
            <div className="max-w-4xl mx-auto">
                <ToolsGallery />
            </div>
        </>
    )
}