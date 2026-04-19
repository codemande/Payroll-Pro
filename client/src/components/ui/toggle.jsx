/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import "../../styles/toggle.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Toggle = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      "toggle-root",
      `variant-${variant}`,
      `size-${size}`,
      className
    )}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };