import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

export default defineConfig({
  modules: [],
  vite: () => ({
    plugins: [react()],
    resolve: {
      alias: {
        "@": "./*",
      },
    },
  }),
  webExt: {
    startUrls: ["https://ecodeli.remythibaut.fr/"],
  },
  manifest: {
    name: "EcoDeli",
    description: "Extension Chrome pour EcoDeli",
    version: "1.0.0",
    permissions: ["activeTab", "storage", "scripting", "cookies"],
    host_permissions: [
      "http://localhost:3001/*",
      "https://localhost:3001/*",
      "https://app.ecodeli.remythibaut.fr/*",
    ],
    action: {
      default_popup: "popup.html",
      default_icon: {
        "48": "/icons/ecodeli_logo_48.png",
        "128": "/icons/ecodeli_logo_128.png",
        "256": "/icons/ecodeli_logo_256.png",
      },
    },
    icons: {
      "48": "/icons/ecodeli_logo_48.png",
      "128": "/icons/ecodeli_logo_128.png",
      "256": "/icons/ecodeli_logo_256.png",
    },
    web_accessible_resources: [
      {
        resources: ["*.html", "*.png", "fonts/*.ttf", "*.js", "*.css"],
        matches: ["https://*/*"],
      },
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
  },
});
