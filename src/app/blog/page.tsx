import Link from "next/link";
import { BLOGS_API_URL } from "@/lib/constants";
import Header from "../components/Header";
import { formatDate, generateRandomDate } from "@/lib/utils";

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

export const revalidate = 3600;

async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch(BLOGS_API_URL, { next: { revalidate } });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    // Add random dates to the posts for display
    return (
      data.posts.map((post: Article) => ({
        ...post,
        publishedAt: generateRandomDate(),
      })) || []
    );
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
          articles.map((article: Article) => (
            <div
              key={article.id}
              className="border-t-2 border-[#9c8866] pt-4 flex flex-col h-full bg-[#f9f5ea] p-4 rounded-b-lg shadow-sm"
            >
              <Link href={`/blog/${article.id}`} className="hover:opacity-80">
                <h2 className="text-xl md:text-2xl font-bold mb-2 uppercase">
                  {article.title}
                </h2>
              </Link>
              <div className="text-sm text-[#5d4a2e] mb-4">
                {article.publishedAt && formatDate(article.publishedAt)}
                <div className="mt-1">
                  Views: {article.views} | User: {article.userId}
                </div>
                {article.tags && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {article.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#e9dfc8] px-2 py-1 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="flex-grow mb-4 text-[#3d2f18]">
                {article.body.substring(0, 160)}
                {article.body.length > 160 ? "..." : ""}
              </p>
              <div className="mt-auto flex justify-between">
                <Link
                  href={`/blog/${article.id}`}
                  className="uppercase text-[#7d5f34] hover:text-[#5d4a2e] font-semibold"
                >
                  MORE
                </Link>
                {article.reactions && (
                  <div className="flex items-center gap-2">
                    {Object.entries(article.reactions).map(
                      ([reaction, count]) => (
                        <span key={reaction} className="text-sm text-[#7d5f34]">
                          {reaction}: {count}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
