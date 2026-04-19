import * as React from "react";
import "../../styles/badge.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ className, variant = "default", ...props }) {
  return (
    <div 
      className={cn("badge", `badge-${variant}`, className)} 
      {...props} 
    />
  );
}

export { Badge };