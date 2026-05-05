"use client";

import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEditMode } from "@/context/EditModeContext";
import { Shield, Globe, Headset, CheckCircle2, Package, Search, Truck, ShoppingBag } from "lucide-react";
import Link from "next/link";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  const { isEditMode, setPageBlocks, setActivePage } = useEditMode();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActivePage("/about");
    fetch("/api/content?route=/about")
      .then(res => res.json())
      .then(data => {
        if (data && data.blocks && Array.isArray(data.blocks)) {
          // Find the static content block
          const staticBlock = data.blocks.find((b: any) => b.type === "static");
          if (staticBlock && staticBlock.content) {
            setContent(staticBlock.content);
          } else {
            setContent({});
          }
        } else {
          setContent({});
        }
        setIsLoading(false);
      });
  }, []);

  // Sync with global save bar
  useEffect(() => {
    if (content) {
      setPageBlocks([{ id: 'static-about', type: 'static', title: 'About Content', content }]);
    }
  }, [content, setPageBlocks]);

  const updateField = (id: string, text: string) => {
    const newContent = { ...content, [id]: text };
    setContent(newContent);
  };

  if (isLoading) return null;

  const t = (id: string, def: string) => content?.[id] || def;

  const EditableText = ({ id, def, className, tag: Tag = "p" }: any) => (
    <Tag 
      className={`${className} ${isEditMode ? styles.editable : ""}`}
      contentEditable={isEditMode}
      suppressContentEditableWarning
      onBlur={(e: any) => updateField(id, e.currentTarget.textContent)}
    >
      {t(id, def)}
    </Tag>
  );

  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* 🦸 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className="container">
          <EditableText tag="h1" id="hero_title" def="About MARTS B&I" />
          <EditableText id="hero_desc" def="Delivering quality products through trusted global sourcing." />
        </div>
      </section>

      {/* 🧩 2. ALTERNATING FEATURE SECTIONS */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featureRow}>
            <div className={styles.featureImage}>
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" alt="Global Sourcing" />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.tag}>Sourcing</span>
              <EditableText tag="h2" id="feat1_title" def="Global Reach, Local Impact" />
              <EditableText id="feat1_desc" def="We traverse the globe to find manufacturers who share our commitment to excellence. By cutting out the middleman, we bring world-class innovation directly to your local market without the premium markup." />
            </div>
          </div>

          <div className={`${styles.featureRow} ${styles.reverse}`}>
            <div className={styles.featureImage}>
              <img src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800" alt="Quality Control" />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.tag}>Verification</span>
              <EditableText tag="h2" id="feat2_title" def="Quality You Can Feel" />
              <EditableText id="feat2_desc" def="Every item in our catalogue goes through a rigorous multi-stage inspection process. From materials testing to final packaging, we ensure that what arrives at your door is nothing short of perfection." />
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 3. WHO YOU ARE */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.textContainer}>
            <div className={styles.identity}>
              <EditableText id="identity_text" def="MARTS B&I is a business focused on sourcing and delivering high-quality imported products for everyday use. We prioritize reliability, affordability, and customer satisfaction. Our mission is to bridge the gap between world-class manufacturing and your doorstep." />
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 3. WHAT YOU DO */}
      <section className={`${styles.section} ${styles.whatWeDo}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What We Do</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.iconWrapper}><Globe size={32} /></div>
              <EditableText tag="h3" id="wd1_title" def="Source Globally" />
              <EditableText id="wd1_desc" def="We scour global markets to find innovative and high-demand products that meet our strict criteria." />
            </div>
            <div className={styles.card}>
              <div className={styles.iconWrapper}><Shield size={32} /></div>
              <EditableText tag="h3" id="wd2_title" def="Ensure Quality" />
              <EditableText id="wd2_desc" def="Every product undergoes a rigorous quality check before it reaches our inventory and your hands." />
            </div>
            <div className={styles.card}>
              <div className={styles.iconWrapper}><Headset size={32} /></div>
              <EditableText tag="h3" id="wd3_title" def="Reliable Service" />
              <EditableText id="wd3_desc" def="Our dedicated support team is always ready to assist you with any inquiries or order updates." />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
