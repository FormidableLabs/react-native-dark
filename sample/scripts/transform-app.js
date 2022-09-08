const fs = require("node:fs/promises");
const path = require("node:path");
const babel = require("@babel/core");
const prettier = require("prettier");

const main = async () => {
  const AppContent = await fs.readFile(
    path.join(__dirname, "..", "App.tsx"),
    "utf-8",
  );

  const transformed = babel.transform(AppContent, {
    // presets: ["babel-preset-expo"],
    // plugins: ["react-native-dark/babel"],
    filename: "App.tsx",
  }).code;

  const formatted = prettier.format(transformed);

  await fs.writeFile(path.join(__dirname, "App.transformed.js"), formatted);
};

main();
