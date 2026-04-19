import * as React from "react";
import "../../styles/textarea.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn("textarea", className)}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };