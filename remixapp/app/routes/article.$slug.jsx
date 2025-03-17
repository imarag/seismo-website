import { useParams } from "@remix-run/react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import Image from "@/components/utils/Image"
import { Title } from "@/components/utils/Typography"
import Section from "@/components/utils/Section"
import Container from "@/components/utils/Container"
import { articles } from "@/utils/topics"


export default function ArticleSlugPage() {
    const { slug } = useParams();
    const selectedArticle = articles.find(el => el.slug === slug)
    const ArticleMarkdown = selectedArticle.markdown
    return (
        <Section>
          <Container>
              <div className="flex flex-col xl:flex-row items-center justify-center gap-3">
                  <Image src={selectedArticle.icon} alt={selectedArticle.iconAlt} className="w-20" />
                  <Title text={selectedArticle.title} />
              </div>
              <ArticleMarkdown 
                  components={
                      {
                          h1: ({ children }) => (
                            <h1 className="text-4xl text-start font-normal mb-10 mt-20">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-3xl text-start font-normal mt-10 mb-5" >{children}</h2>
                          ),
                          p: ({ children }) => (
                            <p className="font-light text-xl my-5" >{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="my-5 px-10">
                              { children}
                            </ul>
                          ),
                          a: ({ children, href }) => (
                            <a href={href} className="link link-info" target="_blank">
                              { children}
                            </a>
                          ),
                          li: ({ children }) => (
                            <li className="font-light text-xl my-3 list-disc">
                              { children}
                            </li>
                          ),
                          code(props) {
                            const {children, className, node, ...rest} = props
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                            <SyntaxHighlighter
                                {...rest}
                                language={match[1]}
                                children={String(children).replace(/\n$/, '')}
                                PreTag="div"
                                showLineNumbers={true}
                              
                            />
                            ) : (
                            <code {...rest} className="bg-base-200 px-2 py-1 rounded text-light font-light fs-6">
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
                        }
                  }
              />
            </Container>
        </Section>
    )
}