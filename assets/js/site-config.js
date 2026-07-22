/** Apex K9 — single place to edit brand, nav, API */
window.APEX_SITE = {
  brand: "JONNYDREAMWALKER",
  tagline: "APEX K9 SUPPLY",
  trustBar: "Premium K9 gear • Training tools • Comfort. Florida warehouse. Fast ship FL-TX-CA.",
  cartKey: "jdw_k9_cart",
  apiBase: "https://api.jdwapexherp.com", // swap to K9 FreePort port/host when ready
  paypalBusiness: "jonnydreamwalker@gmail.com",
  categories: [
    { href: "services/food.html", label: "Food & Treats", dataCategory: "Food" },
    { href: "services/gear.html", label: "Gear & Collars", dataCategory: "Gear" },
    { href: "services/training.html", label: "Training", dataCategory: "Training" },
    { href: "services/beds.html", label: "Beds & Comfort", dataCategory: "Beds" },
    { href: "services/health.html", label: "Health", dataCategory: "Health" },
    { href: "services/apparel.html", label: "Apparel", dataCategory: "Apparel" },
    { href: "services/deals.html", label: "Deals", dataCategory: "Deals", accent: true }
  ],
  pillars: [
    { title: "Food & Treats", blurb: "Performance nutrition and training rewards.", href: "services/food.html" },
    { title: "Gear & Collars", blurb: "Collars, leads, harnesses built to work.", href: "services/gear.html" },
    { title: "Training", blurb: "Tools for disciplined K9 work and sport.", href: "services/training.html" },
    { title: "Beds & Comfort", blurb: "Recovery and rest gear.", href: "services/beds.html" },
    { title: "Health", blurb: "Supplements and care essentials.", href: "services/health.html" },
    { title: "Apparel", blurb: "Veteran-owned K9 crew gear.", href: "services/apparel.html" }
  ]
};
window.APEX_API_BASE = window.APEX_SITE.apiBase;
