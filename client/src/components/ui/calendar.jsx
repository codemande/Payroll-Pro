import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import "../../styles/calendar.css";
import { buttonVariants } from "./button";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("calendar-container", className)}
      classNames={{
        months: "calendar-months",
        month: "calendar-month",
        caption: "calendar-caption",
        caption_label: "calendar-caption-label",
        nav: "calendar-nav",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "calendar-nav-button"
        ),
        nav_button_previous: "calendar-nav-prev",
        nav_button_next: "calendar-nav-next",
        table: "calendar-table",
        head_row: "calendar-head-row",
        head_cell: "calendar-head-cell",
        row: "calendar-row",
        cell: "calendar-cell",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "calendar-day"
        ),
        day_range_end: "day-range-end",
        day_selected: "calendar-day-selected",
        day_today: "calendar-day-today",
        day_outside: "calendar-day-outside",
        day_disabled: "calendar-day-disabled",
        day_range_middle: "calendar-day-range-middle",
        day_hidden: "calendar-day-hidden",
        ...classNames,
      }}
      components={{
        IconLeft: (props) => <ChevronLeft className="calendar-nav-icon" {...props} />,
        IconRight: (props) => <ChevronRight className="calendar-nav-icon" {...props} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };