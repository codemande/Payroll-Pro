import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import "../../styles/accordion.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("accordion-item", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="accordion-header">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn("accordion-trigger", className)}
        {...props}
      >
        {children}
        <ChevronDown className="accordion-icon" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className="accordion-content"
      {...props}
    >
      <div className={cn("accordion-inner", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };