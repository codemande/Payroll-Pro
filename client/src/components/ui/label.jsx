import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import "../../styles/label.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("label", className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };