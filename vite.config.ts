import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import { defineConfig as defineVitestConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import { visualizer } from "rollup-plugin-visualizer";

const viteConfig = defineViteConfig({
  plugins: [
    nodePolyfills(),
    react(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
  ],
  optimizeDeps: {
    include: ["immer"],
    needsInterop: ["@accordproject/template-engine"],
  },
  build: {
    // Reduce chunk size to avoid memory issues
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "styled-components", "antd", "@ant-design/icons"],
          accordproject: [
            "@accordproject/concerto-core",
            "@accordproject/markdown-common",
            "@accordproject/markdown-template",
            "@accordproject/markdown-transform",
            "@accordproject/template-engine",
          ],
        },
      },
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/utils/testing/setup.ts",
  },
});

export default mergeConfig(viteConfig, vitestConfig);
