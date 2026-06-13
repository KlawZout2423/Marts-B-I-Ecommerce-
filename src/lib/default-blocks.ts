export const DEFAULT_HOME_BLOCKS = [
  {
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
  },
  { 
    id: "hero-default", 
    type: "hero", 
    title: "Hero Section",
    content: {
      pillText: "Introducing the 2026 Collection",
      titlePrefix: "Beyond Premium \n Welcome to",
      titleHighlight: "MARTS",
      subtitle: "Discover items that transcend the ordinary. Clean, modern, and built for professionals who demand the best.",
      mainImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
    }
  },
  { 
    id: "category-tabs-default", 
    type: "categoryHighlights", 
    title: "Category Tabs" 
  },
  { 
    id: "promos-default", 
    type: "promos", 
    title: "Promo Banners",
    content: {
      title1: "Summer Collection",
      subtitle1: "Up to 50% Off",
      title2: "New Arrivals",
      subtitle2: "Shop the latest tech"
    }
  },

  { 
    id: "bestsellers-default", 
    type: "bestsellers", 
    title: "Best Sellers" 
  },
  { 
    id: "new-arrivals-default", 
    type: "newArrivals", 
    title: "New Arrivals" 
  },
  { 
    id: "trust-bar-default", 
    type: "trustBadges", 
    title: "Trust Bar" 
  }
];

export const DEFAULT_ABOUT_BLOCKS = [
  {
    id: "about-hero",
    type: "hero",
    title: "About Hero",
    content: {
      headline: "About MARTS B&I",
      subtext: "Delivering quality products through trusted global sourcing.",
      titleHighlight: "Our Story"
    }
  },
  {
    id: "about-features",
    type: "testimonials",
    title: "Features Section"
  },
  {
    id: "about-trust",
    type: "trustBadges",
    title: "Trust Bar"
  }
];

export const DEFAULT_CONTACT_BLOCKS = [
  {
    id: "contact-hero",
    type: "hero",
    title: "Contact Hero",
    content: {
      headline: "Get in Touch",
      subtext: "Have questions about our global imports? Our dedicated team is here to help.",
      titleHighlight: "Contact Us"
    }
  },
  {
    id: "contact-trust",
    type: "trustBadges",
    title: "Support Info"
  }
];
