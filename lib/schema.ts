import { company } from "./company";
import { products, type Product } from "./products";

const SITE = company.url;

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Organization", "Manufacturer"],
  "@id": `${SITE}#business`,
  name: company.legalName,
  alternateName: company.name,
  description: company.shortDescription,
  url: SITE,
  telephone: company.phoneE164,
  email: company.email,
  priceRange: "₹₹",
  openingHours: company.hoursMachine,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${company.address.line1}, ${company.address.line2}`,
    addressLocality: company.address.locality,
    addressRegion: company.address.region,
    postalCode: company.address.postal,
    addressCountry: company.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: 16.9891, longitude: 82.2475 },
  areaServed: ["IN", "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra"],
  hasMap: company.socials.googleMaps,
  image: `${SITE}/opengraph-image`,
  logo: `${SITE}/favicon.svg`,
  sameAs: [company.socials.googleMaps],
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}#org`,
  name: company.legalName,
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  foundingDate: String(company.founded),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: company.phoneE164,
    contactType: "customer service",
    email: company.email,
    areaServed: "IN",
    availableLanguage: ["en", "hi", "te"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}#website`,
  url: SITE,
  name: company.name,
  publisher: { "@id": `${SITE}#org` },
  inLanguage: "en-IN",
};

export function productSchema(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE}/products/${p.slug}#product`,
    name: p.name,
    description: p.longDesc,
    image: `${SITE}${p.image.src}`,
    brand: { "@type": "Brand", name: company.name },
    category: p.category,
    sku: p.slug,
  };
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What's the minimum order quantity?",
      acceptedAnswer: { "@type": "Answer", text: "Our standard MOQ is 1,000 pieces for stock SKUs and 5,000+ for fully custom prints. We can flex for sample runs." },
    },
    {
      "@type": "Question",
      name: "How long does sampling take?",
      acceptedAnswer: { "@type": "Answer", text: "We send physical samples within 5 working days from approved artwork. Express samples in 48 hours for paid runs." },
    },
    {
      "@type": "Question",
      name: "Do you ship outside Andhra Pradesh?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — pan-India palletised despatch, plus exports on request. We've delivered to 28 states and 4 countries." },
    },
    {
      "@type": "Question",
      name: "Are your bags really food-safe?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Our PP non-woven and laminated jute meet IS-9833 food-contact standards. Documentation available on request." },
    },
    {
      "@type": "Question",
      name: "Can I get a custom print on a small batch?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely — flexo and screen printing both support 1–6 colours with Pantone matching, even on smaller batches." },
    },
  ],
};

export const breadcrumbSchema = (items: { name: string; href: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE}${it.href}`,
  })),
});

export const productListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE}/products/${p.slug}`,
    name: p.name,
  })),
};
