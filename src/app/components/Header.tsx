import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-600 dark:border-gray-500">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-2xl font-bold font-serif">
            Paid News
          </Link>
        </div>
      </div>
    </header>
  );
}
