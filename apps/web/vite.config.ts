import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, "./404.html"), // 1️⃣
          dest: "./", // 2️⃣
        },
        {
          src: path.resolve(__dirname, "./CNAME"), // 1️⃣
          dest: "./", // 2️⃣
        },
      ],
    }),
    react(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
