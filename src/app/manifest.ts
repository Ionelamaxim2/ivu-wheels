import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IVU Wheels - Premium Custom Rims & Wheels",
    short_name: "IVU Wheels",
    description:
      "Discover premium custom rims and wheels that define your drive. Shop Performance, Modular, and Flow collections with free shipping.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
