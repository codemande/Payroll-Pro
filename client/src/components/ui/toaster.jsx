import { useToast } from "../../hooks/useToast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

import "../../styles/toasterr.css";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="toast-text-wrapper">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>

          {action}
          <ToastClose />
        </Toast>
      ))}

      <ToastViewport />
    </ToastProvider>
  );
}