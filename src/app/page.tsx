"use client";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { useAppState } from "@/context/stateContext";

// TODO: move to env?
const WALLET_URL = "http://localhost:5173/pay";
const DAPP_WALLET_ADDRESS = "5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY";

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
    const toPubKey = new PublicKey(DAPP_WALLET_ADDRESS);

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
      const { txid } = paymentResponse.details;
      console.log(`Receveived tx hash ${txid}`);
      // TODO: check if value is received
    } catch (e) {
      console.log("unsuccessful payment", e);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[#f3ead9] text-[#3d2f18]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl mb-8 font-serif text-[#4a3922]">
          Crypto Wallet Demo
        </h1>
        {!appState.address ? (
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button
              className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              onClick={login}
            >
              Login
            </button>
            <Link
              href="/blog"
              className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            >
              Blog
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <Link
                className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="/blog"
              >
                Blog
              </Link>
            </div>

            <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
              <button
                className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                onClick={send}
              >
                Test Send
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
