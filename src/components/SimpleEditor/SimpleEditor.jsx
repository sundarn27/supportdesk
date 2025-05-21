// SimpleEditor.jsx
import React from 'react';
import { Input, Select, Button, Space, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  BgColorsOutlined,
  FontColorsOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const boilerplateOptions = [
  {
    label: "Thank You Response",
    value: "Thanks for reaching out. We will respond shortly.",
  },
  {
    label: "Request More Info",
    value: "Please provide more details regarding your issue.",
  },
];

const SimpleEditor = ({ value = '', onChange }) => {
  const handleBoilerplateSelect = (text) => {
    const newText = value ? `${value}\n${text}` : text;
    onChange?.(newText); // append text safely
  };

  const handleTextChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <>
      <Space style={{ marginBottom: 8 }} wrap>
        {/* These are just visual buttons — add handlers if needed */}
        <Tooltip title="Bold">
          <Button icon={<BoldOutlined />} />
        </Tooltip>
        <Tooltip title="Italic">
          <Button icon={<ItalicOutlined />} />
        </Tooltip>
        <Tooltip title="Underline">
          <Button icon={<UnderlineOutlined />} />
        </Tooltip>
        <Tooltip title="Text Color">
          <Button icon={<FontColorsOutlined />} />
        </Tooltip>
        <Tooltip title="Highlight">
          <Button icon={<BgColorsOutlined />} />
        </Tooltip>

        <Select
          placeholder="Choose Boilerplate Response"
          style={{ width: 250 }}
          onChange={handleBoilerplateSelect}
          allowClear
        >
          {boilerplateOptions.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Space>

      <TextArea
        rows={11}
        value={value}
        onChange={handleTextChange}
        placeholder="Enter description..."
      />
    </>
  );
};

export default SimpleEditor;
