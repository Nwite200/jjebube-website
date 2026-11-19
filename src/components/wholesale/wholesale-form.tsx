"use client";

import { useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Loader2 } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

export function WholesaleForm({ whatsapp }: { whatsapp: string }) {
  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    phone: "",
    email: "",
    products: "",
    quantity: "",
    location: "",
    details: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [inquiryId, setInquiryId] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const waMessage = [
    "Hello JJ Ebube Enterprise, I'd like a wholesale quote.",
    inquiryId ? `Reference: ${inquiryId}` : "",
    "",
    `Name: ${form.fullName}`,
    form.businessName ? `Business: ${form.businessName}` : "",
    `Phone: ${form.phone}`,
    form.email ? `Email: ${form.email}` : "",
    "",
    "Products required:",
    form.products,
    form.quantity ? `\nQuantity / cartons: ${form.quantity}` : "",
    `Delivery location: ${form.location}`,
    form.details ? `\nAdditional details: ${form.details}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setState("loading");
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; inquiryId?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "We couldn't send your enquiry. Please try again.");
        setState("idle");
        return;
      }
      setInquiryId(json.inquiryId ?? "");
      setState("done");
    } catch {
      setError("Something went wrong. Please try again or message us on WhatsApp.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="animate-float-in border border-gold/30 bg-white p-7 md:p-10">
        <span className="flex size-14 items-center justify-center rounded-full bg-gold/15">
          <Check className="size-6 text-gold-deep" strokeWidth={2} />
        </span>
        <h2 className="mt-5 font-display text-[1.9rem] text-navy">Enquiry received.</h2>
        <p className="mt-2 max-w-md text-[0.85rem] leading-relaxed text-navy/50">
          Thank you, {form.fullName.split(" ")[0]}. Our team will review your list and get back to you with
          availability and pricing. For a faster response, send the same details to us on WhatsApp.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 border border-navy/10 bg-ivory px-4 py-2.5">
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Reference</span>
          <span className="font-mono text-[0.75rem] font-bold text-navy">{inquiryId}</span>
        </div>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <a href={whatsappUrl(whatsapp, waMessage)} target="_blank" rel="noreferrer" className="btn btn-gold">
            Send on WhatsApp <ArrowUpRight className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => {
              setForm({
                fullName: "",
                businessName: "",
                phone: "",
                email: "",
                products: "",
                quantity: "",
                location: "",
                details: "",
              });
              setInquiryId("");
              setState("idle");
            }}
            className="btn btn-outline"
          >
            Send another enquiry
          </button>
        </div>
        <p className="mt-4 text-[0.62rem] text-navy/35">
          No payment is taken with a wholesale enquiry.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-navy/10 bg-white p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-navy/10 pb-4">
        <div>
          <p className="eyebrow text-gold-deep">Bulk quote request</p>
          <h2 className="mt-2 font-display text-[1.7rem] leading-tight text-navy">Tell us what you need.</h2>
        </div>
        <span className="hidden bg-ivory px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-navy/45 sm:block">
          No obligation
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Full name <span className="text-gold-deep">*</span></span>
          <input
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="field"
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="field-label">Business name</span>
          <input
            value={form.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            className="field"
            placeholder="Shop, restaurant or company"
            autoComplete="organization"
          />
        </label>
        <label className="block">
          <span className="field-label">Phone number <span className="text-gold-deep">*</span></span>
          <input
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="field"
            placeholder="0803 123 4567"
            inputMode="tel"
            autoComplete="tel"
          />
        </label>
        <label className="block">
          <span className="field-label">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="field"
            placeholder="you@business.com"
            autoComplete="email"
          />
        </label>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="field-label">Products required <span className="text-gold-deep">*</span></span>
            <textarea
              required
              rows={4}
              value={form.products}
              onChange={(e) => update("products", e.target.value)}
              className="field h-auto py-3"
              placeholder={"One product per line, e.g.\nDano Cool Cow 1kg — 10 cartons\nIndomie chicken — 5 cartons"}
            />
          </label>
        </div>
        <label className="block">
          <span className="field-label">Quantity / carton count</span>
          <input
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className="field"
            placeholder="e.g. 15 cartons total"
          />
        </label>
        <label className="block">
          <span className="field-label">Delivery location <span className="text-gold-deep">*</span></span>
          <input
            required
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            className="field"
            placeholder="City / state"
          />
        </label>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="field-label">Additional details</span>
            <textarea
              rows={3}
              value={form.details}
              onChange={(e) => update("details", e.target.value)}
              className="field h-auto py-3"
              placeholder="Preferred delivery window, recurring supply, packaging requirements…"
            />
          </label>
        </div>
      </div>

      {error && <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-[0.75rem] text-red-700">{error}</p>}

      <button type="submit" disabled={state === "loading"} className="btn btn-gold mt-5 w-full disabled:opacity-70">
        {state === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending enquiry…
          </>
        ) : (
          <>
            Request a bulk quote <ArrowUpRight className="size-4" />
          </>
        )}
      </button>

      <div className="mt-4 flex flex-col items-center justify-between gap-2 text-[0.62rem] text-navy/35 sm:flex-row">
        <p className="flex items-center gap-1.5">
          <ChevronDown className="size-3 text-gold-deep" /> Your details are only used to respond to this enquiry.
        </p>
        <a href="/contact" className="font-semibold text-navy/55 underline underline-offset-2 hover:text-navy">
          Prefer email? Contact us
        </a>
      </div>
    </form>
  );
}
