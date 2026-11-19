import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({
  items,
  tone = "light",
}: {
  items: { label: string; href?: string }[];
  tone?: "light" | "dark";
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
          tone === "light" ? "text-navy/35" : "text-ivory/40",
        )}
      >
        <li>
          <Link href="/" className={cn("transition", tone === "light" ? "hover:text-navy" : "hover:text-ivory")}>
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className={cn("size-3", tone === "light" ? "text-navy/20" : "text-ivory/20")} />
            {item.href ? (
              <Link
                href={item.href}
                className={cn("transition", tone === "light" ? "hover:text-navy" : "hover:text-ivory")}
              >
                {item.label}
              </Link>
            ) : (
              <span className={tone === "light" ? "text-navy/70" : "text-ivory/75"}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
