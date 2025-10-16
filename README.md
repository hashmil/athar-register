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

## Docker Deployment

### Build and Push to Registry

The project includes a `build.sh` script for building and pushing to your container registry:

```bash
# Build multi-arch image and push to registry
./build.sh
```

This builds the image as `git.lionx.me/innovation/athar-register:latest` and pushes it to your registry.

### Using Docker Compose (Recommended)

The easiest way to deploy is with Docker Compose:

```bash
# Pull and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Update to latest version
docker-compose pull
docker-compose up -d --force-recreate
```

### Manual Docker Run

Or run the container directly:

```bash
# Pull from registry
docker pull git.lionx.me/innovation/athar-register:latest

# Run container
docker run -d \
  --name athar-kiosk \
  -p 3000:3000 \
  --restart unless-stopped \
  git.lionx.me/innovation/athar-register:latest
```

### Development with Docker

For development with hot reload:

```bash
# Start dev container with volume mounts
docker-compose -f docker-compose.dev.yml up

# Your local code changes will be reflected immediately
```

### Image Details

- **Multi-stage build** with Bun (deps/builder) and Node.js Alpine (runner)
- **Standalone Next.js output** for minimal image size
- **Non-root user** (nextjs:nodejs) for security
- **Health checks** enabled with automatic restart
- **Platform**: linux/amd64

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
├── Dockerfile             # Multi-stage production build
├── Dockerfile.dev         # Development container
├── docker-compose.yml     # Production deployment config
├── docker-compose.dev.yml # Dev deployment with hot reload
├── build.sh               # Build and push to registry script
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

### Raspberry Pi / Kiosk Mode

**Option 1: Using Docker (Recommended)**

1. Install Docker:
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER  # Add user to docker group
```

2. Deploy the app:
```bash
# Pull and run with Docker Compose
docker-compose up -d
```

3. Install Chromium and run in kiosk mode:
```bash
sudo apt install chromium-browser  # Debian/Ubuntu
sudo pacman -S chromium  # Arch Linux

# Start in kiosk mode
chromium --kiosk --no-sandbox http://localhost:3000
```

**Option 2: Native Bun/Node**

1. Install dependencies and build:
```bash
bun install
bun run build
```

2. Run the app:
```bash
bun start
```

3. Start Chromium in kiosk mode (same as above)

### Desktop Testing

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
