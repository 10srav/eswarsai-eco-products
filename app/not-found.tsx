import Link from "next/link";
import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Page not found", noindex: true });

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center bg-forest-deep text-bone">
      <Container>
        <div className="text-center">
          <p className="eyebrow text-sage">404</p>
          <h1 className="serif mt-6 text-[clamp(40px,7vw,96px)] font-light leading-[0.98] tracking-[-0.03em]">
            This page composted.
          </h1>
          <p className="mt-6 mx-auto max-w-md text-base opacity-75">
            Either the link aged out, or our printer ate it. Let&apos;s get you back.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-leaf px-7 py-4 text-sm font-medium text-forest-deep transition-colors hover:bg-sage"
            >
              Back to home
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-bone/30 px-7 py-4 text-sm transition-colors hover:bg-bone/10"
            >
              Browse products
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
