"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

const SUBJECTS = [
  "Product enquiry",
  "Order support",
  "Wholesale / bulk order",
  "Delivery question",
  "Something else",
];

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "We couldn't send your message. Please try again.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Something went wrong. Please try again or message us on WhatsApp.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="animate-float-in border border-navy/10 bg-white p-7 md:p-10">
        <span className="flex size-14 items-center justify-center rounded-full bg-gold/15">
          <Check className="size-6 text-gold-deep" strokeWidth={2} />
        </span>
        <h2 className="mt-5 font-display text-[1.9rem] text-navy">Message sent.</h2>
        <p className="mt-2 max-w-md text-[0.85rem] leading-relaxed text-navy/50">
          Thank you, {form.name.split(" ")[0]}. Our team has received your message and will get back to you. If
          it&apos;s urgent, WhatsApp is the fastest way to reach us.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <a href={whatsappUrl(whatsapp)} target="_blank" rel="noreferrer" className="btn btn-gold">
            Chat on WhatsApp <ArrowUpRight className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" });
              setState("idle");
            }}
            className="btn btn-outline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-navy/10 bg-white p-6 md:p-8">
      <p className="eyebrow text-gold-deep">Send a message</p>
      <h2 className="mt-2 font-display text-[1.8rem] leading-tight text-navy">How can we help?</h2>
      <p className="mt-1.5 text-[0.78rem] text-navy/45">
        Tell us what you need and we&apos;ll point you in the right direction.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Full name <span className="text-gold-deep">*</span></span>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="field"
            autoComplete="name"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="field-label">Phone number <span className="text-gold-deep">*</span></span>
          <input
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="field"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0803 123 4567"
          />
        </label>
        <label className="block">
          <span className="field-label">Email <span className="text-gold-deep">*</span></span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="field"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="field-label">Subject</span>
          <select value={form.subject} onChange={(e) => update("subject", e.target.value)} className="field">
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="field-label">Message <span className="text-gold-deep">*</span></span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="field h-auto py-3"
              placeholder="Tell us about the product, order or question you have."
            />
          </label>
        </div>
      </div>

      {error && <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-[0.75rem] text-red-700">{error}</p>}

      <button type="submit" disabled={state === "loading"} className="btn btn-navy mt-5 w-full disabled:opacity-70 sm:w-auto">
        {state === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <ArrowUpRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
