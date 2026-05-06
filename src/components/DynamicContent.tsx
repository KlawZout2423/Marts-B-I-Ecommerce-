"use client";

import dynamic from "next/dynamic";
import { promoBanners } from "@/data/promoBanners";
import { useEditMode, Block } from "@/context/EditModeContext";
import EditableSection from "./EditableSection";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = dynamic(() => import("./Hero"));
const PromoBannerCards = dynamic(() => import("./PromoBannerCards"));
const ProductGrid = dynamic(() => import("./ProductGrid"));
const CategoryTabs = dynamic(() => import("./CategoryTabs"));
const CategoryGrid = dynamic(() => import("./CategoryGrid"));
const Features = dynamic(() => import("./Features"));
const TrustBar = dynamic(() => import("./TrustBar"));

// Using Block from EditModeContext

interface DynamicContentProps {
  blocks: Block[];
}

export default function DynamicContent({ blocks: initialBlocks }: DynamicContentProps) {
  const { isEditMode, pageBlocks, setPageBlocks, addBlock } = useEditMode();
  const [isInitialized, setIsInitialized] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Initialize context state with the SSR-loaded blocks
  useEffect(() => {
    if (!isInitialized && initialBlocks && initialBlocks.length > 0) {
      setPageBlocks(initialBlocks);
      setIsInitialized(true);
    }
  }, [initialBlocks, isInitialized, setPageBlocks]);

  // Performance Optimization: Fetch all products once for all grids
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setAllProducts(Array.isArray(data) ? data : []);
        setProductsLoading(false);
      })
      .catch(() => setProductsLoading(false));
  }, []);

  // Use state blocks if initialized, otherwise fallback to props to prevent hydration mismatch
  const blocksToRender = isInitialized && pageBlocks.length > 0 ? pageBlocks : (initialBlocks || []);

  if (blocksToRender.length === 0) return null;

  return (
    <>
      {blocksToRender.map((block, index) => {
        let content = null;
        switch (block.type) {
          case "hero":
            content = <Hero key={`content-${block.id}`} id={block.id} content={block.content || {}} />;
            break;
          case "promos":
            const promoBannersOverride = block.content ? [
              { ...promoBanners[0], title: block.content.title1 || promoBanners[0].title, subtitle: block.content.subtitle1 || promoBanners[0].subtitle },
              { ...promoBanners[1], title: block.content.title2 || promoBanners[1].title, subtitle: block.content.subtitle2 || promoBanners[1].subtitle }
            ] : promoBanners;
            content = <PromoBannerCards key={`content-${block.id}`} id={block.id} banners={promoBannersOverride} />;
            break;
          case "bestsellers":
            content = <ProductGrid key={`content-${block.id}`} title="Best Sellers" filterTag="bestseller" limit={4} isCarouselOnMobile={true} products={allProducts.filter(p => p.placements?.includes('bestseller'))} isLoading={productsLoading} />;
            break;
          case "featuredProducts":
            content = <ProductGrid key={`content-${block.id}`} title="Featured Products" filterTag="featured" limit={4} isCarouselOnMobile={true} products={allProducts.filter(p => p.placements?.includes('featured'))} isLoading={productsLoading} />;
            break;
          case "newArrivals":
            content = <ProductGrid key={`content-${block.id}`} title="New Arrivals" filterTag="new" limit={4} isCarouselOnMobile={true} products={allProducts.filter(p => p.placements?.includes('new'))} isLoading={productsLoading} />;
            break;
          case "hotSale":
            content = <ProductGrid key={`content-${block.id}`} title="Hot Sale 🔥" filterTag="hot_sale" limit={4} isCarouselOnMobile={true} products={allProducts.filter(p => p.placements?.includes('hot_sale'))} isLoading={productsLoading} />;
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

      {isEditMode && (
        <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => {
              // Simple generic add for demonstration
              const newType = prompt("Enter section type (e.g., promos, newArrivals, testimonials):", "newArrivals");
              if (newType) {
                addBlock(newType, `New ${newType} Section`);
              }
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
