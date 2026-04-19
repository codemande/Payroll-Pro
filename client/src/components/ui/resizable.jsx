import * as React from "react";
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import "../../styles/resizable.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ResizablePanelGroup = ({ className, ...props }) => (
  <ResizablePrimitive.PanelGroup
    className={cn("resizable-group", className)}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({ withHandle, className, ...props }) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn("resizable-handle", className)}
    {...props}
  >
    {withHandle && (
      <div className="resizable-handle-inner">
        <GripVertical className="resizable-handle-icon" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };