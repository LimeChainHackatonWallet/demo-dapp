"use client";
import { useAppState } from "@/context/stateContext";
import Link from "next/link";

export default function Page() {
  const appState = useAppState();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[#f3ead9] text-[#3d2f18]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-serif mb-6 text-[#4a3922]">Dashboard</h1>

        <div className="mb-8 p-6 border border-[#9c8866] rounded-lg bg-[#f9f5ea] w-full max-w-2xl shadow-sm">
          <h2 className="text-xl font-serif mb-4 border-b border-[#c3b393] pb-2 text-[#5d4a2e]">
            Wallet Information
          </h2>
          <p className="font-serif mb-2 text-[#3d2f18]">
            Address: {appState.address}
          </p>
        </div>

        <Link
          className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          href="/"
        >
          Back to Home
        </Link>
      </main>
    </div>
  );
}
