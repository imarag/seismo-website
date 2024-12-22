import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function SocialMedia({ className="justify-content-center" }) {
  return (
    <section className="d-flex flex-row justify-content-center align-items-center gap-2 my-4">
        <a target="_blank" href="https://www.instagram.com/giannis_mar95/">
          <FaInstagram  className="text-primary" />
        </a>
        <a target="_blank" href="https://www.facebook.com/giannis.mar.5/">
          <FaFacebook  className="text-primary" />
        </a>
        <a target="_blank" href="https://www.linkedin.com/in/ioannis-maragkakis-1ba2851a9/">
          <FaLinkedin className="text-primary" />
        </a>
    </section>
  )
}
