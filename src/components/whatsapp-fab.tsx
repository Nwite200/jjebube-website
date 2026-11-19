"use client";

import { useEffect, useState } from "react";
import { useStoreData } from "./store-provider";
import { whatsappUrl } from "@/lib/utils";

export function WhatsAppFab() {
  const { config } = useStoreData();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={whatsappUrl(
        config.whatsapp,
        "Hello JJ Ebube Enterprise, I'd like to ask about a product.",
      )}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with JJ Ebube on WhatsApp"
      className={`group fixed bottom-20 right-4 z-40 flex size-[52px] items-center justify-center rounded-full bg-[#1FA855] text-white shadow-[0_12px_30px_-6px_rgba(31,168,85,0.6)] transition-all duration-500 hover:scale-105 active:scale-95 hover:bg-[#188f47] lg:bottom-6 lg:right-6 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-[#1FA855]/40 [animation:pulse-ring_2.4s_ease-out_infinite]" />
      <svg viewBox="0 0 24 24" className="relative size-7 fill-current" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.41a9.86 9.86 0 0 0 4.68 1.19h.01c5.43 0 9.85-4.42 9.85-9.86S17.47 2 12.04 2Zm0 18.02h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.15 8.15 0 0 1-1.25-4.32c0-4.5 3.67-8.16 8.2-8.16a8.16 8.16 0 0 1 8.17 8.17c0 4.5-3.67 8.15-8.17 8.15Z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap bg-white px-3 py-2 text-[0.65rem] font-semibold text-navy shadow-lg group-hover:block">
        Chat with our team
      </span>
    </a>
  );
}
