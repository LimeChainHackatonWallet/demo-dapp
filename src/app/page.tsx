"use client";
import Image from "next/image";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { useAppState } from "@/context/stateContext";

// TODO: move to env?
const WALLET_URL = "http://localhost:5173/pay";
const DAPP_WALLET_ADDRESS = "5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY"

export default function Home() {
  const appState = useAppState();

  async function login() {
    const randomMessage = "random"; // TODO: make random
    function buildSupportedPaymentMethodData() {
      return [
        {
          supportedMethods: WALLET_URL,
          data: { type: "sign", message: randomMessage },
        },
      ];
    }

    function buildShoppingCartDetails() {
      return {
        total: {
          label: "Fake Total",
          amount: { currency: "USD", value: "0" },
        },
      };
    }

    const request = new PaymentRequest(
      buildSupportedPaymentMethodData(),
      buildShoppingCartDetails()
    );

    try {
      const paymentResponse = await request.show();
      paymentResponse.complete("success");
      const {
        signature: sig,
        publicKey: pk,
        message,
      } = paymentResponse.details;

      const messageBytes = new TextEncoder().encode(message);
      const signature = bs58.decode(sig);
      const publicKeyBytes = new PublicKey(pk).toBytes();

      const verified = nacl.sign.detached.verify(
        messageBytes,
        signature,
        publicKeyBytes
      );

      if (verified) {
        appState.setAddress(pk);
      }
    } catch (e) {
      console.log("unsuccessful payment", e);
    }
  }

  async function send() {
    const toPubKey = new PublicKey(DAPP_WALLET_ADDRESS)

    function buildSupportedPaymentMethodData() {
      return [
        {
          supportedMethods: WALLET_URL,
          data: { type: "payment", to: toPubKey.toBase58(), amount: 1 },
        },
      ];
    }

    function buildShoppingCartDetails() {
      return {
        total: {
          label: "Fake Total",
          amount: { currency: "USD", value: "0" },
        },
      };
    }

    const request = new PaymentRequest(
      buildSupportedPaymentMethodData(),
      buildShoppingCartDetails()
    );

    try {
      const paymentResponse = await request.show();
      paymentResponse.complete("success");
      const {txid} = paymentResponse.details
      console.log(`Receveived tx hash ${txid}`)
      // TODO: check if value is received
    } catch (e) {
      console.log("unsuccessful payment", e);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        {!appState.address ? (
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              onClick={login}
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <Link
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </div>

            <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              onClick={send}
            >
              Test Send
            </button>
          </div>
          </div>
        )}

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
