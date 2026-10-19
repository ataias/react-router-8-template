import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  environments: {
    ssr: {
      build: {
        rolldownOptions: {
          input: "./server/app.ts",
        },
      },
    },
  },
  // reactRouter() already handles JSX and HMR, so only the compiler's Babel pass is added.
  plugins: [reactRouter(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    tsconfigPaths: true,
  },
});
