import Link from "next/link"
import Image from "next/image"

export default function Tool({tool}) {
    return(
        <section key={tool.id} className="bg-base-200 hover:bg-base-300 rounded-lg p-12">
            <Image src={tool.icon} alt={tool.iconAlt} className="w-20 block mx-auto" />
            <h1 className="text-2xl font-semibold text-center mt-8 mb-2">{tool.title}</h1>
            <p className="font-light text-center text-lg">{tool.description}</p>
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
    )
}