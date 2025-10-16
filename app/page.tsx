"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { PRODUCTS, getProduct, PRODUCT_CODES } from "@/lib/products";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Check for invalid scan from redirect
  useEffect(() => {
    const invalidCode = searchParams.get("invalid");
    if (invalidCode) {
      showInvalidToast(invalidCode);
      // Clean up URL
      router.replace("/");
    }
  }, [searchParams, router]);

  // Handle barcode scans
  useBarcodeScanner({
    onScan: (code) => {
      const product = getProduct(code);
      if (product && !product.isPlaceholder && product.productImage) {
        router.push(`/product/${code}`);
      } else {
        showInvalidToast(code);
      }
    },
  });

  const showInvalidToast = (code: string) => {
    setToastMessage(`Unknown barcode: ${code}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleTileClick = (code: string) => {
    const product = getProduct(code);
    if (product && !product.isPlaceholder && product.productImage) {
      router.push(`/product/${code}`);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background image with logo and instructions */}
      <Image
        src="/home-bg.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Right side container for grid and banner */}
      <div className="absolute right-0 top-0 w-[60%] h-full flex flex-col items-start justify-center gap-10 pl-8 pr-12 py-12">
        {/* Product grid - fixed size tiles */}
        <div className="grid grid-cols-3 gap-6">
          {PRODUCT_CODES.map((code) => {
            const product = PRODUCTS[code];
            return (
              <button
                key={code}
                onClick={() => handleTileClick(code)}
                className="tile-button relative transition-transform hover:scale-105 active:scale-95 overflow-hidden"
                style={{ width: '320px', height: '320px' }}
                aria-label={product.name}
              >
                <Image
                  src={product.tileImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Signals Room banner below grid - matches grid width exactly */}
        <div className="relative h-28" style={{ width: '1008px' }}>
          <Image
            src="/homescr/signals-room-box.png"
            alt="Step into the Signals Room"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="toast fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl">
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
