import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FICSM 2026 | Festival Internacional de la Costa del Seno Mexicano",
    short_name: "FICSM 2026",
    description:
      "Programación del Festival Internacional de la Costa del Seno Mexicano, del ITCA.",
    start_url: "/festival",
    display: "standalone",
    background_color: "#f7f6f3",
    theme_color: "#7645af",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
