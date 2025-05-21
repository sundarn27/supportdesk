import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Switch,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchMailData, insertMailData, sendMail } from "../../features/mailSlice";
import { motion, AnimatePresence } from "framer-motion";
import MultiInput from "../MultiInput/MultiInput";

export default function Email() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { mailData, loading, error } = useSelector((state) => state.mail);
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [formData, setFormData] = useState({
    fromId: "",
    password: "",
    confirmPassword: "",
    smtp: "",
    port: "",
    ssl: false,
    cc: [],
    bcc: [],
    toMail: [],
  });

  useEffect(() => {
    dispatch(fetchMailData());
  }, [dispatch]);

  useEffect(() => {
    if (mailData && typeof mailData === "object") {
      const newFormData = {
        fromId: mailData.fromId || "",
        password: mailData.password || "",
        confirmPassword: mailData.confirmPassword || "",
        smtp: mailData.smtp || "",
        port: mailData.port || "",
        ssl: !!mailData.ssl,
        cc: Array.isArray(mailData.cc) ? mailData.cc : [],
        bcc: Array.isArray(mailData.bcc) ? mailData.bcc : [],
        toMail: Array.isArray(mailData.toMail) ? mailData.toMail : [],
      };

      setFormData(newFormData);
      form.setFieldsValue(newFormData);
    }
  }, [mailData, form]);


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    try {
      const toMailValue = form.getFieldValue('toMail');
      if (!toMailValue || toMailValue.length === 0) {
        throw new Error("Please enter To Mail before sending");
      }

      const values = await form.validateFields(); 
      dispatch(sendMail(values))
        .then((response) => {
          const responseMessage = response.payload;
          if (responseMessage.toLowerCase().includes("successfully")) {
            setMessageVisible(true);
            setMessageType("success");
            setMessageContent(responseMessage);
            dispatch(fetchMailData());
            form.resetFields();
          } else {
            setMessageVisible(true);
            setMessageType("warning");
            setMessageContent(responseMessage);
          }
        })
        .catch(() => {
          notification.error({
            message: "Error",
            description: "Something went wrong. Please try again later.",
            placement: "topRight",
          });
        });
    } catch (error) {
      message.error(error.message || "Please fill all required fields.");
      setMessageVisible(true);
      setMessageType("error");
      setMessageContent(error.message || "Please fill all required fields.");
    }
  };

  const handleClear = () => {
    form.resetFields();
  }

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const newData = {
          fromId: formData.fromId,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          smtp: formData.smtp,
          port: formData.port,
          ssl: formData.ssl,
          cc: formData.cc,
          bcc: formData.bcc,
          toMail: formData.toMail,
        };
        console.log("Saving values:", newData);
        console.log("Form values:", formData);
        dispatch(insertMailData(newData))
          .then((response) => {
            const responseMessage = response.payload;
            if (responseMessage.toLowerCase().includes("successfully")) {
              setMessageVisible(true);
              setMessageType("success");
              setMessageContent(responseMessage);
              dispatch(fetchMailData());
              form.resetFields();
            } else {
              setMessageVisible(true);
              setMessageType("warning");
              setMessageContent(responseMessage);
            }
          })
          .catch(() => {
            notification.error({
              message: "Error",
              description: "Something went wrong. Please try again later.",
              placement: "topRight",
            });
          });
      })
      .catch((err) => {
        console.error("Validation Failed:", err);
        setMessageVisible(true);
        setMessageType("error");
        setMessageContent("Please fill all required fields.");
      });
  };

  return (
    <>
      <AnimatePresence>
        {messageVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              message={messageContent}
              type={messageType}
              showIcon
              closable
              onClose={() => setMessageVisible(false)}
              style={{ width: 315, position: 'absolute', left: '34%', top: '-5px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Space style={{ position: "absolute", right: 10 }}>
        <Button disabled={formData.fromId} onClick={handleClear}>Clear</Button>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </Space>

      <Form form={form} layout="vertical">
        <Row style={{ paddingTop: "40px" }}>
          <Col span={8}>
            <Form.Item
              name="fromId"
              label="From ID"
              rules={[{ required: true, message: "Please enter From ID" }]}
              style={{ width: 300 }}
            >
              <Input
                value={formData.fromId}
                onChange={(e) => handleInputChange("fromId", e.target.value)}
                placeholder="Enter From ID"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="smtp"
              label="SMTP"
              rules={[{ required: true, message: "Please enter SMTP" }]}
              style={{ width: 300 }}
            >
              <Input
                value={formData.smtp}
                onChange={(e) => handleInputChange("smtp", e.target.value)}
                placeholder="Enter SMTP"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="port"
              label="Port"
              rules={[{ required: true, message: "Please enter Port" }]}
              style={{ width: 300 }}
            >
              <Input
                value={formData.port}
                onChange={(e) => handleInputChange("port", e.target.value)}
                placeholder="Enter Port"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter Password" }]}
              style={{ width: 300 }}
            >
              <Input.Password
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter Password"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
              style={{ width: 300 }}
            >
              <Input.Password
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Enter Confirm Password"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="ssl"
              label="SSL"
              rules={[{ required: true, message: "Please enter SSL" }]}
              style={{ width: 100 }}
            >
              <Switch
                value={formData.ssl}
                onChange={(checked) => handleInputChange("ssl", checked)}
                checkedChildren="Yes"
                unCheckedChildren="No"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <Form.Item name="cc" label="CC" style={{ width: 300 }}>
              <MultiInput
                value={formData.cc}
                onChange={(emails) =>
                  setFormData((prev) => ({
                    ...prev,
                    cc: emails,
                  }))
                }
                placeholder="Enter CC"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="bcc" label="BCC" style={{ width: 300 }}>
              <MultiInput
                value={formData.bcc}
                onChange={(emails) =>
                  setFormData((prev) => ({
                    ...prev,
                    bcc: emails,
                  }))
                }
                placeholder="Enter BCC"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="toMail"
              label="To Mail"
              style={{ width: 300 }}
            >
              <MultiInput
                value={formData.toMail}
                onChange={(emails) =>
                  setFormData((prev) => ({
                    ...prev,
                    toMail: emails,
                  }))
                }
                placeholder="Enter To Mail"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Space style={{ position: "absolute", right: 75 }}>
        <Button type="primary" onClick={handleSend} icon={<SendOutlined />}>
          Send
        </Button>
      </Space>
    </>
  );
}
