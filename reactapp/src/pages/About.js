import SocialMedia from "../components/SocialMedia"
import PhotoOfMe from "../img/myface.jpg"

export default function About() {
  return (
    <div className="container mx-auto">
      <section className="flex flex-col lg:flex-row items-center justify-center gap-10 mt-20">
        <div className="lg:w-6/12 flex-grow">
          <h1 className="text-5xl font-semibold text-start mb-4">Ioannis Maragkakis</h1>
          <h2 className="text-xl text-start mb-6 italic">Python Developer / Seismologist</h2>
          <SocialMedia className="justify-start"/>
          <p className="font-light">
            My name is Ioannis Maragkakis and i am from the beautiful city of Chania in Crete, Greece.
            I have many interests but the one that really helps me to escape, have fun and let off steam,
            is playing my favorite sport, beach volleyball.
            I would consider myself as an athletic type but if you ask me to go out for some drinks, i am down for
            it.
            I am trying to enjoy life, live in the present and be productive. During my free time, you'll often find
            me
            deeply involved in coding and working on my personal website. In addition, i love spending quality
            moments with
            friends and exploring various places.
          </p>
        </div>
        <div className="flex-grow lg:w-4/12">
          <img src={PhotoOfMe} className="block mx-auto h-full w-full rounded-full "/>
        </div>
      </section>
      <section>
        <h1>Technologies Used</h1>
      </section>
    </div>
  )
}
