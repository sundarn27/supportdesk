import {
  Alert,
  Avatar,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  notification,
  Row,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import MultiInput from "../MultiInput/MultiInput";
import { useDispatch, useSelector } from "react-redux";
import { createMaster, fetchMasterList } from "../../features/masterSlice";
import CustomMessage from "../CustomMessage/CustomMessage";
import { motion, AnimatePresence } from "framer-motion";
import { generateCode } from "../../features/commonSlice";
import { render } from "@testing-library/react";

const { Text, Title } = Typography;

export default function Departments() {
  const dispatch = useDispatch();
  const { masterData, loading, error } = useSelector((state) => state.master);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [label, setLabel] = useState("Department");
  const [formData, setFormData] = useState({
    label: label,
    code: "",
    title: "",
    parent: "",
    emails: [],
    theme: "",
    status: true,
  });
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [button, setButton] = useState("Submit");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchMasterList());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(masterData)) {
      var filteredDep = masterData.filter((i) => i.label === label);
      setDataSource(filteredDep);
    } else {
      setDataSource([]);
    }
    console.log(dataSource);
  }, [masterData]);

  const showDrawer = () => {
    form.resetFields();
    setEmails([]);
    setOpen(true);
    dispatch(generateCode(label))
      .then((response) => {
        console.log(response);
        setFormData((prev) => ({
          ...prev,
          code: response.payload,
        }));
      })
      .catch((error) => {
        console.log("Something went wrong. Please try again later.");
      });
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setEmails([]);
    setIsEdit(false);
  };

  const handleStatusChange = (newStatus, record, index) => {
    const newData = [...dataSource];
    newData[index] = { ...record, status: newStatus };
    setDataSource(newData);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleEdit = (itm) => {
    console.log(itm);
    setOpen(true);
    setIsEdit(true);
    setButton("Update");

    form.setFieldsValue({
      departmentName: itm.title,
      status: itm.status,
      emailId: itm.emails,
    });

    setFormData(itm);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Department ID",
      dataIndex: "code",
      key: "code",
      render: (text) => <a href="#">{text}</a>,
      ...getColumnSearchProps("code"),
    },
    {
      title: "Department Name",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
    },
    // {
    //   title: "Email ID",
    //   dataIndex: "emails",
    //   key: "emails",
    //   render: (emails = []) => {
    //     <>
    //       {emails.map((dt) => {
    //         return (
    //           <Avatar size="small" style={{ backgroundColor: "#bbb", fontSize: 12 }}>
    //             {dt.substring(0, 1).toUpperCase()}
    //           </Avatar>
    //         )
    //       })}

    //     </>
    //   },
    //   ...getColumnSearchProps("emails"),
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record, index) => (
        <Switch
          checked={record.status}
          onChange={(checked) => handleStatusChange(checked, record, index)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          disabled
        />
      ),
    },
    {
      title: <span style={{ fontSize: "12px", fontWeight: "bold" }}>EDIT</span>,
      dataIndex: "operation",
      width: "10%",
      render: (_, record) => (
        <Button
          onClick={() => handleEdit(record)}
          type="dashed"
          color="primary"
        >
          <EditOutlined />
        </Button>
      ),
    },
  ];

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const newDepartment = {
          code: formData.code,
          title: formData.title,
          label: label,
          emails: formData.emails,
          status: formData.status,
        };

        dispatch(createMaster(newDepartment))
          .then((response) => {
            const responseMessage = response.payload;
            if (responseMessage.toLowerCase().includes("successfully")) {
              setMessageVisible(true);
              setMessageType("success");
              setMessageContent(responseMessage);
              dispatch(fetchMasterList(label));
              // setIsEdit(false);
              // setButton("Submit");
              // form.resetFields();
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
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
        setMessageVisible(true);
        setMessageType("error");
        setMessageContent("Please fill all required fields.");
      });
  };

  useEffect(() => {
    if (messageVisible) {
      const timer = setTimeout(() => setMessageVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [messageVisible]);

  return (
    <>
      <div className="row" style={{ paddingLeft: 10 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          Create
        </Button>

        <Drawer
          title={
            !isEdit ? (
              `Create Department`
            ) : (
              <Tag color="blue" className="ticket-tag">
                {formData.code}
              </Tag>
            )
          }
          width={400}
          onClose={onClose}
          open={open}
          style={{ zIndex: 1000 }}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit} type="primary">
                {button}
              </Button>
            </Space>
          }
        >
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
                  style={{ marginBottom: "16px" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Form layout="vertical" form={form}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="departmentName"
                  label="Department Name"
                  rules={[
                    { required: true, message: "Please enter Department name" },
                  ]}
                >
                  <Input
                    style={{ width: "300px" }}
                    placeholder="Enter department name"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    disabled={isEdit}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="status" label="Status" valuePropName="checked">
                  <Switch
                    value={formData.status}
                    onChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: checked,
                      }))
                    }
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="emailId"
                  label="Email ID"
                  rules={[
                    {
                      required: true,
                      message: "Please enter at least one email",
                    },
                  ]}
                >
                  <MultiInput
                    value={formData.emails}
                    onChange={(emails) =>
                      setFormData((prev) => ({
                        ...prev,
                        emails,
                      }))
                    }
                    placeholder="Enter email"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="code"
        pagination={{ pageSize: 5 }}
        style={{ margin: "2px 5px", marginTop: "10px" }}
      />
    </>
  );
}

/**
 * Copyright (c) 2025 Sundar@Sudalai
 * All rights reserved.
 *
 * Description of what this file does:
 * - Manages department creation, updating, and listing in the app
 * - Handles form inputs and email displays with tooltips
 * - Utilizes Ant Design components for the UI
 */
