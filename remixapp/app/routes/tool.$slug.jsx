import { useParams } from "@remix-run/react";
import Image from "@/components/ui/Image"
import { Title, SubTitle, Paragraph } from "@/components/ui/Typography"
import Section from "@/components/ui/Section"
import Collapse from "@/components/ui/Collapse"
import { tools } from "@/utils/topics"


export default function ToolsSlugPage() {
    const { slug } = useParams();
    const selectedTool = tools.find(el => el.slug === slug)
    const ToolComponent = selectedTool.component 
    return (
        <Section>
            <Image src={selectedTool.image_src} alt={selectedTool.image_alt} className="block w-20 mx-auto" />
            <Title text={selectedTool.title} />
            <SubTitle text={selectedTool.subtitle} />
            <div className="max-w-5xl mx-auto">
                <Paragraph text={selectedTool.description} className="mt-20 mb-8"/>
                <Collapse label="User guide">
                    <p>{ selectedTool.userGuide }</p>
                </Collapse>
            </div>
            <ToolComponent />
        </Section>
    )
}