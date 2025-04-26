import Link from "next/link";
import { BLOGS_API_URL } from "@/lib/constants";
import Header from "../components/Header";
import { formatDate } from "@/lib/utils";

interface Article {
  title: string;
  description: string;
  pubDate: string;
  creator?: string[] | null;
  source_id?: string;
  category?: string[];
  link: string;
}

// Set revalidation time to refresh cache every hour
export const revalidate = 3600;

async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch(BLOGS_API_URL, { next: { revalidate } });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    console.error("Failed to fetch articles:", err);
    return [];
  }
}

export default async function BlogPage() {
  const articles = await fetchArticles();

  return (
    <div className="min-h-screen bg-[#f3ead9] text-[#3d2f18]">
      <Header />

      <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        {articles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p>No articles found. Please check back later.</p>
          </div>
        ) : (
          articles.map((article: Article, index: number) => (
            <div
              key={index}
              className="border-t-2 border-[#9c8866] pt-4 flex flex-col h-full bg-[#f9f5ea] p-4 rounded-b-lg shadow-sm"
            >
              <Link href={`/blog/${index}`} className="hover:opacity-80">
                <h2 className="text-xl md:text-2xl font-bold mb-2 uppercase">
                  {article.title}
                </h2>
              </Link>
              <div className="text-sm text-[#5d4a2e] mb-4">
                {formatDate(article.pubDate)}
                <div className="mt-1">
                  {article.source_id} -{" "}
                  {article.category && article.category.join(" - ")}
                </div>
              </div>
              <p className="flex-grow mb-4 text-[#3d2f18]">
                {article.description?.substring(0, 200)}
                {article.description && article.description.length > 200
                  ? "..."
                  : ""}
              </p>
              <div className="mt-auto flex justify-between">
                <Link
                  href={`/blog/${index}`}
                  className="uppercase text-[#7d5f34] hover:text-[#5d4a2e] font-semibold"
                >
                  MORE
                </Link>
                <Link
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#7d5f34] hover:text-[#5d4a2e]"
                >
                  Original Source
                </Link>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
