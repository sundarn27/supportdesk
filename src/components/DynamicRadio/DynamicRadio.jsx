import React, { useState } from "react";
import { Radio } from "antd";

export default function DynamicRadioColor() {
  const [color, setColor] = useState("#ff4d4f"); // red by default

  return (
    <div style={{ "--radio-color": color }}>
      <Radio.Group defaultValue="a" onChange={e => setColor(e.target.value)}>
        <Radio value="#ff4d4f">Red</Radio>
        <Radio value="#52c41a">Green</Radio>
        <Radio value="#1890ff">Blue</Radio>
      </Radio.Group>
      <p>Selected color: <span style={{ color }}>{color}</span></p>
    </div>
  );
}
