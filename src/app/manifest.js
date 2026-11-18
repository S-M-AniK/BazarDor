export default function manifest() {
  return {
    name: "BazarDor",
    short_name: "BazarDor",
    description: "Daily grocery prices in Bangladesh, in Bangla",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f6fb",
    theme_color: "#2563eb",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}