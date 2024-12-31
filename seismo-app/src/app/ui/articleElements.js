import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Image from 'next/image';

export function Code({ children, language }) {
  return (
    <SyntaxHighlighter
      language={language || 'python'}
      style={dracula}
      PreTag="div"
    >
      {children}
    </SyntaxHighlighter>
  );
}

export function Img({ src, alt, caption }) {
  return (
    <div>
        <Image
            src={src}
            alt={alt}
            className=""
            />
        <p>{caption}</p>
    </div>
  );
}

export function H1({ children }) {
  return <h1 className="text-primary mt-5 mb-4 text-center display-6">{children}</h1>;
}

export function H2({ children }) {
  return <h2 className="text-dark mt-5 mb-4">{children}</h2>;
}

export function Paragraph({ children }) {
  return <p className="lead fs-5">{children}</p>;
}

export function ListContainer({ children }) {
    return (
        <ul>
            { children }
        </ul>
    )
}

export function ListItem({ children }) {
  return <li className="lead">{children}</li>;
}
