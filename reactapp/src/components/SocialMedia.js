import { FacebookIcon, InstagramIcon, LinkedinIcon } from "../SvgIcons"

export default function SocialMedia({ className="justify-content-center" }) {
  return (
    <section className={"d-flex flex-row align-items-center gap-2 my-4 " + className}>
        <a target="_blank" href="https://www.instagram.com/giannis_mar95/"><InstagramIcon /></a>
        <a target="_blank" href="https://www.facebook.com/giannis.mar.5/"><FacebookIcon /></a>
        <a target="_blank" href="https://www.linkedin.com/in/ioannis-maragkakis-1ba2851a9/"><LinkedinIcon /></a>
    </section>
  )
}
