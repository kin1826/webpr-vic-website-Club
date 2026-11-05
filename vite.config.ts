import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (id.includes("/node_modules/three/")) return "three-core";
          if (id.includes("/node_modules/@react-three/drei/") || id.includes("/node_modules/three-stdlib/")) return "three-tools";
          if (id.includes("/node_modules/@react-three/") || id.includes("/node_modules/postprocessing/") || id.includes("/node_modules/maath/")) return "three-renderer";
        },
      },
    },
  },
});
