import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsPanel } from "@features/settings";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes";

describe("restrained application transitions", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("replaces route content without remounting primary navigation", () => {
    const { container } = render(
      <AppProviders>
        <MemoryRouter initialEntries={["/timer"]}>
          <AppRoutes />
        </MemoryRouter>
      </AppProviders>
    );
    const primaryNavigation = screen.getByRole("navigation", { name: "Primary navigation" });
    const timerContent = container.querySelector("[data-route-content]");

    fireEvent.click(screen.getAllByRole("link", { name: /History/i })[0]);

    const historyContent = container.querySelector("[data-route-content]");
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBe(primaryNavigation);
    expect(historyContent).not.toBe(timerContent);
    expect(historyContent.classList.contains("oc-content-enter")).toBe(true);
  });

  it("replaces settings tab content while keeping the dialog and tabs mounted", () => {
    const { container } = render(
      <AppProviders>
        <SettingsPanel onClose={vi.fn()} />
      </AppProviders>
    );
    const dialog = screen.getByRole("dialog", { name: "Settings" });
    const timerTab = screen.getByRole("tab", { name: "Timer" });
    const timerPanel = container.querySelector("[role='tabpanel']");
    const appearanceTab = screen.getByRole("tab", { name: "Appearance" });
    appearanceTab.focus();

    fireEvent.click(appearanceTab);

    const appearancePanel = container.querySelector("[role='tabpanel']");
    expect(screen.getByRole("dialog", { name: "Settings" })).toBe(dialog);
    expect(screen.getByRole("tab", { name: "Timer" })).toBe(timerTab);
    expect(document.activeElement).toBe(appearanceTab);
    expect(appearancePanel).not.toBe(timerPanel);
    expect(appearancePanel.classList.contains("oc-content-enter")).toBe(true);
    expect(appearancePanel.getAttribute("aria-labelledby")).toBe("settings-tab-appearance");
  });
});
