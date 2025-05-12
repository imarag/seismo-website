import Img from "@/components/utils/Img";

import { LinkTag } from "@/components/utils/LinkComponents";
import { Paragraph } from "@/components/utils/Typography";
import { CardTitle, CardParagraph } from "@/components/utils/CardElements";

export default function ListArticles({ allArticles }) {
  return (
    <div className="flex flex-col gap-8">
      <Paragraph
        text={`${allArticles.length !== 0 ? allArticles.length : "No"
          } articles found`}
      />
      {allArticles.map((article) => (
        <div
          key={article.title}
          className="flex flex-row gap-8 flex-wrap md:flex-nowrap"
        >
          <div className="shrink-0 grow-0">
            <Img
              src={article.icon}
              alt={article.iconAlt}
              className="w-20 md:w-28"
            />
          </div>
          <div className="flex-shrink flex-grow">
            <CardTitle text={article.title} />
            <CardParagraph text={article.description} />
            {article.completed ? (
              <LinkTag href={`/articles/${article.slug}`}>Go to page</LinkTag>
            ) : (
              <span className="font-bold">Work in Progress</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
