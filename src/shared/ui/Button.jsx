import { forwardRef } from "react";
import { buttonClass } from "./buttonClass";

export const Button = forwardRef(function Button({
  variant = "default",
  className = "",
  children,
  ...props
}, ref) {
  return (
    <button ref={ref} className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  );
});
