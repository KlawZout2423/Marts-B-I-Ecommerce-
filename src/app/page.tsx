import { Metadata } from "next";
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProductGrid from "@/components/ProductGrid";
import CategoryTabs from "@/components/CategoryTabs";
import PromoBannerCards from "@/components/PromoBannerCards";
import Footer from "@/components/Footer";
import { promoBanners } from "@/data/promoBanners";
import DynamicContent from "@/components/DynamicContent";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "MARTS | Premium Business & Imports",
  description: "Discover our premium selection of imported goods. The Sound of Experience. Global imports delivered locally.",
  openGraph: {
    title: "MARTS | Premium Business & Imports",
    description: "Discover our premium selection of imported goods. Global imports delivered locally.",
    type: "website",
  }
};

import { DEFAULT_HOME_BLOCKS } from "@/lib/default-blocks";

async function getPageContent() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const content = await prisma.pageContent.findUnique({
      where: { route: "/" },
    });
    if (!content) return DEFAULT_HOME_BLOCKS;
    const parsedBlocks = JSON.parse(content.blocks);
    return parsedBlocks.length > 0 ? parsedBlocks : DEFAULT_HOME_BLOCKS;
  } catch (err) {
    console.error("Failed to fetch page content:", err);
    return DEFAULT_HOME_BLOCKS;
  }
}

import { Suspense } from "react";

export default async function Home() {
  const blocks = await getPageContent();

  return (
    <div className={styles.page}>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main>
        <DynamicContent blocks={blocks} />
      </main>
      <Footer />
    </div>
  );
}
