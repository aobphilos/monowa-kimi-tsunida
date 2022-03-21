import { getMessage } from "./message";

describe("message", () => {
  it("should work", () => {
    expect(getMessage("test")).toMatch(/^lorem ipsum test/);
  });
});
