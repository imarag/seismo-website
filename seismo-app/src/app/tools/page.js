
import Title from "@/components/Title";
import SubTitle from "@/components/SubTitle";
import { allTools } from "@/utils/all-topics";
import ToolsList from "@/components/ToolsList";

export default function Articles() {
   
    return (
        <section className="container mx-auto">
            <Title text1="Seismic Tools" />
            <SubTitle text="Discover the interactive tools built to facilitate seismological processing" />
            <ToolsList tools={allTools}/>
        </section>
    );
}
