import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function useMDXComponents(components) {
    return {
        h2: ({ children }) => (
            <h1 className="text-4xl text-start font-normal mb-10 mt-20">{children}</h1>
        ),
        h3: ({ children }) => (
            <h2 className="text-xl text-start font-normal mt-10 mb-5" >{children}</h2>
        ),
        p: ({ children }) => (
            <p className="font-light text-xl my-5" >{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="my-5 px-10">
                {children}
            </ul>
        ),
        a: ({ children, href }) => (
            <a href={href} className="link link-info" target="_blank">
                {children}
            </a>
        ),
        li: ({ children }) => (
            <li className="font-light text-xl my-3 list-disc">
                {children}
            </li>
        ),
        code(props) {
            const { children, className, node, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
                <SyntaxHighlighter
                    {...rest}
                    language={match[1]}
                    children={String(children).replace(/\n$/, '')}
                    PreTag="div"
                    showLineNumbers={true}
                    style={dracula}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code {...rest} className="bg-base-200 px-2 py-1 rounded text-light font-light fs-6">
                    {children}
                </code>
            )
        },
        img: (props) => (
            <img
                width={500}
                height={500}
                className="w-full lg:w-3/4 xl:w-2/3 block mx-auto mb-4"
                src={props.src}
                {...props}
            />
        ),
        ...components,
    }
}