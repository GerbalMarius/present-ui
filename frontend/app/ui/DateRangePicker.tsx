"use client";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_red.css";
import { useEffect, useMemo, useState } from "react";

type DateRange = [Date | null, Date | null];

type DatePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  disabled?: boolean;
};

const DateRangePicker = ({
  value,
  onChange,
  minDate = new Date(),
  disabled = false,
}: DatePickerProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mq: MediaQueryList = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const options = useMemo(
    () => ({
      mode: "range" as const,
      dateFormat: "Y-m-d",
      minDate,
      showMonths: isMobile ? 1 : 2,
      animate: true,
      position: "auto" as const,
    }),
    [minDate, isMobile]
  );

  return (
    <div className="w-full">
      <Flatpickr
        value={value.filter(Boolean) as Date[]}
        options={options}
        onChange={(dates: Date[]) => onChange([dates[0] ?? null, dates[1] ?? null])}
        disabled={disabled}
        placeholder="Select date to reserve the desks for"
        className="
          w-full
          rounded-2xl border border-red-200 bg-white shadow-sm
          px-4 py-3 sm:py-2
          text-base sm:text-sm
          focus:outline-none focus:ring-2 focus:ring-red-300
          cursor-pointer
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      />
    </div>
  );
}

export default DateRangePicker;