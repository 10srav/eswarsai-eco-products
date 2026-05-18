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
    image: { src: "/images/products/eswar-sai-kakinada-manufacturing-line.jpg", alt: "Custom manufactured non-woven and jute bags on the Eswar Sai production line in Kakinada" },
    features: ["Brief-driven design", "5-day sample turnaround", "Bring-your-own artwork", "Any GSM, any size", "Direct manufacturer pricing"],
    applications: ["New product launches", "Limited editions", "Brand collaborations", "Sustainability-led packaging"],
    industries: ["All sectors"],
    highlight: true,
  },
];

export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

export const galleryImages = [
  { src: "/images/gallery/kakinada-coop-bank.jpg", alt: "Custom jute tote with KCB logo for The Kakinada Co-operative Town Bank" },
  { src: "/images/gallery/wedding-rg-monogram.jpg", alt: "Wedding favour jute totes — Rajasimha and Greeshma monogram, dual colourways" },
  { src: "/images/gallery/ap-gramina-bank-sankranti.jpg", alt: "Jute promotional bag for Andhra Pradesh Gramina Bank, Sankranti 2026 edition" },
  { src: "/images/gallery/shrimp-synergy-project.jpg", alt: "Branded jute carrier for the Shrimp Synergy Project on the factory floor" },
  { src: "/images/gallery/snvzp-school-reunion.jpg", alt: "Jute reunion bag with mandala motif — SNVZP High School, Tallarevu" },
  { src: "/images/gallery/upanayanam-thank-you.jpg", alt: "Jute return-gift bag with yellow trim — Upanayanam thank-you print" },
  { src: "/images/gallery/red-mandala-jute.jpg", alt: "Hand-printed jute tote with bold red mandala half-circle" },
  { src: "/images/gallery/cactus-print-jute.jpg", alt: "Boutique jute tote with cactus and succulent illustration" },
  { src: "/images/gallery/virtue-iso-certified.jpg", alt: "Corporate jute bag printed for Virtue — ISO 9001:2015 certified, GAFTA approved" },
  { src: "/images/gallery/rose-milk-rajahmundry.png", alt: "Non-woven D-cut bag for Rajahmundry Rose Milk with bilingual print and city skyline" },
  { src: "/images/gallery/rudra-eye-hospital.jpg", alt: "Non-woven D-cut bag for Rudra Eye Hospital, Vikarabad — Telugu and English print" },
  { src: "/images/gallery/baby-wonders-store.jpg", alt: "Non-woven D-cut bag for Baby Wonders, the complete baby store at Anaparthi" },
  { src: "/images/gallery/d-cut-size-range.jpg", alt: "Non-woven D-cut bag size range — 9×12 to 16×20 inch laid out for scale" },
  { src: "/images/gallery/padmavathi-fabric-stack.jpg", alt: "Stack of pink non-woven D-cut bags for Padmavathi Fabric Studio — packed warehouse pile" },
  { src: "/images/factory/non-woven-shopping-bag.jpg", alt: "Reusable non-woven shopping bag" },
  { src: "/images/products/non-woven-bag.jpg", alt: "Non-woven shopping bag detail" },
  { src: "/images/factory/eco-bag-display.jpg", alt: "Eco-friendly bag display" },
  { src: "/images/products/eswar-sai-kakinada-manufacturing-line.jpg", alt: "Inside the non-woven bag manufacturing line at Eswar Sai Eco Products, Kakinada" },
  { src: "/images/products/d-cut-non-woven-bags-1-.avif", alt: "D-cut non-woven bags in production" },
  { src: "/images/products/printed-non-woven-carry-bag-f-20240416214534297.jpg", alt: "Branded printed non-woven carry bag" },
  { src: "/images/products/PP-Colored-W-Cut-Non-Woven-Bag.webp", alt: "Coloured W-cut polypropylene non-woven bag" },
  { src: "/images/products/non-woven-w-cut-bags-500x500-1.webp", alt: "W-cut non-woven bag stack" },
  { src: "/images/products/non-woven-carry-bags-500x500-1.webp", alt: "Non-woven carry bag assortment" },
  { src: "/images/products/product-jpeg-500x500-1.webp", alt: "Drawstring non-woven pouch" },
];

export type ShowcaseItem =
  | { kind: "image"; src: string; alt: string; caption: string; sub?: string }
  | { kind: "video"; src: string; poster?: string; alt: string; caption: string; sub?: string };

export const galleryShowcase: ShowcaseItem[] = [
  {
    kind: "video",
    src: "/images/gallery/factory-floor.mp4",
    alt: "A walk through the Eswar Sai factory floor",
    caption: "Inside the line",
    sub: "Where every bag is born",
  },
  {
    kind: "image",
    src: "/images/gallery/kakinada-coop-bank.jpg",
    alt: "Custom jute tote with KCB logo for The Kakinada Co-operative Town Bank",
    caption: "Kakinada Co-op Bank",
    sub: "Cooperative · Branded jute",
  },
  {
    kind: "image",
    src: "/images/gallery/wedding-rg-monogram.jpg",
    alt: "Wedding favour jute totes — Rajasimha and Greeshma monogram in two colourways",
    caption: "Rajasimha × Greeshma",
    sub: "Wedding favours · Dual colourway",
  },
  {
    kind: "image",
    src: "/images/gallery/rose-milk-rajahmundry.png",
    alt: "Non-woven D-cut bag for Rajahmundry Rose Milk with bilingual print and city skyline",
    caption: "Rajahmundry Rose Milk",
    sub: "Hospitality · D-cut non-woven",
  },
  {
    kind: "image",
    src: "/images/gallery/ap-gramina-bank-sankranti.jpg",
    alt: "Jute promotional bag for Andhra Pradesh Gramina Bank, Sankranti 2026 edition",
    caption: "AP Gramina Bank",
    sub: "Sankranti 2026 · Promo jute",
  },
  {
    kind: "image",
    src: "/images/gallery/shrimp-synergy-project.jpg",
    alt: "Branded jute carrier for the Shrimp Synergy Project on the factory floor",
    caption: "Shrimp Synergy Project",
    sub: "Government · Jute carrier",
  },
  {
    kind: "image",
    src: "/images/gallery/snvzp-school-reunion.jpg",
    alt: "Jute reunion bag with mandala motif — SNVZP High School, Tallarevu",
    caption: "SNVZP Reunion",
    sub: "Alumni · Mandala print",
  },
  {
    kind: "image",
    src: "/images/gallery/upanayanam-thank-you.jpg",
    alt: "Jute return-gift bag with yellow trim — Upanayanam thank-you print",
    caption: "Upanayanam favours",
    sub: "Ceremony · Return gifts",
  },
  {
    kind: "image",
    src: "/images/gallery/red-mandala-jute.jpg",
    alt: "Hand-printed jute tote with bold red mandala half-circle",
    caption: "Red mandala tote",
    sub: "Lifestyle · Statement print",
  },
  {
    kind: "image",
    src: "/images/gallery/cactus-print-jute.jpg",
    alt: "Boutique jute tote with cactus and succulent illustration",
    caption: "Cactus illustration",
    sub: "Boutique · Lifestyle jute",
  },
  {
    kind: "image",
    src: "/images/gallery/virtue-iso-certified.jpg",
    alt: "Corporate jute bag printed for Virtue — ISO 9001:2015 certified, GAFTA approved",
    caption: "Virtue Inspection",
    sub: "Corporate · ISO-certified",
  },
  {
    kind: "image",
    src: "/images/gallery/rudra-eye-hospital.jpg",
    alt: "Non-woven D-cut bag for Rudra Eye Hospital, Vikarabad",
    caption: "Rudra Eye Hospital",
    sub: "Healthcare · Bilingual print",
  },
  {
    kind: "image",
    src: "/images/gallery/baby-wonders-store.jpg",
    alt: "Non-woven D-cut bag for Baby Wonders — the complete baby store, Anaparthi",
    caption: "Baby Wonders",
    sub: "Retail · D-cut non-woven",
  },
  {
    kind: "image",
    src: "/images/gallery/d-cut-size-range.jpg",
    alt: "Non-woven D-cut bag size range — 9×12 to 16×20 inch laid out for scale",
    caption: "Size range, 9×12 → 16×20",
    sub: "Specification · Scale shot",
  },
  {
    kind: "image",
    src: "/images/gallery/padmavathi-fabric-stack.jpg",
    alt: "Stack of pink non-woven D-cut bags for Padmavathi Fabric Studio",
    caption: "Padmavathi Fabric Studio",
    sub: "Bulk order · Stacked & ready",
  },
];

export type Industry = {
  slug: string;
  name: string;
  short: string;
  desc: string;
  longDesc: string;
  count: string;
  metrics: { label: string; value: string }[];
  productKeywords: string[];
  applications: string[];
  caseImage: { src: string; alt: string };
  whyUs: { title: string; body: string }[];
  keywords: string[];
};

export const industries: Industry[] = [
  {
    slug: "retail",
    name: "Retail & Grocery",
    short: "Retail & Grocery",
    desc: "D-cut and W-cut non-woven for high-velocity checkout. Custom-print at the bag-printing line, not outsourced.",
    longDesc:
      "Bags built for the bag-rip moment — kirana counters, supermarket checkout, weekly grocery loaders. We engineer for tear strength at the handle, food-contact safety on the inner face, and price per piece that holds against single-use plastic. Custom print at our own line means your store identity travels with every basket out the door.",
    count: "180+ chains",
    metrics: [
      { label: "Chains served", value: "180+" },
      { label: "Standard MOQ", value: "1,000 pcs" },
      { label: "Sample turnaround", value: "5 days" },
    ],
    productKeywords: ["Retail", "Grocery", "FMCG", "Wholesale"],
    applications: ["Supermarket checkout", "Kirana counters", "Pharmacy front-counter", "Weekly grocery hauler", "Bulk wholesale"],
    caseImage: { src: "/images/gallery/baby-wonders-store.jpg", alt: "Non-woven D-cut bag for Baby Wonders retail store in Anaparthi" },
    whyUs: [
      { title: "Handle that holds", body: "Welded die-cut handles tested at 8 kg dynamic load — no failure at the high-traffic counter." },
      { title: "Pantone-matched print", body: "1–6 colour flexo and screen print, matched to your brand book — no muddy proofs." },
      { title: "Despatch discipline", body: "Pan-India palletised despatch with batch labels. We don't miss the festive window." },
    ],
    keywords: [
      "non woven bag manufacturer for retail",
      "supermarket bag supplier India",
      "kirana shopping bag manufacturer",
      "retail bag printing Andhra Pradesh",
      "grocery non woven bag Kakinada",
    ],
  },
  {
    slug: "pharma",
    name: "Pharma & Healthcare",
    short: "Pharma",
    desc: "Food-grade fabric, validated supply chain, batch-traceable orders for hospital and pharmacy chains.",
    longDesc:
      "Pharmacy and hospital procurement teams ask for two things our competitors can't deliver: documentation and reliability. We manufacture from IS-9833-compliant polypropylene, give you batch traceability against every despatch, and meet repeat orders on a calendar you can plan around. Bilingual print supported for state-specific compliance.",
    count: "40+ pharmacy chains",
    metrics: [
      { label: "Pharmacy chains", value: "40+" },
      { label: "Repeat orders", value: "85%" },
      { label: "Compliance", value: "IS-9833" },
    ],
    productKeywords: ["Pharma", "Retail"],
    applications: ["Pharmacy chain checkout", "Hospital discharge kits", "Diagnostic centre carry-outs", "Bilingual compliance prints"],
    caseImage: { src: "/images/gallery/rudra-eye-hospital.jpg", alt: "Non-woven D-cut bag for Rudra Eye Hospital with Telugu and English print" },
    whyUs: [
      { title: "Food-grade fabric", body: "IS-9833 PP non-woven, certificates on file. Required by procurement audits at every hospital chain we serve." },
      { title: "Batch traceability", body: "Every despatch carries a batch ID linked to the raw fabric mill, the print job, and the QC sign-off." },
      { title: "Bilingual print", body: "English + state language on the same bag — required for hospital pharmacies under regional patient-info rules." },
    ],
    keywords: [
      "pharma bag manufacturer India",
      "hospital pharmacy bag supplier",
      "non woven bag for pharmacy",
      "bilingual pharmacy bag print",
      "Telugu English pharma bag Kakinada",
    ],
  },
  {
    slug: "fashion",
    name: "Fashion & Boutique",
    short: "Fashion & Boutique",
    desc: "Loop-handle non-woven and jute totes with premium feel — your boutique deserves a bag the customer actually keeps.",
    longDesc:
      "Boutiques don't sell bags — they sell the moment the customer leaves the store. Our loop-handle non-woven and laminated jute totes are weight-cushioned, hand-cut, and printed so the bag itself becomes a takeaway brand asset. Lower MOQs, higher print resolution, and finishes that match the price point of the garment inside.",
    count: "120+ brands",
    metrics: [
      { label: "Brands", value: "120+" },
      { label: "Min order", value: "500 pcs" },
      { label: "Print colours", value: "Up to 8" },
    ],
    productKeywords: ["Fashion", "Lifestyle", "Beauty", "Hospitality", "Gifting"],
    applications: ["Boutique takeaway", "Designer pop-ups", "Hand-loom labels", "Salon retail", "Beauty box gifting"],
    caseImage: { src: "/images/gallery/cactus-print-jute.jpg", alt: "Boutique jute tote with cactus and succulent illustration" },
    whyUs: [
      { title: "Take-home object, not packaging", body: "Hand-cut jute and cushioned loop handles — the bag is reused, not binned. Your logo travels." },
      { title: "Low-MOQ flexibility", body: "500-piece runs supported for boutique drops. Most factories won't engage below 5,000." },
      { title: "High-resolution print", body: "Up to 8-colour print with Pantone matching. Hand-screened for hero pieces." },
    ],
    keywords: [
      "boutique jute bag manufacturer",
      "designer loop handle bag",
      "premium tote bag supplier India",
      "fashion brand bag printing",
      "boutique retail bag low MOQ",
    ],
  },
  {
    slug: "events",
    name: "Events & Weddings",
    short: "Events & Weddings",
    desc: "Promotional bags with rapid turnaround, multi-colour print, and per-event SKU management.",
    longDesc:
      "Wedding planners, brand-activation agencies, and conference organisers operate on calendars that don't move. We manufacture, print, and despatch wedding favours, conference welcome kits, and event giveaways on tight timelines — multiple SKUs in a single PO, per-event labelling, and direct-to-venue despatch.",
    count: "300+ events / yr",
    metrics: [
      { label: "Events / year", value: "300+" },
      { label: "SKUs per PO", value: "Up to 20" },
      { label: "Express samples", value: "48 hrs" },
    ],
    productKeywords: ["Events", "Marketing", "Corporate", "Hospitality", "Promotional"],
    applications: ["Wedding favours", "Conference welcome kits", "Brand activations", "Festival giveaways", "Sankranti / Diwali editions"],
    caseImage: { src: "/images/gallery/wedding-rg-monogram.jpg", alt: "Wedding favour jute totes with Rajasimha and Greeshma monogram in two colourways" },
    whyUs: [
      { title: "Per-event SKU management", body: "Multiple variants in one PO — different sizes, prints, monograms — labelled and bundled for the venue." },
      { title: "Direct-to-venue despatch", body: "We ship to the venue, not just the warehouse. Coordinated with your event ops timeline." },
      { title: "Festival-edition prints", body: "Sankranti, Diwali, Eid edition prints — historically registered with us, repeat-printable on demand." },
    ],
    keywords: [
      "wedding favour bag manufacturer",
      "conference welcome bag supplier",
      "event giveaway bag India",
      "Sankranti edition jute bag",
      "Diwali corporate gift bag manufacturer",
    ],
  },
  {
    slug: "fmcg",
    name: "FMCG & Food",
    short: "FMCG & Food",
    desc: "Reinforced bases, food-safe inner-laminate, palletised pan-India despatch.",
    longDesc:
      "FMCG procurement has zero tolerance for delay and zero tolerance for failed bags. We manufacture with reinforced bases, food-safe inner-laminate, and a despatch discipline tuned for monthly POs from listed FMCG brands. Bilingual print and barcode labelling supported.",
    count: "60+ FMCG brands",
    metrics: [
      { label: "FMCG brands", value: "60+" },
      { label: "On-time despatch", value: "98%" },
      { label: "Load tested", value: "12 kg" },
    ],
    productKeywords: ["FMCG", "Retail", "Grocery", "Logistics", "Wholesale"],
    applications: ["FMCG channel partners", "Modern trade packaging", "Cash-and-carry distribution", "Foodservice carry-out", "Quick-commerce pickup"],
    caseImage: { src: "/images/gallery/rose-milk-rajahmundry.png", alt: "Non-woven D-cut bag for Rajahmundry Rose Milk with bilingual print" },
    whyUs: [
      { title: "Reinforced bases", body: "Welded double-base construction for 12 kg dynamic load — passes drop testing for modern trade." },
      { title: "Food-safe laminate", body: "Food-grade PP non-woven with optional inner-laminate. Documented for FSSAI-aligned procurement audits." },
      { title: "Monthly cadence", body: "We hold open POs and pull-down releases monthly. Quarter-ahead production planning for repeat SKUs." },
    ],
    keywords: [
      "FMCG bag manufacturer India",
      "food grade non woven bag supplier",
      "modern trade packaging bag",
      "quick commerce carry bag manufacturer",
      "FSSAI compliant carry bag",
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce & D2C",
    short: "E-commerce",
    desc: "Drawstring pouches, mailers, and inserts for the unboxing moment that turns into a re-share.",
    longDesc:
      "D2C brands compete on unboxing. We manufacture drawstring pouches, branded mailers, and tissue-paper inserts that turn first-time customers into repeat sharers. Single-piece pick-and-pack-friendly, printed in editions, despatched to fulfilment centres or directly to your warehouse.",
    count: "90+ D2C brands",
    metrics: [
      { label: "D2C brands", value: "90+" },
      { label: "Edition runs", value: "From 1,000" },
      { label: "Fulfilment", value: "Pick-friendly" },
    ],
    productKeywords: ["E-commerce", "Fashion", "Beauty", "Lifestyle"],
    applications: ["Subscription box pouches", "D2C apparel mailers", "Beauty drawstring pouches", "Unboxing tissue inserts", "Influencer-edition runs"],
    caseImage: { src: "/images/gallery/red-mandala-jute.jpg", alt: "Hand-printed jute tote with bold red mandala — D2C edition run" },
    whyUs: [
      { title: "Edition runs from 1,000", body: "Drop-edition prints supported at 1,000 pieces. Most factories require 5,000+." },
      { title: "Fulfilment-friendly", body: "Pre-counted, pre-sorted, labelled — slots straight into your warehouse pick-and-pack." },
      { title: "Influencer collab editions", body: "Limited prints, individually numbered if needed. Built for the share-worthy moment." },
    ],
    keywords: [
      "D2C brand bag manufacturer",
      "ecommerce drawstring pouch supplier",
      "subscription box bag manufacturer India",
      "branded mailer bag for D2C",
      "unboxing bag manufacturer Kakinada",
    ],
  },
];

export const industriesBySlug = Object.fromEntries(industries.map((i) => [i.slug, i]));

export function productsForIndustry(industry: Industry, limit = 4): Product[] {
  const set = new Set(industry.productKeywords);
  const matches = products.filter((p) =>
    p.industries.some((tag) => set.has(tag)),
  );
  if (matches.length >= limit) return matches.slice(0, limit);
  // Backfill from non-matching products to keep card grids visually full.
  const backfill = products.filter((p) => !matches.includes(p)).slice(0, limit - matches.length);
  return [...matches, ...backfill];
}

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
