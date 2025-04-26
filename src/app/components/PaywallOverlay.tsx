"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";

// Define payment wallet URL - using the same as in the home page
const WALLET_URL = "http://localhost:5173/pay";
const DAPP_WALLET_ADDRESS = "5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY";

interface PaywallOverlayProps {
  title: string;
  price: number;
  onPaymentSuccess: () => void;
  onClose?: () => void; // Optional close handler
}

export default function PaywallOverlay({
  title,
  price,
  onPaymentSuccess,
  onClose,
}: PaywallOverlayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePayment() {
    setIsProcessing(true);
    setError(null);

    try {
      const toPubKey = new PublicKey(DAPP_WALLET_ADDRESS);

      function buildSupportedPaymentMethodData() {
        return [
          {
            supportedMethods: WALLET_URL,
            data: {
              type: "payment",
              to: toPubKey.toBase58(),
              amount: price,
            },
          },
        ];
      }

      function buildShoppingCartDetails() {
        return {
          total: {
            label: `Unlock: ${title}`,
            amount: { currency: "USD", value: "0" },
          },
        };
      }

      const request = new PaymentRequest(
        buildSupportedPaymentMethodData(),
        buildShoppingCartDetails()
      );

      const paymentResponse = await request.show();
      paymentResponse.complete("success");
      const { txid } = paymentResponse.details;
      console.log(`Received tx hash ${txid}`);

      onPaymentSuccess();
    } catch (e) {
      console.error("Payment failed:", e);
      setError("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-[#f3ead9]/50 backdrop-blur-sm"></div>
      <div className="bg-[#f9f5ea] shadow-xl w-full max-w-md border border-[#bfb599] rounded-md overflow-hidden z-10">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#5d4a2e] hover:text-[#3d2f18] transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        <div className="p-6">
          <h3 className="text-2xl font-serif mb-2 text-[#473a1e]">
            Premium Content
          </h3>
          <p className="mb-5 text-[#3d2f18]">
            This article is premium content. Pay a small fee to continue
            reading.
          </p>
        </div>

        <div className="bg-[#e9dfc8] p-4">
          <div className="flex justify-between items-center py-1">
            <span className="text-[#5d4a2e] font-medium">Article:</span>
            <span className="text-[#3d2f18] font-serif">{title}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#5d4a2e] font-medium">Price:</span>
            <span className="text-[#3d2f18] font-bold">
              {price.toFixed(2)} USD
            </span>
          </div>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        <div className="p-4 pt-5 flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#e9dfc8] text-[#473a1e] cursor-pointer font-medium hover:bg-[#dfd3b9] transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`py-3 bg-[#bfb599] text-[#473a1e] cursor-pointer font-medium hover:bg-[#cfc4a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              onClose ? "flex-1" : "w-full"
            }`}
          >
            {isProcessing
              ? "Processing..."
              : `Pay ${price.toFixed(2)} USD to Unlock`}
          </button>
        </div>
      </div>
    </div>
  );
}
