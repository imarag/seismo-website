import Image from "next/image";
export default async function test() {
    const res = await fetch(`http://127.0.0.1:8000/static-data/articles/1`);
    const data = await res.json();
    console.log(data)
    return (
        <div>
            <p>what</p>
            {/* <img src={data["image_path"]} /> */}
            <Image src={data["image_path"]} width={100} height={100} />
            <ul>
                <li>{data["title"]}</li>
                <li>{data["image_path"]}</li>
            </ul>
        </div>
    )
}