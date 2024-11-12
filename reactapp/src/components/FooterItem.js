
export default function FooterItem({title, listItems}) {
  return (
    <div className="basis-auto">
        <h1 className="text-center font-semibold mb-2 text-lg">{title}</h1>
        <ul className="font-light text-center">{ listItems }</ul>
    </div>
  )
}
