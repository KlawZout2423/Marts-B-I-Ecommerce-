"use client";

import dynamic from "next/dynamic";
import { promoBanners } from "@/data/promoBanners";
import { useEditMode, Block } from "@/context/EditModeContext";
import EditableSection from "./EditableSection";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Hero = dynamic(() => import("./Hero"));
const PromoBannerCards = dynamic(() => import("./PromoBannerCards"));
const ProductGrid = dynamic(() => import("./ProductGrid"));
const CategoryTabs = dynamic(() => import("./CategoryTabs"));
const CategoryGrid = dynamic(() => import("./CategoryGrid"));
const Features = dynamic(() => import("./Features"));
const TrustBar = dynamic(() => import("./TrustBar"));
const MobilePromoBanner = dynamic(() => import("./MobilePromoBanner"));

interface DynamicContentProps {
  blocks: Block[];
}

// Blocks that are hidden on mobile to show products immediately
const MOBILE_HIDDEN_TYPES = new Set(["hero", "promos"]);
// Blocks that are extracted and shown sticky at top on mobile
const MOBILE_STICKY_TYPES = new Set(["categories", "categoryHighlights"]);

function MobileTemuBanner({ products }: { products: any[] }) {
  if (products.length < 2) return null;
  const p1 = products[0];
  const p2 = products[1];

  return (
    <div style={{ padding: "8px 12px 16px" }}>
      {/* Pink Mega Deals Banner */}
      <div style={{
        background: "linear-gradient(135deg, #f5347f 0%, #ff4290 100%)",
        borderRadius: "12px",
        padding: "10px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(245, 52, 127, 0.15)",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Left Side Content */}
        <div style={{ color: "#fff", display: "flex", flexDirection: "column", gap: "2px", zIndex: 2 }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#ffe600", textTransform: "uppercase" }}>
            ★ Mega Shopping Season ★
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: 900, margin: 0, lineHeight: 1.1 }}>
            AMAZING DEALS
          </h3>
          <span style={{ 
            marginTop: "6px",
            background: "#007cff", 
            color: "#ffffff", 
            fontSize: "10px", 
            fontWeight: 800, 
            padding: "3px 10px", 
            borderRadius: "4px",
            width: "fit-content",
            textTransform: "uppercase",
            boxShadow: "0 2px 4px rgba(0, 124, 255, 0.2)"
          }}>
            SHOP NOW ›
          </span>
        </div>

        {/* Right Side Thumbnail Products */}
        <div style={{ display: "flex", gap: "8px", zIndex: 2 }}>
          {[p1, p2].map((p, idx) => (
            <div key={idx} style={{ 
              background: "#fff", 
              borderRadius: "8px", 
              overflow: "hidden", 
              width: "56px", 
              display: "flex", 
              flexDirection: "column",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <img src={p.image} alt={p.name} style={{ width: "100%", height: "42px", objectFit: "cover" }} />
              <div style={{ 
                fontSize: "8.5px", 
                fontWeight: 750, 
                color: "#1a1a1a", 
                textAlign: "center", 
                padding: "2px 0",
                background: "#ffffff"
              }}>
                ${p.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Green Privacy/Trust Banner */}
      <div style={{
        marginTop: "8px",
        background: "#098236",
        borderRadius: "8px",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
        fontSize: "11px",
        fontWeight: 700
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "12px" }}>🛡️</span>
          <span>Why choose MARTS?</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2px", opacity: 0.9 }}>
          <span>Secure privacy</span>
          <span style={{ fontSize: "10px" }}>›</span>
        </div>
      </div>
    </div>
  );
}


export default function DynamicContent({ blocks: initialBlocks }: DynamicContentProps) {
  const { isEditMode, pageBlocks, setPageBlocks, addBlock } = useEditMode();
  const [isInitialized, setIsInitialized] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [stickyTop, setStickyTop] = useState(180);

  const searchParams = useSearchParams();
  const activeFilter = searchParams ? searchParams.get("filter") : null;
  const activeSearch = searchParams ? searchParams.get("search") : null;
  const hasActiveFilter = ((activeFilter && activeFilter.toLowerCase() !== "all") || activeSearch) && !isEditMode;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track actual fixed-header height so sticky chips always sit flush below it
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header') as HTMLElement | null;
      if (header) setStickyTop(header.offsetHeight);
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Initialize context state with the SSR-loaded blocks
  useEffect(() => {
    if (!isInitialized && initialBlocks && initialBlocks.length > 0) {
      const hasMobilePromo = initialBlocks.some(b => b.type === "mobilePromo");
      let blocks = [...initialBlocks];
      if (!hasMobilePromo) {
        blocks.unshift({
          id: "mobile-promo-default",
          type: "mobilePromo",
          title: "Mobile Promo Banner",
          content: {
            badge: "🔥 APP ONLY DEALS",
            title: "Exclusive Mobile Offer",
            subtitle: "Get 15% off all orders with code MOBILE15",
            ctaText: "Shop Sale",
            ctaLink: "/shop?filter=sale",
            bgGradient: "linear-gradient(135deg, #0047AB 0%, #002D62 100%)",
            imageUrl: "",
            theme: "dark"
          }
        });
      }
      setPageBlocks(blocks);
      setIsInitialized(true);
    }
  }, [initialBlocks, isInitialized, setPageBlocks]);

  // Fetch all products once
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setAllProducts(Array.isArray(data) ? data : []);
        setProductsLoading(false);
      })
      .catch(() => setProductsLoading(false));
  }, []);

  const blocksToRender = isInitialized && pageBlocks.length > 0 ? pageBlocks : (initialBlocks || []);

  if (blocksToRender.length === 0) return null;

  // ── Filtered / Search view (active category or search query) ──────────────
  // Map chip names that filter by product "tag" field instead of "category"
  const TAG_FILTER_MAP: Record<string, string> = {
    "new arrivals": "new",
    "sale": "hot_sale",
    "bestsellers": "bestseller",
    "featured": "featured",
  };

  // Filter products based on active filter or search
  let filteredProducts = allProducts;
  let feedTitle = "Explore All Products";
  let emptyMsg = undefined;

  if (hasActiveFilter) {
    const filterLower = activeFilter?.toLowerCase() ?? "";
    const mappedTag = TAG_FILTER_MAP[filterLower];

    if (activeFilter && filterLower !== "all") {
      if (mappedTag) {
        filteredProducts = filteredProducts.filter(
          p => p.tags && (
            Array.isArray(p.tags)
              ? p.tags.map((t: string) => t.toLowerCase()).includes(mappedTag)
              : String(p.tags).toLowerCase() === mappedTag
          )
        );
      } else {
        filteredProducts = filteredProducts.filter(
          p => p.category && p.category.toLowerCase() === filterLower
        );
      }
    }
    if (activeSearch) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(activeSearch.toLowerCase()))
      );
    }

    feedTitle = activeSearch
      ? `Search results for "${activeSearch}"`
      : `${activeFilter} Products`;
    
    emptyMsg = activeSearch
      ? `No products matched your search for "${activeSearch}".`
      : `No products found in "${activeFilter}".`;
  }

  // ── Unified Desktop/Mobile layout ────────────────────────────
  const categoryBlock = blocksToRender.find(b => MOBILE_STICKY_TYPES.has(b.type));

  return (
    <>
      {/* Sticky category tabs at top - ONLY ON MOBILE */}
      {isMobile && (
        <div style={{
          position: "sticky",
          top: `${stickyTop}px`,
          zIndex: 150,
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}>
          {categoryBlock ? (
            <CategoryTabs id={categoryBlock.id} content={categoryBlock.content} />
          ) : (
            <CategoryTabs />
          )}
        </div>
      )}

      {/* Render blocks */}
      {!hasActiveFilter && blocksToRender.map((block, index) => {
        // On mobile, hide Hero, Promos, and the original CategoryTabs (since we made it sticky above)
        if (isMobile && MOBILE_HIDDEN_TYPES.has(block.type)) return null;
        if (isMobile && MOBILE_STICKY_TYPES.has(block.type)) return null;

        let content = null;
        switch (block.type) {
          case "mobilePromo":
            content = <MobilePromoBanner key={`content-${block.id}`} id={block.id} content={block.content || {}} />;
            break;
          case "hero":
            content = <Hero key={`content-${block.id}`} id={block.id} content={block.content || {}} />;
            break;
          case "promos":
            const promoBannersOverride = block.content ? [
              { ...promoBanners[0], title: block.content.title1 || promoBanners[0].title, subtitle: block.content.subtitle1 || promoBanners[0].subtitle, imageUrl: block.content.image1 || promoBanners[0].imageUrl },
              { ...promoBanners[1], title: block.content.title2 || promoBanners[1].title, subtitle: block.content.subtitle2 || promoBanners[1].subtitle, imageUrl: block.content.image2 || promoBanners[1].imageUrl }
            ] : promoBanners;
            content = <PromoBannerCards key={`content-${block.id}`} id={block.id} banners={promoBannersOverride} />;
            break;
          case "bestsellers":
            content = <ProductGrid key={`content-${block.id}`} title="Best Sellers" filterTag="bestseller" limit={8} isCarouselOnMobile={false} rows={2} products={allProducts} isLoading={productsLoading} />;
            break;
          case "featuredProducts":
            content = <ProductGrid key={`content-${block.id}`} title="Featured Products" filterTag="featured" limit={8} isCarouselOnMobile={false} rows={2} products={allProducts} isLoading={productsLoading} />;
            break;
          case "newArrivals":
            content = <ProductGrid key={`content-${block.id}`} title="New Arrivals" filterTag="new" limit={8} isCarouselOnMobile={false} rows={2} products={allProducts} isLoading={productsLoading} />;
            break;
          case "hotSale":
            content = <ProductGrid key={`content-${block.id}`} title="Hot Sale 🔥" filterTag="hot_sale" limit={8} isCarouselOnMobile={false} rows={2} products={allProducts} isLoading={productsLoading} />;
            break;
          case "categoryHighlights":
          case "categories":
            content = <CategoryTabs key={`content-${block.id}`} id={block.id} content={block.content} />;
            break;
          case "categoryGrid":
            content = <CategoryGrid key={`content-${block.id}`} />;
            break;
          case "testimonials":
            content = <Features key={`content-${block.id}`} />;
            break;
          case "trustBadges":
            content = <TrustBar key={`content-${block.id}`} />;
            break;
          default:
            content = <div key={`content-${block.id}`} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Block: {block.title}</div>;
        }

        return (
          <EditableSection key={block.id} id={block.id} index={index} totalBlocks={blocksToRender.length}>
            {content}
          </EditableSection>
        );
      })}

      {/* When filtering on Desktop, we still want Hero, Promos, and CategoryTabs, but we hide the rest of the landing page to show the filtered grid */}
      {hasActiveFilter && !isMobile && blocksToRender.map((block, index) => {
        // Only keep Hero, Promos, and Category Tabs when a filter is active
        if (!MOBILE_HIDDEN_TYPES.has(block.type) && !MOBILE_STICKY_TYPES.has(block.type)) return null;

        let content = null;
        switch (block.type) {
          case "hero":
            content = <Hero key={`content-${block.id}`} id={block.id} content={block.content || {}} />;
            break;
          case "promos":
            const promoBannersOverride = block.content ? [
              { ...promoBanners[0], title: block.content.title1 || promoBanners[0].title, subtitle: block.content.subtitle1 || promoBanners[0].subtitle, imageUrl: block.content.image1 || promoBanners[0].imageUrl },
              { ...promoBanners[1], title: block.content.title2 || promoBanners[1].title, subtitle: block.content.subtitle2 || promoBanners[1].subtitle, imageUrl: block.content.image2 || promoBanners[1].imageUrl }
            ] : promoBanners;
            content = <PromoBannerCards key={`content-${block.id}`} id={block.id} banners={promoBannersOverride} />;
            break;
          case "categoryHighlights":
          case "categories":
            content = <CategoryTabs key={`content-${block.id}`} id={block.id} content={block.content} />;
            break;
          default:
            return null;
        }

        return (
          <EditableSection key={block.id} id={block.id} index={index} totalBlocks={blocksToRender.length}>
            {content}
          </EditableSection>
        );
      })}

      {/* Full catalog feed or Filtered Feed at the bottom */}
      {(!isEditMode || hasActiveFilter) && (isMobile || hasActiveFilter) && (
        <div style={{ padding: "0 12px 40px" }}>
          <ProductGrid
            title={feedTitle}
            products={filteredProducts}
            isLoading={productsLoading}
            isCarouselOnMobile={false}
            emptyMessage={emptyMsg}
          />
        </div>
      )}

      {isEditMode && (
        <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => {
              const newType = prompt("Enter section type (e.g., promos, newArrivals, testimonials):", "newArrivals");
              if (newType) addBlock(newType, `New ${newType} Section`);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              border: '2px dashed #94a3b8',
              borderRadius: '12px',
              background: 'transparent',
              color: '#64748b',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0ea5e9';
              e.currentTarget.style.color = '#0ea5e9';
              e.currentTarget.style.background = '#f0f9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Plus size={20} /> Add New Section
          </button>
        </div>
      )}
    </>
  );
}
