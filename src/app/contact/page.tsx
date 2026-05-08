"use client";

import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEditMode } from "@/context/EditModeContext";
import { Mail, Phone, MapPin, Send, Globe, Users, MessagesSquare, Share2 } from "lucide-react";
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

  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* 🦸 Hero */}
      <section className={styles.hero}>
        <div className="container">
          <EditableText {...tProps} tag="h1" id="hero_title" def="Get in Touch" />
          <EditableText {...tProps} id="hero_desc" def="Have questions about our global imports? Our dedicated team is here to help you find exactly what you're looking for." />
        </div>
      </section>

      {/* 📝 Main Layout */}
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* ✍️ Left: Form */}
          <section className={styles.formSection}>
            <EditableText {...tProps} tag="h2" id="form_title" def="Send us a Message" />
            <EditableText {...tProps} className={styles.formSubtitle} id="form_subtitle" def="We usually respond within 24 hours." />
            
            <form 
              className={styles.form} 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  name: formData.get("name"),
                  email: formData.get("email"),
                  message: formData.get("message")
                };

                const { toast } = await import("sonner");
                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });
                  if (res.ok) {
                    toast.success("Message sent! We'll get back to you soon.");
                    (e.target as HTMLFormElement).reset();
                  } else {
                    toast.error("Failed to send message. Please try again.");
                  }
                } catch (err) {
                  toast.error("Something went wrong.");
                }
              }}
            >
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="John Doe" className={styles.input} required />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="name@example.com" className={styles.input} required />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="How can we help you?" className={styles.textarea} required></textarea>
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
              <EditableText {...tProps} tag="h3" id="info_title" def="Contact Information" />
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.iconBox}><Mail size={20} /></div>
                  <div className={styles.infoText}>
                    <h4>Email Us</h4>
                    <p style={{ margin: 0, color: '#475569' }}>{settings.contactEmail || "support@martsbi.com"}</p>
                    <p style={{ margin: 0, color: '#475569' }}>orders@martsbi.com</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.iconBox}><Phone size={20} /></div>
                  <div className={styles.infoText}>
                    <h4>Call Us</h4>
                    <p style={{ margin: 0, color: '#475569' }}>{settings.contactPhone || "+1 (555) 123-4567"}</p>
                    <EditableText {...tProps} id="hours" def="Mon - Fri, 9am - 6pm EST" />
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
