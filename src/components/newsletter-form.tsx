"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setState("done");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2.5 border border-gold/30 bg-gold/10 px-4 py-3.5 text-[0.78rem] text-ivory">
        <Check className="size-4 text-gold" />
        You&apos;re on the list. Watch your inbox for our next update.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address"
          className="field field-dark h-11 rounded-r-none border-r-0 text-[0.8rem]"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn btn-gold h-11 shrink-0 rounded-l-none px-4 disabled:opacity-60"
          aria-label="Subscribe"
        >
          {state === "loading" ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-navy/30 border-t-navy" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </button>
      </div>
      {state === "error" && <p className="text-[0.68rem] text-red-300">{message}</p>}
    </form>
  );
}
