"use client";

import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEditMode } from "@/context/EditModeContext";
import { Shield, Globe, Headset, CheckCircle2, Package, Search, Truck, ShoppingBag, MapPin, Compass, Award, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./AboutPage.module.css";

import { EditableText } from "@/components/EditableText";

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
  }, [setActivePage]);

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

  const tProps = { content, updateField, isEditMode, styles };

  const hubs = [
    {
      name: "Kenji T.",
      location: "Tokyo, Japan",
      role: "Consumer Goods & Tech Scout",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      status: "Active scouting in Akihabara",
      verified: "Electronics, Toys & Office Tech"
    },
    {
      name: "Sofia R.",
      location: "Milan, Italy",
      role: "Textiles & Lifestyle Buyer",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      status: "Reviewing autumn fabrics",
      verified: "Fashion, Accessories & Footwear"
    },
    {
      name: "Lukas M.",
      location: "Munich, Germany",
      role: "Hardware & Tooling Lead",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      status: "Completing laboratory batch test",
      verified: "Home Utilities & Precision Tools"
    },
    {
      name: "Lin Y.",
      location: "Shenzhen, China",
      role: "Supply Chain & Logistics Director",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      status: "Dispatching container line B-4",
      verified: "Smart Devices & Fast Fashion"
    }
  ];

  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* 🦸 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.glow1} />
          <div className={styles.glow2} />
        </div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <EditableText {...tProps} tag="h1" id="hero_title" def="About MARTS B&I" />
            <EditableText {...tProps} id="hero_desc" def="Delivering quality products through trusted global sourcing." />
          </motion.div>
        </div>
      </section>

      {/* 🧩 2. INTERACTIVE GLOBAL SOURCING HUBS */}
      <section className={styles.hubsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Network</span>
            <h2>Our Sourcing Agents</h2>
            <p>Real-time scouting, bargaining, and quality checks at core global manufacturing centers.</p>
          </div>

          <div className={styles.hubsGrid}>
            {hubs.map((hub, idx) => (
              <motion.div
                key={hub.name}
                className={styles.hubCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.agentImageContainer}>
                  <img src={hub.img} alt={hub.name} className={styles.agentImg} />
                  <div className={styles.agentLocationOverlay}>
                    <MapPin size={14} />
                    <span>{hub.location}</span>
                  </div>
                </div>
                <div className={styles.agentDetails}>
                  <h3>{hub.name}</h3>
                  <span className={styles.agentRole}>{hub.role}</span>
                  <div className={styles.agentStatus}>
                    <span className={styles.pulseDot} />
                    <span className={styles.statusText}>Current task: {hub.status}</span>
                  </div>
                  <div className={styles.agentScope}>
                    <strong>Core Sourcing:</strong>
                    <p>{hub.verified}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧩 3. INSPECTION TIMELINE */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.timelineHeader}>
            <span className={styles.tag}>Process</span>
            <h2>How We Verify Quality</h2>
            <p>Our direct pipeline cuts middleman markups while keeping testing strict.</p>
          </div>

          <div className={styles.timeline}>
            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineIcon}><Compass size={24} /></div>
              <div className={styles.timelineContent}>
                <span className={styles.stepNum}>STEP 01</span>
                <EditableText {...tProps} tag="h3" id="feat1_title" def="Global Sourcing & Scrape" />
                <EditableText {...tProps} id="feat1_desc" def="We traverse the globe to find manufacturers who share our commitment to excellence. By cutting out the middleman, we bring world-class innovation directly to your local market without the premium markup." />
              </div>
            </motion.div>

            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineIcon}><Shield size={24} /></div>
              <div className={styles.timelineContent}>
                <span className={styles.stepNum}>STEP 02</span>
                <EditableText {...tProps} tag="h3" id="feat2_title" def="Multi-Stage Verification" />
                <EditableText {...tProps} id="feat2_desc" def="Every item in our catalogue goes through a rigorous multi-stage inspection process. From materials testing to final packaging, we ensure that what arrives at your door is nothing short of perfection." />
              </div>
            </motion.div>

            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineIcon}><Award size={24} /></div>
              <div className={styles.timelineContent}>
                <span className={styles.stepNum}>STEP 03</span>
                <h3>Direct Import Dispatch</h3>
                <p>Goods are batched and directly dispatched to local warehouse hubs. There are no retail distribution markups, giving you premium items at base import pricing.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🧩 4. WHO YOU ARE */}
      <section className={styles.identitySection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.identityCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.identityIcon}><Users size={32} /></div>
            <h2>Our Core Mission</h2>
            <div className={styles.identityText}>
              <EditableText {...tProps} id="identity_text" def="MARTS B&I is a business focused on sourcing and delivering high-quality imported products for everyday use. We prioritize reliability, affordability, and customer satisfaction. Our mission is to bridge the gap between world-class manufacturing and your doorstep." />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌍 5. WHAT WE DO */}
      <section className={styles.whatWeDoSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What We Do</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.iconWrapper}><Globe size={32} /></div>
              <EditableText {...tProps} tag="h3" id="wd1_title" def="Source Globally" />
              <EditableText {...tProps} id="wd1_desc" def="We scour global markets to find innovative and high-demand products that meet our strict criteria." />
            </div>
            <div className={styles.card}>
              <div className={styles.iconWrapper}><Shield size={32} /></div>
              <EditableText {...tProps} tag="h3" id="wd2_title" def="Ensure Quality" />
              <EditableText {...tProps} id="wd2_desc" def="Every product undergoes a rigorous quality check before it reaches our inventory and your hands." />
            </div>
            <div className={styles.card}>
              <div className={styles.iconWrapper}><Headset size={32} /></div>
              <EditableText {...tProps} tag="h3" id="wd3_title" def="Reliable Service" />
              <EditableText {...tProps} id="wd3_desc" def="Our dedicated support team is always ready to assist you with any inquiries or order updates." />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
