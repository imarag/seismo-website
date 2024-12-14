import { useEffect, useState } from "react"
import aboutMarkdown from "../markdowns/About.md";
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {darcula} from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function About() {
  const [markdownContent, setMarkdownContent] = useState("");
  useEffect(() => {
    fetch(aboutMarkdown)
      .then((response) => response.text())
      .then((text) => {
        setMarkdownContent(text)
      });
  }, []);

  return (
    <section className="container">
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
                style={darcula}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          },
          img(props) {
            const { src, alt, ...rest } = props;
            const imagePath = require(`../img/${src}`);
            return <img src={imagePath} alt={alt} style={{maxWidth: "100%", display: "block", marginInline: "auto"}} {...rest} />;
          }
        }}
      />
    </section>
  )
}
