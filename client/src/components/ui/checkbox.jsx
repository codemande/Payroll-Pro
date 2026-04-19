import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import "../../styles/checkbox.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn("checkbox-root", className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="checkbox-indicator">
      <Check className="checkbox-icon" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };