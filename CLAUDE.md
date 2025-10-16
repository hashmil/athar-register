# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-screen kiosk web app for product browsing with USB barcode scanner integration. Designed for **19:6 aspect ratio** displays (e.g., ultrawide monitors), optimized for Raspberry Pi or desktop kiosk deployments.

## Commands

```bash
# Development
bun dev                  # Start dev server with hot reload on localhost:3000
npm run dev             # Alternative using npm

# Production
bun run build           # Build optimized production bundle with Turbopack
bun start              # Start production server

# Dependencies
bun install            # Install all dependencies
```

## Architecture

### Core Components

**Product Data Layer** (`lib/products.ts`)
- Central source of truth for all product data and barcode mappings
- Products indexed by uppercase barcode strings (SC7, IV8, VC9, WT2, FM3, PL0)
- Each product has: code, name, tileImage (home grid), productImage (full-screen), optional isPlaceholder flag
- All barcode lookups normalize to uppercase and trim whitespace

**Barcode Scanner Hook** (`hooks/useBarcodeScanner.ts`)
- Global keyboard event listener attached to `window` with capture phase
- Uses **300ms debounce** to distinguish scanner input from human typing
- Completes scan on **Enter key** (carriage return) or timeout
- Prevents default on all printable characters to avoid unintended input
- Scanner must be configured in **keyboard-wedge mode** (HID) with CR suffix

**Home Page** (`app/page.tsx`)
- Split layout: background image (left 40%) + product grid (right 60%)
- Background (`home-bg.png`) includes Youth Studio branding, "SCAN AT ITEM" text, and decorative elements
- Grid: 3×2 layout with 6 tiles (320×320px each, 24px gaps)
- Yellow "Signals Room" banner below grid matches grid width (1008px)
- Uses Suspense boundary for `useSearchParams()` (Next.js 15 requirement)
- Invalid scans show toast notification for 2 seconds

**Product Pages** (`app/product/[code]/page.tsx`)
- Full-screen product images with dynamic routing
- Back button color varies by product:
  - **White**: SC7 (Solo Crunch Chips), IV8 (Instant Viral Noodles)
  - **Black**: VC9, WT2, FM3 (Cereal, Tea, Milk)
- Barcode scanner remains active on product pages for instant navigation
- Invalid products or placeholder (PL0) redirect to home

### Layout Constraints

- **Display aspect ratio**: 19:6 (optimized in `globals.css`)
- **Viewport**: Locked (no zoom, no scroll) for kiosk mode
- **Tile images**: Must be square (~630px) for uniform grid display
- **Product images**: Should match 19:6 aspect ratio for full-screen display
- **Grid positioning**: Right-aligned with precise padding (left: 32px, right: 48px, top/bottom: 48px)

### Image Assets

```
public/
├── home-bg.png                    # 19:6 background with branding
├── back-btn-white.png            # For dark product backgrounds
├── back-btn-black.png            # For light product backgrounds
├── homescr/
│   ├── btn-chips.png             # Solo Crunch (SC7) - 632×632px
│   ├── btn-noodles.png           # Noodles (IV8) - 630×632px
│   ├── btn-cereal.png            # Cereal (VC9) - 632×632px
│   ├── btn-tea.png               # Tea (WT2) - 632×632px
│   ├── btn-milk.png              # Milk (FM3) - 630×632px
│   ├── btn-eyes.png              # Placeholder (PL0) - 630×632px
│   └── signals-room-box.png      # Banner below grid - 1994×362px
└── products/
    ├── SoloCrunch.png            # Full-screen product image
    ├── noodles.png
    ├── VibeCereal.png
    ├── Tea.png
    └── Milk.png
```

## Barcode Mappings (Code 128)

| Code | Product | Tile | Full-Screen | Back Button |
|------|---------|------|-------------|-------------|
| SC7  | Solo Crunch Chips | btn-chips.png | SoloCrunch.png | White |
| IV8  | Instant Viral Noodles | btn-noodles.png | noodles.png | White |
| VC9  | Vibe Ce-real | btn-cereal.png | VibeCereal.png | Black |
| WT2  | Whatever Tea | btn-tea.png | Tea.png | Black |
| FM3  | Filter Milk | btn-milk.png | Milk.png | Black |
| PL0  | Placeholder | btn-eyes.png | _(none)_ | N/A |

## Adding New Products

1. Add square tile image (~630px) to `public/homescr/`
2. Add full-screen product image (19:6 ratio) to `public/products/`
3. Update `lib/products.ts`:
   ```typescript
   XY9: {
     code: "XY9",
     name: "Product Name",
     tileImage: "/homescr/btn-new.png",
     productImage: "/products/NewProduct.png",
   }
   ```
4. Update back button logic in `app/product/[code]/page.tsx` if needed
5. Generate Code 128 barcode label externally with the code (e.g., "XY9")

## USB Scanner Configuration

- **Mode**: Keyboard-wedge (HID) - NOT serial/USB-CDC
- **Symbology**: Code 128
- **Suffix**: Carriage Return (CR/Enter key)
- **Prefix**: None
- Test scanner in text editor before debugging app issues

## Tech Stack Notes

- **Next.js 15** with App Router and Turbopack (faster builds)
- **React 19** with client components (barcode scanning requires browser APIs)
- **Tailwind CSS 4** with inline theme configuration
- **Bun** runtime preferred (fully compatible with Node.js)
- **TypeScript** strict mode enabled
- All pages use `"use client"` directive due to browser event listeners

## Kiosk Deployment

For Raspberry Pi or dedicated kiosk hardware:

```bash
# Install Chromium
sudo pacman -S chromium    # Arch Linux
sudo apt install chromium-browser  # Debian/Ubuntu

# Run in kiosk mode
chromium --kiosk --no-sandbox http://localhost:3000

# Start Next.js app
bun run build && bun start
```

Desktop testing: Run `bun dev` and press **F11** for full-screen.
