// ─────────────────────────────────────────────────────────────────────────────
// Promo Banner Cards Data
// Replace this static export with a fetch() call to your backend API when ready.
// e.g. GET /api/promo-banners  →  PromoBanner[]
// ─────────────────────────────────────────────────────────────────────────────

export interface PromoBanner {
  id: string;
  badge: string;               // e.g. "20% OFF"
  badgeColor: string;          // CSS color for badge background
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
  /** Full URL or a /public path to the card background image */
  imageUrl: string;
  /** Overlay gradient so text stays readable over any image */
  overlayGradient: string;
  /** Text color theme: "light" = white text, "dark" = dark text */
  theme: "light" | "dark";
}

export const promoBanners: PromoBanner[] = [
  {
    id: "promo-formal",
    badge: "20% OFF",
    badgeColor: "#F97316",
    title: "Explore All\nFormal Shoes",
    subtitle: "Timeless elegance, globally sourced",
    ctaText: "Shop Now",
    ctaHref: "/shop?category=formal",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=900",
    overlayGradient:
      "linear-gradient(100deg, rgba(0,29,77,0.92) 40%, rgba(0,29,77,0.3) 100%)",
    theme: "light",
  },
  {
    id: "promo-running",
    badge: "25% OFF",
    badgeColor: "#FACC15",
    title: "Grab The Latest\nRunning Shoes",
    subtitle: "Built for performance, styled to impress",
    ctaText: "Shop Now",
    ctaHref: "/shop?category=running",
    imageUrl:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=900",
    overlayGradient:
      "linear-gradient(100deg, rgba(180,83,9,0.88) 40%, rgba(180,83,9,0.2) 100%)",
    theme: "light",
  },
];
