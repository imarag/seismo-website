import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function SocialMedia() {
  return (
    <section className="grid grid-flow-col justify-center items-center gap-4">
        <a target="_blank" className="p-3 border rounded-full bg-gray-950" href="https://www.instagram.com/giannis_mar95/">
          <FaInstagram  className="text-lg text-gray-100" />
        </a>
        <a target="_blank" className="p-3 border rounded-full bg-gray-950" href="https://www.facebook.com/giannis.mar.5/">
          <FaFacebook  className="text-lg text-gray-100" />
        </a>
        <a target="_blank" className="p-3 border rounded-full bg-gray-950" href="https://www.linkedin.com/in/ioannis-maragkakis-1ba2851a9/">
          <FaLinkedin className="text-lg text-gray-100" />
        </a>
    </section>
  )
}
