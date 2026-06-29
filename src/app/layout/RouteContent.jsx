import { ui } from "@shared/styles";

export function RouteContent({ children }) {
  return (
    <div className={ui.contentEnter} data-route-content>
      {children}
    </div>
  );
}
