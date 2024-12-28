import Link from "next/link"
import Image from "next/image"

export default function ToolsList({ tools }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-14">
            {
                tools.map(tool => (
                    <section key={tool.id} className="bg-base-200 rounded-lg p-12">
                        <Image src={tool.icon} alt={tool.iconAlt} className="w-20 block mx-auto" />
                        <h1 className="text-2xl font-semibold text-center mt-8 mb-2">{tool.title}</h1>
                        <p className="font-light text-center">{tool.description}</p>
                        <p className="mt-8 text-center">
                            <Link href={`/tools/${tool.slug}`} className="btn btn-primary ">Go to page</Link>
                        </p>
                    </section>
                ))
            }
        </div>
    )
}