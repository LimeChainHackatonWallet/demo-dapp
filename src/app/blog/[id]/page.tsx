import Link from "next/link";
import { BLOGS_API_URL } from "@/lib/constants";
import Header from "../../components/Header";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface Article {
  title: string;
  description: string;
  pubDate: string;
  creator?: string[] | null;
  source_id?: string;
  category?: string[];
  link: string;
  content?: string;
  image_url?: string;
}

// Set revalidation time to refresh cache every hour
export const revalidate = 3600;

async function fetchArticle(id: string): Promise<Article | null> {
  try {
    const response = await fetch(`${BLOGS_API_URL}&size=50`, {
      next: { revalidate },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const articles = data.results || [];

    // For demo purposes, use the ID param to select an article from the list
    const foundArticle = articles[parseInt(id, 10)];

    if (!foundArticle) {
      return null;
    }

    return foundArticle as Article;
  } catch (err) {
    console.error("Failed to fetch article:", err);
    return null;
  }
}

// Format date to match the design

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
            {article.pubDate && formatDate(article.pubDate)}
            <div className="mt-1">
              {article.source_id} -{" "}
              {article.category && article.category.join(" - ")}
            </div>
            {article.creator && (
              <div className="mt-1">By: {article.creator.join(", ")}</div>
            )}
          </div>

          {article.image_url && (
            <div className="mb-6">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto rounded"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none prose-headings:text-[#4a3922] prose-p:text-[#3d2f18]">
            {article.content || article.description}
          </div>

          <div className="mt-8 pt-4 border-t border-[#c3b393]">
            <Link
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7d5f34] hover:text-[#5d4a2e] hover:underline"
            >
              Read original article
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
