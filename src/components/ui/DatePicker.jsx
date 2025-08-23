import React from "react";
import { DatePicker } from "antd";
import moment from "moment";

export const DatePickerControlledDemo = ({ value, onChange }) => {
  const handleChange = (date) => {
    if (onChange) onChange(date ? date.toDate() : null);
  };

  return (
    <DatePicker
      showTime
      value={value ? moment(value) : null}
      onChange={handleChange}
      className="w-full rounded-lg"
      placeholder="Select date & time"
    />
  );
};
