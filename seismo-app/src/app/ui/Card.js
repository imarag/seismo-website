import Link from 'next/link'
import Image from 'next/image'

export default function Card({ title, description, imgURL, imgAlt, pageURL}) {
  return (
    <div className="card bg-base-200 w-96 mx-auto p-5">
      <figure>
        <Image
          src={imgURL}
          alt={imgAlt} 
          width={150}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{ title }</h2>
        <p className="font-light">{ description }</p>
        <div className="card-actions justify-start">
          <Link href={pageURL} className="btn btn-primary">Go to page</Link>
        </div>
      </div>
    </div>
  )
}
