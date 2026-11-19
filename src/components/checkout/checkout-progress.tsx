"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Contact" },
  { n: 2, label: "Delivery" },
  { n: 3, label: "Payment" },
];

export function CheckoutProgress() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-checkout-step]"),
    );
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const step = Number(visible[0].target.getAttribute("data-checkout-step"));
          if (step) setActive(step);
        }
      },
      { rootMargin: "-18% 0px -58% 0px", threshold: [0.05, 0.2, 0.45] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function goTo(step: number) {
    const el = document.getElementById(`checkout-step-${step}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mb-9 border border-navy/10 bg-white px-4 py-3.5 sm:px-6">
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const done = active > step.n;
          const current = active === step.n;
          return (
            <div key={step.n} className={cn("flex items-center", index < STEPS.length - 1 && "flex-1")}>
              <button
                type="button"
                onClick={() => goTo(step.n)}
                className="group flex shrink-0 items-center gap-2.5"
                aria-current={current ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border text-[0.58rem] font-bold transition-all duration-500",
                    done && "border-gold bg-gold text-navy",
                    current && "border-gold bg-gold/10 text-gold-deep",
                    !done && !current && "border-navy/15 text-navy/30",
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3} /> : step.n}
                </span>
                <span
                  className={cn(
                    "text-[0.6rem] font-bold uppercase tracking-[0.12em] transition-colors duration-300",
                    current ? "text-navy" : done ? "text-navy/55" : "text-navy/30",
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < STEPS.length - 1 && (
                <span className="mx-3 h-px flex-1 overflow-hidden bg-navy/10 sm:mx-5">
                  <span
                    className="block h-full bg-gold transition-[width] duration-700 ease-out"
                    style={{ width: active > step.n ? "100%" : "0%" }}
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
