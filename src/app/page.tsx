"use client";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { useAppState } from "@/context/stateContext";

// TODO: move to env?
const WALLET_URL = "http://localhost:5173/pay";

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

  return (
    <div className="min-h-screen bg-[#f3ead9] text-[#3d2f18] flex flex-col items-center">
      <main className="container mx-auto max-w-3xl px-6 py-16 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#4a3922] mb-6">Paid News</h1>
          <div className="w-32 h-1 bg-[#c3b393] mx-auto mb-6"></div>
          <p className="text-lg text-[#5d4a2e] max-w-xl mx-auto">
            Your premium source for exclusive content and insightful articles.
          </p>
        </div>

        <div className="w-full bg-[#f9f5ea] border border-[#9c8866] rounded-lg p-8 shadow-md mb-12">
          {!appState.address ? (
            <div className="text-center">
              <h2 className="text-2xl font-serif text-[#4a3922] mb-4">
                Welcome Guest
              </h2>
              <p className="mb-6 text-[#5d4a2e]">
                Please log in with your wallet to access our premium features
                and exclusive blog articles. Authentication is required to read
                our content.
              </p>
              <button
                className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium px-8 py-3 mx-auto"
                onClick={login}
              >
                Login with Wallet
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-serif text-[#4a3922] mb-4">
                Welcome Back
              </h2>
              <p className="mb-6 text-[#5d4a2e]">
                You&apos;re now logged in and have full access to all premium
                content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium px-6 py-3"
                  href="/dashboard"
                >
                  Go to Dashboard
                </Link>
                <Link
                  className="rounded-full border border-solid border-[#9c8866] transition-colors flex items-center justify-center bg-[#c3b393] text-[#3d2f18] gap-2 hover:bg-[#d5c8af] font-medium px-6 py-3"
                  href="/blog"
                >
                  Read Premium Articles
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-serif text-[#4a3922] mb-3">
            What We Offer
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            <div className="bg-[#f9f5ea] p-5 rounded-lg border border-[#d5c8af]">
              <div className="text-2xl mb-2">📰</div>
              <h4 className="font-medium text-[#4a3922] mb-2">
                Premium Articles
              </h4>
              <p className="text-sm text-[#5d4a2e]">
                Exclusive content written by experts
              </p>
            </div>
            <div className="bg-[#f9f5ea] p-5 rounded-lg border border-[#d5c8af]">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-medium text-[#4a3922] mb-2">
                Pay-per-article
              </h4>
              <p className="text-sm text-[#5d4a2e]">
                Only pay for what you want to read
              </p>
            </div>
            <div className="bg-[#f9f5ea] p-5 rounded-lg border border-[#d5c8af]">
              <div className="text-2xl mb-2">💳</div>
              <h4 className="font-medium text-[#4a3922] mb-2">
                Wallet Integration
              </h4>
              <p className="text-sm text-[#5d4a2e]">Easy and secure payments</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 bg-[#e9dfc8] mt-auto">
        <div className="container mx-auto text-center text-sm text-[#7d5f34]">
          <p>© {new Date().getFullYear()} Paid News. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
