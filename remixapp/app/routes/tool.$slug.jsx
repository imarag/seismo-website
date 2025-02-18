import { useParams } from "@remix-run/react";
import Image from "@/components/utils/Image"
import { Title, SubTitle, Paragraph } from "@/components/utils/Typography"
import Section from "@/components/utils/Section"
import Collapse from "@/components/ui/Collapse"
import { tools } from "@/utils/topics"
import Container from "@/components/utils/Container"
import AlignVertical from "@/components/utils/AlignVertical"


export default function ToolsSlugPage() {
    const { slug } = useParams();
    const selectedTool = tools.find(el => el.slug === slug);

    if (!selectedTool) {
        return (
            <Section>
                <Container>
                    <AlignVertical>
                        <Title text="Tool Not Found" />
                        <Paragraph text="The tool you are looking for does not exist." />
                    </AlignVertical>
                </Container>
            </Section>
        );
    }

    const ToolComponent = selectedTool.component;

    return (
        <Section>
            <Container>
                <AlignVertical>
                    <Image src={selectedTool.image_src} alt={selectedTool.image_alt} className="block w-20 mx-auto" />
                    <Title text={selectedTool.title} />
                    <SubTitle text={selectedTool.subtitle} />
                </AlignVertical>
                <div className="max-w-5xl mx-auto mt-20 mb-8">
                    <AlignVertical>
                        <Paragraph text={selectedTool.description}/>
                        <Collapse label="User guide">
                            <p>{selectedTool.userGuide}</p>
                        </Collapse>
                    </AlignVertical>
                </div>
                <div className="mt-10">
                    <ToolComponent />
                </div>
            </Container>
        </Section>
    );
}
