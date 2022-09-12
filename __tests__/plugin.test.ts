import { describe, expect, it } from "vitest";
import plugin from "../src/plugin";
import babel from "@babel/core";
import * as fs from "node:fs";
import * as path from "node:path";
import { format } from "prettier";

// Get test names from ./data directory
const testFileNames = Array.from(
  new Set(
    fs
      .readdirSync(path.join(__dirname, "data"))
      .map((fn) => fn.replace(/\.(input|output)\.js$/, "")),
  ),
);

// Grab test input/output data
const testData = testFileNames.reduce<Record<string, [string, string]>>(
  (acc, name) => {
    const input = fs.readFileSync(
      path.join(__dirname, "data", `${name}.input.js`),
      "utf-8",
    );
    const output = fs.readFileSync(
      path.join(__dirname, "data", `${name}.output.js`),
      "utf-8",
    );
    acc[name] = [input, output];
    return acc;
  },
  {},
);

/**
 * Transform code with plugin
 */
const transform = (code: string) => {
  const transformed = babel.transform(code, {
    filename: "foobar.ts",
    plugins: [plugin],
  });

  const output = transformed?.code || "";
  return output;
};

describe("babel-plugin", () => {
  it.each(Object.keys(testData))("Transforms %s appropriately", (key) => {
    expect(prettify(transform(testData[key][0]))).to.equal(
      prettify(testData[key][1]),
    );
  });
});

const prettify = (str: string) => format(str, { parser: "babel" });
