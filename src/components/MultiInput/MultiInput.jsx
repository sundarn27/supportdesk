import React, { useState } from "react";
import { Input, Tag, Avatar, message, Typography, Button, Popconfirm } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

const MultiInput = ({ value = [], onChange, placeholder = "Add email" }) => {
  const [input, setInput] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [message, setMessage] = useState("");
  // const [messageApi, contextHolder] = message.useMessage();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAdd = () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    if (!isValidEmail(trimmed)) {
      setMessageVisible(true);
      setMessage("Please enter a valid email address.");
    } else if (value.includes(trimmed)) {
      setMessageVisible(true);
      setMessage("This email is already added.");
    } else {
      setMessageVisible(false);
      onChange([...value, trimmed]);
      setInput("");
    }

    // setInput("");
  };

  const confirm = (email) => {
    console.log(email);
    onChange(value.filter((item) => item !== email));
  };
  const cancel = e => {
    console.log(e);
  };
  const avatarColors = ["#999", "#1890ff", "#f56a00", "#7265e6", "#00a2ae"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* {contextHolder} */}

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={handleAdd}
        onBlur={handleAdd}
        placeholder={placeholder}
        style={{ width: 300 }}
        suffix={<PlusOutlined onClick={handleAdd} />}
      />
      {messageVisible && (
        <Typography.Text type="danger">{message}</Typography.Text>
      )}


      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {value.map((item, index) => (
          <Tag
            key={item}
            // closable
            // onClose={() => handleRemove(item)}
            style={{ padding: "2px 6px", display: "flex", alignItems: "center" }}
          >
            <Avatar
              size={16}
              style={{ backgroundColor: avatarColors[index % avatarColors.length], fontSize: 10, marginRight: 4 }}
            >
              {item[0]?.toUpperCase()}
            </Avatar>
            {item}
            <Popconfirm
              title="Delete the task"
              description="Are you sure to remove this mail?"
              onConfirm={() => confirm(item)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" style={{fontSize:'10px',marginLeft:'5px'}} color="danger" variant="text">
                <CloseOutlined />
              </Button>
            </Popconfirm>
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default MultiInput;
