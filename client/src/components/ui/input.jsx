import * as React from "react";
import "../../styles/input.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn("input-field", className)}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };