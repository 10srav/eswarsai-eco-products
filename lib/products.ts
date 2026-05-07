export type Product = {
  slug: string;
  number: string;
  category: "Non-woven" | "Jute" | "Promotional" | "Shopping" | "Specialty" | "Custom";
  name: string;
  shortDesc: string;
  longDesc: string;
  spec: string;
  tag: string;
  image: { src: string; alt: string };
  features: string[];
  applications: string[];
  industries: string[];
  highlight?: boolean;
};

export const products: Product[] = [
  {
    slug: "d-cut-non-woven",
    number: "01",
    category: "Non-woven",
    name: "D-Cut Non-Woven",
    shortDesc: "Clean die-cut handle, lightweight body. Perfect for retail counters, pharma, and grocery.",
    longDesc:
      "Our D-Cut non-woven bags are die-cut from a single sheet of polypropylene non-woven fabric — no stitching at the handle, no failure points. The result: a clean, premium presentation at retail-counter speed and grocery-trolley scale.",
    spec: "30–120 GSM",
    tag: "Custom print",
    image: { src: "/images/products/d-cut-non-woven-bags-1-.avif", alt: "D-cut non-woven bag" },
    features: ["Die-cut handle", "30–120 GSM range", "Up to 6-colour print", "Recyclable PP fabric", "Welded seams"],
    applications: ["Retail counters", "Pharmacy chains", "Grocery & kirana", "Express checkout"],
    industries: ["Retail", "Pharma", "FMCG", "Grocery"],
  },
  {
    slug: "w-cut-non-woven",
    number: "02",
    category: "Non-woven",
    name: "W-Cut Non-Woven",
    shortDesc: "Fold-stitched W-cut, side-gusseted body — extra capacity for shopping & textile.",
    longDesc:
      "The W-cut design folds the fabric into a double-layer mouth, stitched along the side gusset for extra strength. Ideal when carry weight matters more than minimal aesthetics.",
    spec: "40–100 GSM",
    tag: "Bulk-ready",
    image: { src: "/images/products/non-woven-w-cut-bags-500x500-1.webp", alt: "W-cut non-woven bag" },
    features: ["Fold-stitched mouth", "Wide side gusset", "40–100 GSM range", "High carry capacity", "Bulk-friendly"],
    applications: ["Apparel & textile", "Weekly grocery", "Bulk distribution", "Conferences"],
    industries: ["Textile", "Retail", "Events", "Logistics"],
  },
  {
    slug: "loop-handle",
    number: "03",
    category: "Non-woven",
    name: "Loop Handle",
    shortDesc: "Welded loop handles, premium feel — boutique apparel, cosmetics, and gifting.",
    longDesc:
      "A welded loop handle gives loop-handle bags a tactile, premium grip — the kind shoppers reuse, photograph, and walk around with. Our weld is ultrasonic, not glued, so the handle lifecycle matches the body.",
    spec: "60–120 GSM",
    tag: "Premium",
    image: { src: "/images/products/PP-Colored-W-Cut-Non-Woven-Bag.webp", alt: "Loop handle non-woven bag" },
    features: ["Ultrasonic weld", "Soft-touch handle", "60–120 GSM range", "Multi-colour weave", "Boutique finish"],
    applications: ["Boutique apparel", "Cosmetics & beauty", "Wedding favours", "Premium gifting"],
    industries: ["Fashion", "Beauty", "Gifting", "Hospitality"],
  },
  {
    slug: "classic-jute-tote",
    number: "04",
    category: "Jute",
    name: "Classic Jute Tote",
    shortDesc: "Natural jute fibre, laminated interior. Earthy hand-feel, exceptional carry strength.",
    longDesc:
      "Sourced from audited Indian jute mills, our totes use 10–14 oz fabric with laminated interiors — keeping the natural earth-feel outside while staying fully food-safe inside. Composts in months, not centuries.",
    spec: "10–14 oz",
    tag: "Compostable",
    image: { src: "/images/products/non-woven-bag.jpg", alt: "Classic jute tote" },
    features: ["Natural jute fibre", "Laminated interior", "10–14 oz range", "100% compostable", "Heavy-load rated"],
    applications: ["Premium retail", "Lifestyle brands", "Conferences", "Gifting kits"],
    industries: ["Fashion", "Lifestyle", "Hospitality", "Events"],
    highlight: true,
  },
  {
    slug: "branded-promotional",
    number: "05",
    category: "Promotional",
    name: "Branded Promotional",
    shortDesc: "1–6 colour flexo & screen printing. Conferences, weddings, corporate gifting.",
    longDesc:
      "Bring your brand to life on non-woven, jute, or recycled cotton. We run flexo, screen, and digital print in-house — colour-matched to your brand book, with a 5-day sample turnaround.",
    spec: "MOQ 1,000",
    tag: "Print-ready",
    image: { src: "/images/products/printed-non-woven-carry-bag-f-20240416214534297.jpg", alt: "Branded promotional bag" },
    features: ["1–6 colour print", "Pantone matching", "5-day samples", "MOQ 1,000 pcs", "In-house artwork QA"],
    applications: ["Conferences", "Wedding favours", "Corporate gifting", "Brand activations"],
    industries: ["Marketing", "Events", "Corporate", "Hospitality"],
  },
  {
    slug: "heavy-duty-shopper",
    number: "06",
    category: "Shopping",
    name: "Heavy-duty Shopper",
    shortDesc: "Reinforced base, extra-wide gusset. Built for grocery and weekly hauls.",
    longDesc:
      "Reinforced double-layer base. Extra-wide gusset. Welded handles. Built for the household that does the weekly grocery in a single trip — and reuses the same bag for two years.",
    spec: "Up to 15kg",
    tag: "Reinforced",
    image: { src: "/images/products/non-woven-carry-bags-500x500-1.webp", alt: "Heavy-duty shopper bag" },
    features: ["Reinforced base", "15kg load rated", "Extra-wide gusset", "Welded handles", "Reusable 200×"],
    applications: ["Grocery hauls", "Supermarket chains", "Farmer's markets", "Bulk produce"],
    industries: ["Retail", "Grocery", "FMCG", "Wholesale"],
  },
  {
    slug: "drawstring-pouch",
    number: "07",
    category: "Specialty",
    name: "Drawstring Pouch",
    shortDesc: "Soft non-woven drawstrings — shoes, lingerie, e-commerce inserts.",
    longDesc:
      "Soft-touch non-woven with woven drawstrings. We make them in any size you need — micro pouches for jewellery, mid-size for footwear, large for apparel inserts.",
    spec: "Multiple sizes",
    tag: "E-com favourite",
    image: { src: "/images/products/product-jpeg-500x500-1.webp", alt: "Drawstring non-woven pouch" },
    features: ["Soft-touch fabric", "Woven drawstring", "Custom sizes", "Tear-resistant", "E-com friendly"],
    applications: ["Footwear", "Lingerie & innerwear", "Jewellery", "E-commerce inserts"],
    industries: ["Fashion", "E-commerce", "Lifestyle", "Beauty"],
  },
  {
    slug: "custom-bespoke",
    number: "08",
    category: "Custom",
    name: "Made for your brand",
    shortDesc: "Tell us your size, GSM, gauge, colour, finish, print. We engineer it from scratch.",
    longDesc:
      "Send us a brief — sizes, GSM, gauges, finishes, colour swatches, MOQ — and we'll send a sample within 5 working days. Bring your own design or we'll engineer one with you.",
    spec: "Custom",
    tag: "Bespoke",
    image: { src: "/images/products/non-woven-bag-manufacturer-in-rajkot.jpg", alt: "Custom manufactured bags" },
    features: ["Brief-driven design", "5-day sample turnaround", "Bring-your-own artwork", "Any GSM, any size", "Direct manufacturer pricing"],
    applications: ["New product launches", "Limited editions", "Brand collaborations", "Sustainability-led packaging"],
    industries: ["All sectors"],
    highlight: true,
  },
];

export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

export const galleryImages = [
  { src: "/images/factory/non-woven-shopping-bag.jpg", alt: "Reusable non-woven shopping bag" },
  { src: "/images/products/non-woven-bag.jpg", alt: "Non-woven shopping bag detail" },
  { src: "/images/factory/eco-bag-display.jpg", alt: "Eco-friendly bag display" },
  { src: "/images/products/non-woven-bag-manufacturer-in-rajkot.jpg", alt: "Inside the non-woven bag manufacturing line" },
  { src: "/images/products/d-cut-non-woven-bags-1-.avif", alt: "D-cut non-woven bags in production" },
  { src: "/images/products/printed-non-woven-carry-bag-f-20240416214534297.jpg", alt: "Branded printed non-woven carry bag" },
  { src: "/images/products/PP-Colored-W-Cut-Non-Woven-Bag.webp", alt: "Coloured W-cut polypropylene non-woven bag" },
  { src: "/images/products/non-woven-w-cut-bags-500x500-1.webp", alt: "W-cut non-woven bag stack" },
  { src: "/images/products/non-woven-carry-bags-500x500-1.webp", alt: "Non-woven carry bag assortment" },
  { src: "/images/products/product-jpeg-500x500-1.webp", alt: "Drawstring non-woven pouch" },
];

export const industries = [
  { slug: "retail", name: "Retail & Grocery", desc: "D-cut and W-cut non-woven for high-velocity checkout. Custom-print at the bag-printing line, not outsourced.", count: "180+ chains" },
  { slug: "pharma", name: "Pharma", desc: "Food-grade fabric, validated supply chain, batch-traceable orders for hospital and pharmacy chains.", count: "40+ pharmacy chains" },
  { slug: "fashion", name: "Fashion & Boutique", desc: "Loop-handle non-woven and jute totes with premium feel — your boutique deserves a bag the customer actually keeps.", count: "120+ brands" },
  { slug: "events", name: "Events & Weddings", desc: "Promotional bags with rapid turnaround, multi-colour print, and per-event SKU management.", count: "300+ events / yr" },
  { slug: "fmcg", name: "FMCG & Food", desc: "Reinforced bases, food-safe inner-laminate, palletised pan-India despatch.", count: "60+ FMCG brands" },
  { slug: "ecommerce", name: "E-commerce", desc: "Drawstring pouches, mailers, and inserts for the unboxing moment that turns into a re-share.", count: "90+ D2C brands" },
];

export const processSteps = [
  { number: "01", title: "Spec", subtitle: "You brief, we engineer", body: "Size, GSM, gauge, colour, print, MOQ. We send a sample within 5 working days." },
  { number: "02", title: "Source", subtitle: "Recycled, food-grade fabric", body: "100% PP non-woven, certified jute — sourced from audited Indian mills." },
  { number: "03", title: "Print & cut", subtitle: "In-house, no middleman", body: "Flexo & screen printing, automated cutting, ultrasonic stitching — full QC at each line." },
  { number: "04", title: "Despatch", subtitle: "Pan-India, on-time", body: "Bundled, labelled, palletised — direct to your warehouse or distribution centre." },
];

export const sustainabilityPillars = [
  { title: "Recyclable polypropylene", body: "Our non-woven fabric is 100% PP — fully recyclable in conventional polymer streams. Ours doesn't outlast the planet." },
  { title: "Compostable jute", body: "Plant-grown jute breaks down in months, not centuries. Heavy carry strength, light environmental footprint." },
  { title: "Reusable lifecycle", body: "Engineered for 200+ uses. The carbon math beats single-use plastic in the very first month." },
  { title: "Audited supply chain", body: "Mills are independently audited for labour and environmental practices. Ask, and we'll share certificates." },
];
