import { buttonClass } from "./buttonClass";

export function Button({ variant = "default", className = "", children, ...props }) {
  return (
    <button className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  );
}
