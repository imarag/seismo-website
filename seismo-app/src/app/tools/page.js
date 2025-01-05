import Link from "next/link"
import Image from "next/image"

import Title from "@/components/Title";
import SubTitle from "@/components/SubTitle";
import Section from "@/components/Section";

import { allTools } from "@/utils/all-topics";

export default function Tools() {
    return (
        <Section>
            <Title text="Seismic Tools" />
            <SubTitle text="Discover the interactive tools built to facilitate seismological processing" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-14">
                {
                    allTools.map(tool => (
                        <section key={tool.id} className="bg-base-200 hover:bg-base-300 rounded-lg p-12">
                            <Image src={tool.icon} alt={tool.iconAlt} className="w-32 block mx-auto" />
                            <h1 className="text-2xl font-semibold text-center mt-8 mb-2">{tool.title}</h1>
                            <p className="font-light text-center text-lg">{tool.smallDescription}</p>
                            <p className="mt-8 text-center">
                                {
                                    tool.completed ? (
                                        <Link href={`/tools/${tool.slug}`} className="btn btn-primary ">Go to page</Link>
                                    ) : (
                                        <span className="font-bold">Work in Progress</span>
                                    )
                                }
                            </p>
                        </section>
                    ))
                }
            </div>
        </Section>
    );
}
