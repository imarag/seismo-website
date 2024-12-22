import Link from 'next/link'
import Image from 'next/image'

export default function Card({ title, description, imgURL, imgAlt, pageURL}) {
  return (
    <div className='pb-20 relative'>
      <Image src={imgURL} alt={imgAlt} className="w-32 block mx-auto mb-4" />
      <div>
        <h1 className="text-center font-semibold text-2xl mb-2">{ title }</h1>
        <p className="font-light text-center">{ description }</p>
        <Link href={pageURL} className="btn btn-primary absolute bottom-0 start-1/2 -translate-x-1/2">
            Go to page
        </Link>
      </div>
    </div>
  )
}
