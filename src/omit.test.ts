import { describe, it, expect } from "vitest";
import { omit } from "./omit";

describe("omit", () => {
  it("omits key from object", () => {
    expect(omit({ foo: 1, bar: 2, baz: 3 }, "bar")).toEqual({ foo: 1, baz: 3 });
    expect(omit({ foo: 1, bar: 2, baz: 3 }, "baz")).toEqual({ foo: 1, bar: 2 });
  });
});
