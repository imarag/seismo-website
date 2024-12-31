import Link from 'next/link'
import Image from 'next/image'

export default function Card({ title, description, imgURL, imgAlt, pageURL, className}) {
  return (
    <div className={`flex flex-col items-center p-5 ${className ? className : ""}`}>
      <figure className="mb-5">
        <Image
          src={imgURL}
          alt={imgAlt} 
          className="w-32"
        />
      </figure>
      <h2 className="text-center font-semibold mb-3">{ title }</h2>
      <p className="font-light text-center text-lg">{ description }</p>
      <Link href={pageURL} className="btn btn-primary btn-outline mt-8">Go to page</Link>
    </div>
  )
}
