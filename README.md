# Athar Register - Barcode Scanner Kiosk

A full-screen kiosk web app for product browsing with USB barcode scanner support. Designed for **19:6 aspect ratio** displays, optimized for Raspberry Pi or desktop deployments.

## Features

- **USB Barcode Scanner Integration** - Keyboard-wedge mode with automatic scan detection
- **Full-Screen Kiosk Mode** - Optimized for 19:6 displays with no distractions
- **Product Catalog** - 5 products + 1 placeholder tile with custom branding
- **Global Scanning** - Scan barcodes from any screen to navigate instantly
- **Interactive Tiles** - Click or scan to view full-screen product details
- **Smart Navigation** - Back button and invalid barcode handling with toast notifications

## Barcode Mappings (Code 128)

| Product | Barcode | Tile Image | Product Image |
|---------|---------|------------|---------------|
| Solo Crunch Chips | `SC7` | btn-chips.png | SoloCrunch.png |
| Instant Viral Noodles | `IV8` | btn-noodles.png | noodles.png |
| Vibe Ce-real | `VC9` | btn-cereal.png | VibeCereal.png |
| Whatever Tea | `WT2` | btn-tea.png | Tea.png |
| Filter Milk | `FM3` | btn-milk.png | Milk.png |
| Placeholder | `PL0` | btn-eyes.png | _(no product page)_ |

## Tech Stack

- **Next.js 15** - React 19, App Router, Turbopack
- **Tailwind CSS 4** - Responsive styling
- **TypeScript** - Type-safe development
- **Bun** - Fast JavaScript runtime (compatible with Node.js)

## Setup

### Prerequisites

- **Bun** (recommended) or Node.js 18+
- USB barcode scanner configured in keyboard-wedge mode (HID)
- Display with 19:6 aspect ratio (or adjust CSS for your screen)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd athar-register

# Install dependencies
bun install
```

## Development

```bash
# Run development server with hot reload
bun dev

# Or with npm/yarn/pnpm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will auto-reload when you edit files.

## Production

```bash
# Build for production
bun run build

# Start production server
bun start
```

## Barcode Scanner Setup

Your USB barcode scanner should be configured as:
- **Mode**: Keyboard-wedge (HID)
- **Symbology**: Code 128
- **Suffix**: Carriage Return (Enter key)

The app automatically detects scans using:
- **300ms debounce** - Groups rapid keystrokes as a single scan
- **Enter key terminator** - Completes scan immediately when Enter is pressed
- **Global capture** - Works from any screen or focus state

## Project Structure

```
athar-register/
├── app/
│   ├── product/[code]/     # Dynamic product pages
│   │   └── page.tsx
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home screen with 6-tile grid
│   └── globals.css         # Global styles and animations
├── hooks/
│   └── useBarcodeScanner.ts  # Barcode scanner hook
├── lib/
│   └── products.ts         # Product configuration & mappings
├── public/
│   ├── homescr/           # Tile button images (6 tiles)
│   ├── products/          # Full-screen product images (5 products)
│   ├── home-bg.png        # Home background (19:6)
│   └── back-btn-white.png # Back button icon
└── README.md
```

## Usage

### Home Screen
- Displays 6 product tiles in a 3×2 grid
- Scan any product barcode or click a tile to view details
- Invalid scans show a toast notification for 2 seconds

### Product Page
- Shows full-screen product image (19:6 aspect ratio)
- Back button in top-left returns to home
- Scan another barcode to switch products instantly

### Customization

**Add New Products**: Edit `/lib/products.ts`
```typescript
export const PRODUCTS: Record<string, Product> = {
  XY9: {
    code: "XY9",
    name: "New Product",
    tileImage: "/homescr/btn-new.png",
    productImage: "/products/NewProduct.png",
  },
  // ...
};
```

**Change Barcode Timeout**: Edit `/hooks/useBarcodeScanner.ts`
```typescript
const SCAN_TIMEOUT = 300; // milliseconds
```

**Adjust Aspect Ratio**: Edit `/app/globals.css`
```css
@media (aspect-ratio: 19/6) {
  /* Your custom styles */
}
```

## Deployment

### Raspberry Pi (Kiosk Mode)

1. Install Chromium in kiosk mode:
```bash
sudo pacman -S chromium  # Arch Linux
sudo apt install chromium-browser  # Debian/Ubuntu
```

2. Auto-start on boot (create systemd service or use autostart):
```bash
chromium --kiosk --no-sandbox http://localhost:3000
```

3. Run the Next.js app:
```bash
bun run build && bun start
```

### Desktop

Simply run `bun dev` and open the browser in full-screen mode (F11).

## Troubleshooting

**Scanner not working?**
- Check scanner is in keyboard-wedge mode (not serial/USB-CDC)
- Verify suffix is set to "Enter" or "CR"
- Test scanning in a text editor first

**Wrong aspect ratio?**
- Update CSS media queries in `globals.css`
- Adjust grid layout in `app/page.tsx`

**Navigation issues?**
- Clear browser cache and reload
- Check barcode format matches Code 128
- Ensure codes are uppercase in `products.ts`

## License

Private project - All rights reserved.
