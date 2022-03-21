import { getPubSubClient } from "./pubsub-client";

describe("getPubSubClient", () => {
  it("should work", () => {
    expect("shared-pubsub").toEqual("shared-pubsub");
  });
});
