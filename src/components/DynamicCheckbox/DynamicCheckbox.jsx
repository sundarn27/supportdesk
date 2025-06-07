import React from "react";
import { Checkbox } from "antd";

const DynamicCheckbox = ({
  label,
  checked,
  onChange,
  checkedColor = "#52c41a",
  uncheckedColor = "#d9d9d9"
}) => {
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      style={{
        color: checked ? checkedColor : "#000",
        accentColor: checked ? checkedColor : uncheckedColor,
      }}
    >
      {label}
    </Checkbox>
  );
};

export default DynamicCheckbox;
