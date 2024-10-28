
export function ArticleTitle({ text }) {
    return (
        <h1 className="text-5xl font-normal text-blue-950 text-start mb-5 mt-12">{ text }</h1>
    )
}

export function ArticleSubTitle({ text }) {
    return (
        <h2 className="text-3xl font-normal text-blue-950 text-start mb-5 mt-12">{ text }</h2>
    )
}

export function ArticleImage({ imageUrl, caption }) {
    return (
        <figure className="my-6">
            <img src={imageUrl} className="block mx-auto mb-2"/>
            <figcaption className="text-center text-blue-800 font-normal">{ caption }</figcaption>
        </figure>
    )
}

export function ArticleCode({ text }) {
    return (
        <>
            <code className="text-gray-800  text-base px-1 font-normal">{text}</code>
        </>
    )
}

export function ArticleGist({ gist }) {
    return (
        <div className="my-6">
            <ReactEmbedGist gist={gist} />
        </div>
    )
}
