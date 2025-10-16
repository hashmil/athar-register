"use client";

import { useEffect, useRef } from "react";

interface UseBarcodeScanner {
  onScan: (code: string) => void;
  enabled?: boolean;
}

const SCAN_TIMEOUT = 300; // ms
const IGNORED_KEYS = [
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "Tab",
  "Escape",
  "CapsLock",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];

export function useBarcodeScanner({ onScan, enabled = true }: UseBarcodeScanner) {
  const scanBufferRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore modifier and navigation keys
      if (IGNORED_KEYS.includes(event.key)) {
        return;
      }

      // Handle Enter key - complete the scan
      if (event.key === "Enter") {
        event.preventDefault();
        if (scanBufferRef.current.trim()) {
          const code = scanBufferRef.current.trim().toUpperCase();
          scanBufferRef.current = "";
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          onScan(code);
        }
        return;
      }

      // Ignore non-printable characters
      if (event.key.length !== 1) {
        return;
      }

      // Prevent default to avoid typing in any focused inputs
      event.preventDefault();

      // Add character to buffer
      scanBufferRef.current += event.key;

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to process scan after idle period
      timeoutRef.current = setTimeout(() => {
        if (scanBufferRef.current.trim()) {
          const code = scanBufferRef.current.trim().toUpperCase();
          scanBufferRef.current = "";
          onScan(code);
        } else {
          scanBufferRef.current = "";
        }
      }, SCAN_TIMEOUT);
    };

    // Attach to window to ensure global capture
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onScan, enabled]);
}
