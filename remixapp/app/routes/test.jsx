import { json } from "@remix-run/node"; 
import { useFetcher } from "@remix-run/react";

export function loader() {
    console.log("Loader is running...");
    return json({ languages: ["html", "css", "python", "java"]})
    
}

export default function testPage() {
    const fetcher = useFetcher();
    function myfunc() {
        fetcher.load("/test")
    }
    return (
        <div>
            <h1>You are in test</h1>
            <button className="btn btn-primary" onClick={myfunc}>cklick me</button>
            {fetcher.data && fetcher.data.languages && (
                <div>
                    {fetcher.data.languages.map((el, i) => (
                        <p key={i}>{el}</p>
                    ))}
                </div>
            )}
        </div>
    )
}
