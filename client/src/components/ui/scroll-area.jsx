import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import "../../styles/scroll-area.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root 
    ref={ref} 
    className={cn("scroll-area-root", className)} 
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="scroll-area-viewport">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "scroll-bar",
      orientation === "vertical" ? "scroll-bar-vertical" : "scroll-bar-horizontal",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="scroll-thumb" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };