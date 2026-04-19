import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import "../../styles/toggle-group.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("toggle-group-root", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  const itemVariant = context.variant || variant || "default";
  const itemSize = context.size || size || "default";

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        "toggle-group-item",
        `variant-${itemVariant}`,
        `size-${itemSize}`,
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };