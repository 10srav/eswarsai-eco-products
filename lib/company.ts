export const company = {
  name: "Eswar Sai Eco Products",
  legalName: "Eswarsai Eco Products",
  tagline: "Replace plastic. Carry a future worth saving.",
  shortDescription:
    "Premium non-woven and jute bag manufacturer in Andhra Pradesh. Sustainable, custom-printed eco-friendly bags for businesses that care about the planet.",
  longDescription:
    "We are pioneers in manufacturing eco-friendly non-woven and jute bags, dedicated to providing customized and durable solutions that cater to your unique packaging needs while supporting environmental sustainability.",
  founded: 2013,
  url: "https://eswarsaiecoproducts.com",
  phone: "+91 91210 53678",
  phoneE164: "+919121053678",
  whatsappNumber: "919121053678",
  email: "hello@eswarsaiecoproducts.com",
  address: {
    line1: "#10-334, Flat No. 40",
    line2: "APIIC Colony, Rayudupalem, Ramanayyapeta",
    locality: "Kakinada",
    region: "Andhra Pradesh",
    postal: "533005",
    country: "IN",
    countryName: "India",
  },
  hours: "Mon–Sat, 9:00 – 18:30 IST",
  hoursMachine: "Mo-Sa 09:00-18:30",
  socials: {
    googleMaps: "https://share.google/LaAX1XAzkS1pOvkae",
  },
  stats: [
    { value: 12, suffix: "yrs", label: "In manufacturing" },
    { value: 500, suffix: "+", label: "Brand partners" },
    { value: 40, suffix: "M+", label: "Bags produced" },
    { value: 100, suffix: "%", label: "Reusable & recyclable" },
  ],
  impact: [
    { value: 40, unit: "M+", suffix: " bags", label: "Bags shipped", sub: "Across India and exported — replacing single-use plastic, one order at a time." },
    { value: 8200, unit: "T", suffix: " plastic", label: "Plastic avoided", sub: "Estimated, based on average bag weight × annual production." },
    { value: 500, unit: "+", suffix: " brands", label: "Brands trust us", sub: "From hyper-local kirana chains to listed retail and FMCG." },
    { value: 98, unit: "%", suffix: "", label: "On-time despatch", sub: "Two production lines, in-house printing — schedules we keep." },
  ],
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/industries", label: "Industries" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
