import Image from 'next/image'
 
// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.
 
export function useMDXComponents(components) {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl">{children}</h1>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        width={500}
        height={500}
        src={`props.src`}
        {...props}
      />
    ),
    ...components,
  }
}