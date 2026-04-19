import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import "../../styles/hover-card.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn("hover-card-content", className)}
      {...props}
    />
  )
);
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };