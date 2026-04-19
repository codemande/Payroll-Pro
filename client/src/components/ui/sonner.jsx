/* eslint-disable react-refresh/only-export-components */
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

import "../../styles/toaster.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className={cn("toaster", "group")}
      toastOptions={{
        classNames: {
          toast: "sonner-toast",
          description: "sonner-description",
          actionButton: "sonner-action-button",
          cancelButton: "sonner-cancel-button",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };