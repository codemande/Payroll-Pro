/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import "../../styles/button.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const buttonVariants = ({ variant = "default", size = "default", className = "" } = {}) => {
  return cn("btn", `btn-${variant}`, `btn-${size}`, className);
};

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp 
        className={buttonVariants({ variant, size, className })} 
        ref={ref} 
        {...props} 
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };