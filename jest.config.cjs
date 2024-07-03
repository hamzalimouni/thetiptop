module.exports = {
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".jsx", ".ts", ".tsx"],
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePaths: ["<rootDir>"],
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.tsx"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "node_modules/ts-jest-mock-import-meta", 
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|png|webp|svg|jpg|ttf|woff|woff2)$": "identity-obj-proxy"
  }
};
