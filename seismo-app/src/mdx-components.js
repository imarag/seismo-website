import Image from 'next/image'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'

 
export function useMDXComponents(components) {
  return {
    h1: ({ children }) => (
      <h1 className="text-5xl text-center font-normal mb-10 mt-32">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl text-start font-normal mt-10 mb-5" >{children}</h2>
    ),
    p: ({ children }) => (
      <p className="font-light text-xl my-5" >{children}</p>
    ),
    code(props) {
      const {children, className, node, ...rest} = props
      const match = /language-(\w+)/.exec(className || '')
      return match ? (
      <SyntaxHighlighter
          {...rest}
          language="python"
          children={String(children).replace(/\n$/, '')}
          PreTag="div"
          showLineNumbers={true}
          style={dracula}
      />
      ) : (
      <code {...rest} className="bg-dark px-2 py-1 rounded text-light fw-light fs-6">
          {children}
      </code>
      )
  },  
    img: (props) => (
      <Image
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