import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = { label: string; href?: string; to?: string };

export default function Breadcrumbs(props: { items: BreadcrumbItem[] }) {
  // Ensure we don't duplicate the Home breadcrumb if it's already passed in
  const hasHome = props.items.length > 0 && props.items[0].label === "Home";
  const allItems: BreadcrumbItem[] = hasHome ? props.items : [{ label: "Home", href: "/" }, ...props.items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href || it.to ? { item: `https://eliteirrigation.com${it.href || it.to}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-stone-400 mb-6">
        {allItems.map((it, i) => (
          <span key={i} className="flex items-center">
            {i === 0 && <Home className="w-3 h-3 mr-1" />}
            {it.href || it.to ? (
              <Link href={it.href || it.to || "/"} className="hover:text-forest-600 transition-colors font-medium">
                {it.label}
              </Link>
            ) : (
              <span className="text-stone-600 font-semibold">{it.label}</span>
            )}
            {i < allItems.length - 1 && <ChevronRight className="w-3 h-3 mx-1.5 text-stone-300" />}
          </span>
        ))}
      </nav>
    </>
  );
}
