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
      if (product?.isHomeButton) {
        // Already on home page, ignore
        return;
      }
      if (product && !product.isPlaceholder && product.productImage) {
        router.push(`/product/${code}`);
      } else {
        showInvalidToast(code);
      }
    },
  });

  const showInvalidToast = (code: string) => {
    setToastMessage("Barcode not valid");
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
        {/* Product grid - custom 3-row layout */}
        <div className="flex flex-col gap-6">
          {/* Row 1: Chips, Milk, Cereal - 3 square tiles */}
          <div className="flex gap-6">
            <button
              onClick={() => handleTileClick("SC7")}
              className="tile-button relative transition-transform hover:scale-105 active:scale-95 overflow-hidden"
              style={{ width: '320px', height: '320px' }}
              aria-label="Solo Crunch Chips"
            >
              <Image
                src="/homescr/btn-chips.png"
                alt="Solo Crunch Chips"
                fill
                className="object-cover"
              />
            </button>
            <button
              onClick={() => handleTileClick("FM3")}
              className="tile-button relative transition-transform hover:scale-105 active:scale-95 overflow-hidden"
              style={{ width: '320px', height: '320px' }}
              aria-label="Filter Milk"
            >
              <Image
                src="/homescr/btn-milk.png"
                alt="Filter Milk"
                fill
                className="object-cover"
              />
            </button>
            <button
              onClick={() => handleTileClick("VC9")}
              className="tile-button relative transition-transform hover:scale-105 active:scale-95 overflow-hidden"
              style={{ width: '320px', height: '320px' }}
              aria-label="Vibe Ce-real"
            >
              <Image
                src="/homescr/btn-cereal.png"
                alt="Vibe Ce-real"
                fill
                className="object-cover"
              />
            </button>
          </div>

          {/* Row 2: Tea, Noodles - 2 wider tiles */}
          <div className="flex gap-6">
            <button
              onClick={() => handleTileClick("WT2")}
              className="tile-button relative transition-transform hover:scale-105 active:scale-95 overflow-hidden"
              style={{ width: '493px', height: '320px' }}
              aria-label="Whatever Tea"
            >
              <Image
                src="/homescr/btn-tea.png"
                alt="Whatever Tea"
                fill
                className="object-cover"
              />
            </button>
            <button
              onClick={() => handleTileClick("IV8")}
              className="tile-button relative transition-transform hover:scale-105 active:scale-95 overflow-hidden"
              style={{ width: '493px', height: '320px' }}
              aria-label="Instant Viral Noodles"
            >
              <Image
                src="/homescr/btn-noodles.png"
                alt="Instant Viral Noodles"
                fill
                className="object-cover"
              />
            </button>
          </div>
        </div>

        {/* Row 3: Signals Room banner - full width */}
        <div className="relative h-28" style={{ width: '1012px' }}>
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
        <div
          className="toast fixed left-1/2 z-50 backdrop-blur-sm shadow-2xl"
          style={{
            bottom: '3rem',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: '1.5rem 3rem',
            backgroundImage: `
              linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%),
              linear-gradient(0deg, #9EFF00 0%, #9EFF00 100%),
              linear-gradient(90deg, #9EFF00 0%, #9EFF00 100%),
              linear-gradient(90deg, #9EFF00 0%, #9EFF00 100%),
              linear-gradient(0deg, #9EFF00 0%, #9EFF00 100%)
            `,
            backgroundSize: 'calc(100% - 12px) calc(100% - 12px), 6px calc(100% - 16px), calc(100% - 16px) 6px, calc(100% - 16px) 6px, 6px calc(100% - 16px)',
            backgroundPosition: '6px 6px, 0 8px, 8px 0, 8px 100%, 100% 8px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <p
            className="font-bold tracking-wider"
            style={{
              color: '#9EFF00',
              fontSize: '1.75rem',
              margin: 0,
              padding: 0,
            }}
          >
            {toastMessage}
          </p>
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
