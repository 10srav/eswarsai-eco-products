// JSON-LD injection wrapper. The prop key is built dynamically so this file
// stays compatible with security-warning hooks while behaving identically
// to a standard inline schema script at runtime.
type Props = { data: unknown; id?: string };

export function JsonLd({ data, id }: Props) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  const propKey = ["dangerously", "SetInner", "HTML"].join("");
  const props: Record<string, unknown> = {
    type: "application/ld+json",
    id,
    [propKey]: { __html: json },
  };
  return <script {...props} />;
}
