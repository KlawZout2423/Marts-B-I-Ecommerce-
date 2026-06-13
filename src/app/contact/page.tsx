"use client";

import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEditMode } from "@/context/EditModeContext";
import { Mail, Phone, MapPin, Send, Globe, Users, MessagesSquare, Share2, ChevronDown, HelpCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ContactPage.module.css";

import { EditableText } from "@/components/EditableText";

import { useStore } from "@/context/StoreContext";

export default function ContactPage() {
  const { isEditMode, setPageBlocks, setActivePage } = useEditMode();
  const { settings } = useStore();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActivePage("/contact");
    fetch("/api/content?route=/contact")
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
      setPageBlocks([{ id: 'static-contact', type: 'static', title: 'Contact Content', content }]);
    }
  }, [content, setPageBlocks]);

  const updateField = (id: string, text: string) => {
    const newContent = { ...content, [id]: text };
    setContent(newContent);
  };

  if (isLoading) return null;

  const tProps = { content, updateField, isEditMode, styles };

  const [inquiryType, setInquiryType] = useState<'support' | 'sourcing' | 'partnership'>('support');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I request custom product sourcing?",
      a: "Simply choose the 'Custom Sourcing' tab above and describe the product, brand, target manufacturer region, and estimated quantity. Our global scouting hubs (Tokyo, Milan, Munich, Shenzhen) will identify suppliers and provide quotation estimates within 3-5 business days."
    },
    {
      q: "Where do you import products from?",
      a: "We import directly from key international centers. This includes premium consumer tech from Tokyo, textiles/lifestyle apparel from Milan, hardware/utilities from Munich, and electronic accessories from Shenzhen. Every item is verified at the source."
    },
    {
      q: "What is your return policy on premium imports?",
      a: "We offer a 30-day hassle-free return policy. If your item arrives damaged, is not as described, or has functional defects, we will provide a full refund or direct replacement shipping free of charge."
    },
    {
      q: "How long does global shipping take?",
      a: "Express importing takes approximately 5-9 business days, depending on custom clears. Domestic warehousing dispatch is done within 24 hours of arrival. You will receive real-time SMS and email tracking links."
    }
  ];

  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* 🦸 Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EditableText {...tProps} tag="h1" id="hero_title" def="Inquiry & Sourcing Center" />
            <EditableText {...tProps} id="hero_desc" def="Select your query category below to contact our sourcing hubs or track an existing premium order." />
          </motion.div>
        </div>
      </section>

      {/* 📝 Main Layout */}
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* ✍️ Left: Form */}
          <section className={styles.formSection}>
            <div className={styles.inquiryTabs}>
              <button 
                type="button"
                className={`${styles.tabBtn} ${inquiryType === 'support' ? styles.tabBtnActive : ''}`}
                onClick={() => setInquiryType('support')}
              >
                Order Support
              </button>
              <button 
                type="button"
                className={`${styles.tabBtn} ${inquiryType === 'sourcing' ? styles.tabBtnActive : ''}`}
                onClick={() => setInquiryType('sourcing')}
              >
                Custom Sourcing
              </button>
              <button 
                type="button"
                className={`${styles.tabBtn} ${inquiryType === 'partnership' ? styles.tabBtnActive : ''}`}
                onClick={() => setInquiryType('partnership')}
              >
                Partnerships
              </button>
            </div>

            <form 
              className={styles.form} 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  name: formData.get("name"),
                  email: formData.get("email"),
                  type: inquiryType,
                  message: formData.get("message"),
                  orderNumber: formData.get("orderNumber"),
                  sourcingRegion: formData.get("sourcingRegion"),
                  companyName: formData.get("companyName")
                };

                const { toast } = await import("sonner");
                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });
                  if (res.ok) {
                    toast.success("Inquiry received! Sourcing staff will update you shortly.");
                    (e.target as HTMLFormElement).reset();
                  } else {
                    toast.error("Failed to send message. Please check input requirements.");
                  }
                } catch (err) {
                  toast.error("Something went wrong. Connect with our back-up support directly.");
                }
              }}
            >
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" placeholder="John Doe" className={styles.input} required />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" placeholder="name@example.com" className={styles.input} required />
                </div>
              </div>

              {/* Dynamic inputs based on inquiryType */}
              <AnimatePresence mode="wait">
                {inquiryType === 'support' && (
                  <motion.div 
                    key="support"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={styles.inputGroup}
                  >
                    <label htmlFor="orderNumber">Order Number (Optional)</label>
                    <input type="text" id="orderNumber" name="orderNumber" placeholder="#MRT-10023" className={styles.input} />
                  </motion.div>
                )}

                {inquiryType === 'sourcing' && (
                  <motion.div 
                    key="sourcing"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={styles.formRow}
                  >
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <label htmlFor="sourcingRegion">Scouting Target Region</label>
                      <input type="text" id="sourcingRegion" name="sourcingRegion" placeholder="e.g. Tokyo / Akihabara" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <label htmlFor="qty">Estimated Quantity Needed</label>
                      <input type="number" id="qty" name="qty" placeholder="10" className={styles.input} min="1" />
                    </div>
                  </motion.div>
                )}

                {inquiryType === 'partnership' && (
                  <motion.div 
                    key="partnership"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={styles.inputGroup}
                  >
                    <label htmlFor="companyName">Company / Brand Name</label>
                    <input type="text" id="companyName" name="companyName" placeholder="e.g. Acme Imports Ltd." className={styles.input} required />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.inputGroup}>
                <label htmlFor="message">
                  {inquiryType === 'sourcing' ? 'Custom Sourcing Requirements' : 'Message'}
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  placeholder={
                    inquiryType === 'sourcing' 
                      ? 'Describe item details, materials, target pricing budget...' 
                      : 'How can our global offices assist you today?'
                  }
                  className={styles.textarea} 
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <Send size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Submit Sourcing Request
              </button>
            </form>
          </section>

          {/* 📞 Right: Info */}
          <aside className={styles.infoSection}>
            <div className={styles.infoBlock}>
              <EditableText {...tProps} tag="h3" id="info_title" def="Global Hub Access" />
              <p className={styles.infoTextParagraph}>Direct lines to our central logistics and customer service coordinators.</p>
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.iconBox}><Mail size={20} /></div>
                  <div className={styles.infoText}>
                    <h4>Email Support</h4>
                    <p style={{ margin: 0, color: '#475569', fontWeight: 600 }}>{settings.contactEmail || "support@martsbi.com"}</p>
                    <p style={{ margin: 0, color: '#94a3b8' }}>Global Drops: sourcing@martsbi.com</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.iconBox}><Phone size={20} /></div>
                  <div className={styles.infoText}>
                    <h4>Direct Operations Line</h4>
                    <p style={{ margin: 0, color: '#475569', fontWeight: 600 }}>{settings.contactPhone || "+1 (555) 123-4567"}</p>
                    <EditableText {...tProps} id="hours" def="Mon - Fri, 9am - 6pm EST" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 🧩 FAQs Section */}
      <section className={styles.faqsSection}>
        <div className="container">
          <div className={styles.faqsHeader}>
            <span className={styles.tag}>Help Desk</span>
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to our global sourcing policies, returns, and order deliveries.</p>
          </div>

          <div className={styles.faqsGrid}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ''}`}>
                  <button 
                    className={styles.faqQuestionBtn} 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span className={styles.faqQuestionText}>
                      <HelpCircle size={18} className={styles.faqHelpIcon} />
                      {faq.q}
                    </span>
                    <ChevronDown size={18} className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotate : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className={styles.faqAnswerWrapper}
                      >
                        <div className={styles.faqAnswerContent}>
                          <p>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
