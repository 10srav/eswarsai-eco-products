import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { ProductsFilterableGrid } from "@/components/sections/ProductsFilterableGrid";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, productListSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Products",
  description:
    "Eight categories of premium non-woven and jute bags — D-cut, W-cut, loop-handle, jute totes, drawstrings, heavy-duty shoppers, branded promotional and custom builds. Manufactured in Kakinada, Andhra Pradesh.",
  path: "/products",
  keywords: [
    "non woven bag manufacturer",
    "jute bag supplier",
    "D-cut non woven bag",
    "W-cut non woven bag",
    "loop handle non woven bag",
    "drawstring pouch manufacturer",
    "custom printed eco bag",
    "Kakinada",
    "Andhra Pradesh",
    "Vizag bag manufacturer",
    "Hyderabad bag supplier",
    "South India non-woven manufacturer",
    "non woven bag manufacturer in Andhra Pradesh",
  ],
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="8 categories · custom-engineered"
        title="Every bag, every spec, custom for your brand."
        lede="Pick a category, brief us on size, GSM, gauge, colour and print, and we'll engineer it from fibre to fold. Five-day samples. Pan-India despatch."
      />

      <ProductsFilterableGrid />

      <CTABanner />

      <JsonLd id="ld-product-list" data={productListSchema} />
      <JsonLd
        id="ld-breadcrumb-products"
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
        ])}
      />
    </>
  );
}
