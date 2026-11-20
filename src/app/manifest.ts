import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "JJ Ebube Enterprise",
    short_name: "JJ Ebube",
    description:
      "Shop quality food, drinks and household essentials from JJ Ebube Enterprise — retail, wholesale and bulk orders across Nigeria.",
    lang: "en-NG",
    dir: "ltr",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#f7f4ed",
    theme_color: "#071a3a",
    categories: ["shopping", "business", "food"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Shop all products",
        short_name: "Shop",
        description: "Browse the full JJ Ebube catalogue",
        url: "/shop",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Track an order",
        short_name: "Orders",
        description: "Look up an existing order",
        url: "/account",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Contact us",
        short_name: "Contact",
        description: "Call or WhatsApp the JJ Ebube team",
        url: "/contact",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
