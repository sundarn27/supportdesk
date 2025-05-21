import React from "react";
import { message } from "antd";
import {
  CloseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

// Simplified message to debug
const CustomMessage = {
  show: (msg, type = "info") => {
    const key = `customMessage-${Date.now()}`; // Unique key for each message

    const iconMap = {
      success: <CheckCircleOutlined style={{ color: "green" }} />,
      error: <CloseCircleOutlined style={{ color: "red" }} />,
      warning: <ExclamationCircleOutlined style={{ color: "yellow" }} />,
    };

    // Ensure the z-index is high enough to show above the drawer
    message.open({
      key,
      icon: iconMap[type] || null,
      content: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span style={{ position: "relative", bottom: "1px" }}>{msg}</span>
          <CloseOutlined
            onClick={() => message.destroy(key)} // Close button to destroy the message
            style={{ cursor: "pointer", marginLeft: 10 }}
          />
        </div>
      ),
      duration: 0, // Keep the message open until closed manually
      type,
      style: {
        zIndex: 1050, // Ensure the message appears above the Drawer
      },
    });
  },

  success: (msg) => CustomMessage.show(msg, "success"),
  error: (msg) => CustomMessage.show(msg, "error"),
  warning: (msg) => CustomMessage.show(msg, "warning"),
};


export default CustomMessage;

