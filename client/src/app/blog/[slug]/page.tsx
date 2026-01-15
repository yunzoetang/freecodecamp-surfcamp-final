import type { ArticleProps } from "@/types";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/format-date";
import { getContentBySlug, getGlobalSettings } from "@/data/loaders";

import { BlogCard } from "@/components/BlogCard";
import { HeroSection } from "@/components/blocks/HeroSection";
import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/articles");
  const article = data[0];
  if (!article) throw notFound();
  return { article: article as ArticleProps, blocks: article?.blocks };
}

async function gloader() {
  const { data } = await getGlobalSettings();
  if (!data) throw new Error("Failed to fetch global settings");
  return { placeholder: data?.placeholder };
}

interface ArticleOverviewProps {
  headline: string;
  description: string;
}

function ArticleOverview({
  headline,
  description,
}: Readonly<ArticleOverviewProps>) {
  return (
    <div className="article-overview">
      <div className="article-overview__info">
        <h3 className="article-overview__headline">{headline}</h3>
        <p className="article-overview__description">{description}</p>
      </div>
    </div>
  );
}

export default async function SingleBlogRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { article, blocks } = await loader(slug);
  const { title, author, publishedAt, description, image } = article;
  const { placeholder } = await gloader();
  
  return (
    <div>
      <HeroSection
        id={article.id}
        heading={title ?? ""}
        theme="orange"
        image={image ?? placeholder.url}
        author={author}
        publishedAt={formatDate(publishedAt ?? "")}
        darken={true}
      />
      
      <div className="container">
        <ArticleOverview headline="In this blog" description={description ?? ""} />
        <BlockRenderer blocks={blocks} />
        <ContentList
          headline="Featured Articles"
          path="/api/articles"
          component={BlogCard}
          featured={true}
          headlineAlignment="center"
        />
      </div>
      

    </div>
  );
}
