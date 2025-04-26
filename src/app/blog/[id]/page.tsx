import Link from "next/link";
import { BLOGS_API_URL } from "@/lib/constants";
import Header from "../../components/Header";
import { notFound } from "next/navigation";
import { formatDate, generateRandomDate } from "@/lib/utils";
import ArticleContent from "../../components/ArticleContent";

interface Article {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { [key: string]: number };
  views: number;
  userId: number;
  publishedAt?: string;
}

// Set revalidation time to refresh cache every hour
export const revalidate = 3600;

async function fetchArticle(id: string): Promise<Article | null> {
  try {
    const response = await fetch(`${BLOGS_API_URL}/${id}`, {
      next: { revalidate },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const post = await response.json();

    // Add publishedAt for display purposes
    return {
      ...post,
      publishedAt: generateRandomDate(),
    };
  } catch (err) {
    console.error("Failed to fetch article:", err);
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await fetchArticle(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f3ead9] text-[#3d2f18]">
      <Header />

      <main className="container mx-auto p-4 max-w-4xl">
        <Link
          href="/blog"
          className="inline-block mb-6 uppercase text-[#7d5f34] hover:text-[#5d4a2e] font-semibold"
        >
          ← Back to Articles
        </Link>

        <article className="border-t-2 border-[#9c8866] pt-6 bg-[#f9f5ea] p-6 rounded-b-lg shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase">
            {article.title}
          </h1>

          <div className="text-sm text-[#5d4a2e] mb-6">
            {article.publishedAt && formatDate(article.publishedAt)}
            <div className="mt-2 flex items-center gap-2">
              <span>Views: {article.views}</span>
              <span className="mx-1">•</span>
              <span>User ID: {article.userId}</span>
            </div>
            {article.tags && (
              <div className="mt-3 flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#e9dfc8] px-3 py-1 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Use the client component for the article content with paywall */}
          <ArticleContent article={article} />
        </article>
      </main>
    </div>
  );
}
