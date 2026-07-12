import { company } from "./company";
import { products, type Product, type Industry } from "./products";
import { contactFaqs, type Faq } from "./faqs";

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
  geo: { "@type": "GeoCoordinates", latitude: 17.0455277, longitude: 82.1207793 },
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

const materialByCategory: Record<Product["category"], string> = {
  "Non-woven": "Polypropylene non-woven fabric",
  Jute: "Natural jute fibre, laminated interior",
  Promotional: "Non-woven, jute, or recycled cotton",
  Shopping: "Reinforced polypropylene non-woven fabric",
  Specialty: "Soft-touch polypropylene non-woven fabric",
  Custom: "Polypropylene non-woven or jute, per specification",
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
    manufacturer: { "@id": `${SITE}#business` },
    countryOfOrigin: { "@type": "Country", name: "India" },
    material: materialByCategory[p.category],
    category: p.category,
    sku: p.slug,
    audience: { "@type": "Audience", audienceType: "Wholesale and B2B buyers" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Specification", value: p.spec },
      ...p.features.map((f) => ({ "@type": "PropertyValue", name: "Feature", value: f })),
    ],
  };
}

export function serviceSchema(industry: Industry) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/industries/${industry.slug}#service`,
    name: `${industry.name} bag manufacturing and wholesale supply`,
    serviceType: `Custom eco bag manufacturing for ${industry.name.toLowerCase()}`,
    description: industry.desc,
    provider: { "@id": `${SITE}#business` },
    areaServed: "IN",
    url: `${SITE}/industries/${industry.slug}`,
  };
}

export function faqPageSchema(faqs: Faq[], id?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(id ? { "@id": id } : {}),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const faqSchema = faqPageSchema(contactFaqs);

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
