import React, { useState } from "react";
import { Input, Popover } from "antd";
import { SketchPicker } from "react-color";

const ColorPickerInput = ({ value = "#1890ff", onChange, disabled }) => {
  const [visible, setVisible] = useState(false);

  const handleColorChange = (color) => {
    onChange?.(color.hex);
  };

  const colorPreview = (
    <div
      style={{
        backgroundColor: value,
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: "1px solid #ccc",
        marginRight: 8,
      }}
    />
  );

  return (
    <Popover
      content={<SketchPicker color={value} onChangeComplete={handleColorChange} />}
      title="Pick a color"
      trigger="click"
      open={visible}
      onOpenChange={(v) => !disabled && setVisible(v)}
    >
      <Input
        readOnly
        disabled={disabled}
        style={{ width: 200, cursor: "pointer" }}
        value={value}
        prefix={colorPreview}
      />
    </Popover>
  );
};

export default ColorPickerInput;
