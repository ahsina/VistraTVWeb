import BlogArticleClient from "./blog-article-client"

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  return <BlogArticleClient slug={params.slug} />
}
