import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, UserConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  base: "./",
  plugins: [dts({ rollupTypes: true, insertTypesEntry: true }), react()],
  resolve: {
    dedupe: ["react", "react-dom"], // Prevents multiple React instances
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyLib", // Global variable name for IIFE
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
} satisfies UserConfig);
