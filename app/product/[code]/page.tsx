"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { getProduct } from "@/lib/products";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const product = getProduct(code);

  // Redirect to home if invalid code or placeholder
  useEffect(() => {
    if (!product || product.isPlaceholder || !product.productImage) {
      router.replace("/");
    }
  }, [product, router]);

  // Handle barcode scans from product page
  useBarcodeScanner({
    onScan: (scannedCode) => {
      const scannedProduct = getProduct(scannedCode);
      if (scannedProduct && !scannedProduct.isPlaceholder && scannedProduct.productImage) {
        router.push(`/product/${scannedCode}`);
      } else {
        // Invalid scan - return to home with toast (handled by home page)
        router.push("/?invalid=" + scannedCode);
      }
    },
  });

  if (!product || !product.productImage) {
    return null;
  }

  // Use white back button for Solo Crunch Chips and Noodles, black for others
  const backButtonImage = (code === "SC7" || code === "IV8")
    ? "/back-btn-white.png"
    : "/back-btn-black.png";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Full-screen product image */}
      <Image
        src={product.productImage}
        alt={product.name}
        fill
        className="object-cover"
        priority
      />

      {/* Back button - top-left (color varies by product) */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-10 transition-transform hover:scale-110 active:scale-95"
        aria-label="Back to home"
      >
        <Image
          src={backButtonImage}
          alt="Back"
          width={60}
          height={60}
          className="drop-shadow-lg"
        />
      </button>
    </div>
  );
}
