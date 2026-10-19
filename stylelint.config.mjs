/** @type {import("stylelint").Config} */
const config = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["build/**", ".react-router/**"],
  overrides: [
    {
      // CSS Modules: classes are read as `styles.fooBar`, so use camelCase
      // instead of the standard config's kebab-case, and allow the
      // module-only :global/:local pseudo-classes and `composes`.
      files: ["**/*.module.css"],
      rules: {
        "selector-class-pattern": [
          "^[a-z][a-zA-Z0-9]*$",
          { message: (name) => `Expected class "${name}" to be camelCase` },
        ],
        "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global", "local"] }],
        "property-no-unknown": [true, { ignoreProperties: ["composes"] }],
      },
    },
  ],
};

export default config;
