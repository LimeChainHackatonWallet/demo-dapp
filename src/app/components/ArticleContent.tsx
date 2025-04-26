"use client";

import { useState, useEffect } from "react";
import PaywallOverlay from "./PaywallOverlay";
import { useAppState } from "@/context/stateContext";
import Link from "next/link";

interface ArticleContentProps {
  article: {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: { [key: string]: number };
    views: number;
    userId: number;
    publishedAt?: string;
  };
}

function isPremiumArticle(id: number): boolean {
  return id % 2 === 0;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const { address } = useAppState();
  const isPremium = isPremiumArticle(article.id);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaywall, setShowPaywall] = useState(true);
  const price = +(1 + Math.random() * 0.5).toFixed(2);

  useEffect(() => {
    if (!isPremium) {
      setIsPaid(true);
      return;
    }

    const unlockedArticles = JSON.parse(
      localStorage.getItem("unlockedArticles") || "[]"
    );
    if (unlockedArticles.includes(article.id)) {
      setIsPaid(true);
    }
  }, [article.id, isPremium]);

  const handlePaymentSuccess = () => {
    const unlockedArticles = JSON.parse(
      localStorage.getItem("unlockedArticles") || "[]"
    );
    if (!unlockedArticles.includes(article.id)) {
      unlockedArticles.push(article.id);
      localStorage.setItem(
        "unlockedArticles",
        JSON.stringify(unlockedArticles)
      );
    }
    setIsPaid(true);
  };

  const handleClosePaywall = () => {
    setShowPaywall(false);
  };

  // Login prompt component
  const LoginPrompt = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-[#f3ead9]/50 backdrop-blur-sm"></div>
      <div className="bg-[#f9f5ea] shadow-xl w-full max-w-md border border-[#bfb599] rounded-md overflow-hidden z-10 p-6">
        <div className="text-center">
          <h3 className="text-2xl font-serif mb-4 text-[#473a1e]">
            Authentication Required
          </h3>
          <div className="w-16 h-1 bg-[#c3b393] mx-auto mb-4"></div>
          <p className="mb-6 text-[#3d2f18]">
            Please log in to unlock premium content. Only authenticated users
            can purchase articles.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full border border-solid border-[#9c8866] transition-colors bg-[#c3b393] text-[#3d2f18] hover:bg-[#d5c8af] font-medium px-8 py-3"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div
        className={`prose prose-lg max-w-none prose-headings:text-[#4a3922] prose-p:text-[#3d2f18] ${
          isPremium && !isPaid ? "blur-md select-none" : ""
        }`}
      >
        <p className="text-lg leading-relaxed whitespace-pre-line">
          {article.body}
        </p>
      </div>

      {/* Show login prompt if premium article and user is not logged in */}
      {isPremium && !isPaid && !address && showPaywall && <LoginPrompt />}

      {/* Show paywall only if premium article, not paid, and user is logged in */}
      {isPremium && !isPaid && address && showPaywall && (
        <PaywallOverlay
          title={article.title}
          price={price}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={handleClosePaywall}
        />
      )}

      {/* Show unlock button if user dismissed the overlay */}
      {isPremium && !isPaid && !showPaywall && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowPaywall(true)}
            className="bg-[#bfb599] text-[#473a1e] px-4 py-2 rounded font-medium hover:bg-[#cfc4a8] transition-colors"
          >
            Unlock Premium Content
          </button>
        </div>
      )}

      {article.reactions && (
        <div
          className={`mt-8 pt-4 border-t border-[#c3b393] ${
            isPremium && !isPaid ? "opacity-50" : ""
          }`}
        >
          <h3 className="text-lg font-semibold text-[#5d4a2e] mb-3">
            Reactions
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(article.reactions).map(([reaction, count]) => (
              <div
                key={reaction}
                className="flex items-center gap-2 bg-[#e9dfc8] px-4 py-2 rounded-full"
              >
                <span className="text-2xl">{reaction}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
