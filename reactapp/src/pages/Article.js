import { useParams } from 'react-router-dom';
import { allArticles } from '../all-topics';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'
import "../styles/Article.css"

export default function Article() {
    const { articleName } = useParams();
    console.log(articleName)
    const [markdownContent, setMarkdownContent] = useState("");
    useEffect(() => {
        let MarkdownFile;
        for (let tp of allArticles) {
            if (articleName === tp.template_name){
                MarkdownFile = tp
            }
        }
        fetch(MarkdownFile.markdown)
        .then((response) => response.text())
        .then((text) => {
            setMarkdownContent(text)
        });
    }, []);

    

    return (
        <section>
            <Markdown
                children={markdownContent}
                components={{
                code(props) {
                    const {children, className, node, ...rest} = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                    <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        style={dracula}
                    />
                    ) : (
                    <code {...rest} className="bg-dark px-2 py-1 rounded text-light fw-light fs-6">
                        {children}
                    </code>
                    )
                },
                img(props) {
                    const { src, alt, ...rest } = props;
                    const imagePath = require(`../img/${src}`);
                    return <img src={imagePath} alt={alt} className="mt-5 d-block mx-auto col col-12 col-lg-8 col-xl-7 col-xxl-6" style={{maxWidth: "100%"}} {...rest} />;
                },
                h1(props) {
                    const {children, ...rest} = props
                    return <h1 className="text-primary mt-5 mb-4 text-center display-6">{children}</h1>
                },
                h2(props) {
                    const {children, ...rest} = props
                    return <h2 className="text-dark mt-5 mb-4">{children}</h2>
                },
                p(props) {
                    const {children, ...rest} = props
                    return <p className="lead fs-5">{children}</p>
                },
                li(props) {
                    const {children, ...rest} = props
                    return <li className="lead">{children}</li>
                }
                }}
            />
        </section>
    )
}
