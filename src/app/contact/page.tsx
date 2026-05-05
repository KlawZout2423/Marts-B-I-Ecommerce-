"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEditMode } from "@/context/EditModeContext";
import { Mail, Phone, MapPin, Send, Globe, Users, MessagesSquare, Share2 } from "lucide-react";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  const { isEditMode, setPageBlocks, setActivePage } = useEditMode();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActivePage("/contact");
    fetch("/api/content?route=/contact")
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
      setPageBlocks([{ id: 'static-contact', type: 'static', title: 'Contact Content', content }]);
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
      <Navbar />

      {/* 🦸 Hero */}
      <section className={styles.hero}>
        <div className="container">
          <EditableText tag="h1" id="hero_title" def="Get in Touch" />
          <EditableText id="hero_desc" def="Have questions about our global imports? Our dedicated team is here to help you find exactly what you're looking for." />
        </div>
      </section>

      {/* 📝 Main Layout */}
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* ✍️ Left: Form */}
          <section className={styles.formSection}>
            <EditableText tag="h2" id="form_title" def="Send us a Message" />
            <EditableText className={styles.formSubtitle} id="form_subtitle" def="We usually respond within 24 hours." />
            
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" className={styles.input} required />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="name@example.com" className={styles.input} required />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="How can we help you?" className={styles.textarea} required></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <Send size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Send Message
              </button>
            </form>
          </section>

          {/* 📞 Right: Info */}
          <aside className={styles.infoSection}>
            <div className={styles.infoBlock}>
              <EditableText tag="h3" id="info_title" def="Contact Information" />
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.iconBox}><Mail size={20} /></div>
                  <div className={styles.infoText}>
                    <h4>Email Us</h4>
                    <EditableText id="email1" def="support@martsbi.com" />
                    <EditableText id="email2" def="orders@martsbi.com" />
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.iconBox}><Phone size={20} /></div>
                  <div className={styles.infoText}>
                    <h4>Call Us</h4>
                    <EditableText id="phone" def="+1 (555) 123-4567" />
                    <EditableText id="hours" def="Mon - Fri, 9am - 6pm EST" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
