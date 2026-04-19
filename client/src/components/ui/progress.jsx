import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import "../../styles/progress.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("progress-root", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="progress-indicator"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };