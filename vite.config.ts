import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { run } from "happy-css-modules";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

// Writes a *.module.css.d.ts per CSS module so class names are type-checked, with a
// declaration map that sends go-to-definition into the CSS. `pnpm typecheck` runs the
// same generator once; this keeps the files current while the dev server runs.
function cssModuleTypings(): Plugin {
  let closeWatcher: (() => Promise<void>) | undefined;
  return {
    name: "css-module-typings",
    apply: "serve",
    async configureServer(server) {
      ({ close: closeWatcher } = await run({
        pattern: "**/*.module.css",
        cwd: path.join(server.config.root, "app"),
        watch: true,
        // On by default in the CLI but not in the API; the map is what points to the CSS.
        declarationMap: true,
        logLevel: "silent",
      }));
    },
    async closeBundle() {
      await closeWatcher?.();
      closeWatcher = undefined;
    },
  };
}

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
  plugins: [reactRouter(), babel({ presets: [reactCompilerPreset()] }), cssModuleTypings()],
  resolve: {
    tsconfigPaths: true,
  },
});
