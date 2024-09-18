import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: path.resolve(__dirname, "./404.html"), dest: "./" },
        { src: path.resolve(__dirname, "./CNAME"), dest: "./" },
      ],
    }),
    react(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  // @ts-expect-error - Vite doesn't have a type for this I guess?
  test: {
    environment: "jsdom",
    testMatch: ["./tests/**/*.test.tsx"],
    globals: true,
  },
});
