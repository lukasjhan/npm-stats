// app/components/DatePicker.tsx
"use client";

import { useAppContext } from "@/context/AppContext";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker() {
  const { startDate, setStartDate } = useAppContext();

  return (
    <div className="mb-8">
      <label className="block mb-2">Start Date:</label>
      <ReactDatePicker selected={startDate} onChange={(date) => date && setStartDate(date)} className="border border-gray-300 rounded-md p-2" />
    </div>
  );
}
