import { describe, expect, it } from "vitest";
import { appearanceStorageKey } from "../appearance";
import { shortcutStorageKey } from "../shortcuts";
import { soundSettingsStorageKey } from "../sound";
import { timerSettingsStorageKey } from "../timer";

describe("settings storage keys", () => {
  it("keeps existing browser data locations stable", () => {
    expect({
      appearanceStorageKey,
      shortcutStorageKey,
      soundSettingsStorageKey,
      timerSettingsStorageKey,
    }).toEqual({
      appearanceStorageKey: "liftlog-lite.appearance.v1",
      shortcutStorageKey: "liftlog-lite.shortcut-bindings.v1",
      soundSettingsStorageKey: "liftlog-lite.sound-settings.v1",
      timerSettingsStorageKey: "liftlog-lite.timer-settings.v1",
    });
  });
});
