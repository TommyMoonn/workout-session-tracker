import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSettingsStorage } from "./createSettingsStorage";

describe("settings storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads fallbacks and persists normalized JSON settings", () => {
    const storage = createSettingsStorage({
      key: "test.settings",
      fallback: { count: 1 },
      normalize: (value) => ({
        count: Math.max(0, Math.floor(Number(value?.count) || 0)),
      }),
    });

    expect(storage.load()).toEqual({ count: 1 });

    storage.save({ count: 3.8 });

    expect(window.localStorage.getItem("test.settings")).toBe('{"count":3}');
    expect(storage.load()).toEqual({ count: 3 });
  });

  it("supports existing plain-string storage formats", () => {
    const storage = createSettingsStorage({
      key: "test.appearance",
      fallback: "system",
      normalize: (value) => ["system", "light", "dark"].includes(value) ? value : "system",
      parse: (raw) => raw,
      serialize: (value) => value,
    });

    storage.save("dark");

    expect(window.localStorage.getItem("test.appearance")).toBe("dark");
    expect(storage.load()).toBe("dark");
  });

  it("returns the fallback when persisted data cannot be parsed", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    window.localStorage.setItem("test.invalid", "{invalid");
    const storage = createSettingsStorage({
      key: "test.invalid",
      fallback: { enabled: true },
    });

    expect(storage.load()).toEqual({ enabled: true });
  });
});
