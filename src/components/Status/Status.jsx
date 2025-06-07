import {
  Alert,
  Button,
  Col,
  ColorPicker,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  theme,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import MultiInput from "../MultiInput/MultiInput";
import { useDispatch, useSelector } from "react-redux";
import { createMaster, fetchMasterList } from "../../features/masterSlice";
import { generateCode } from "../../features/commonSlice";
import { motion, AnimatePresence } from "framer-motion";

const data = [
  {
    statusId: "#454254",
    statusName: "Open",
    status: true,
  },
  {
    statusId: "#454255",
    statusName: "Pending",
    status: true,
  },
  {
    statusId: "#454256",
    statusName: "Completed",
    status: true,
  },
  {
    statusId: "#454257",
    statusName: "Closed",
    status: true,
  },
];

export default function Status() {
  const dispatch = useDispatch();
  const { masterData, loading, error } = useSelector((state) => state.master);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [label, setLabel] = useState("Status");
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
        <Alert>{error.message}</Alert>;
        console.log("Something went wrong. Please try again later.");
      });
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setIsEdit(false);
    setEmails([]);
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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {dataIndex === "updatedOn" ? (
          <DatePicker
            onChange={(date, dateString) =>
              setSelectedKeys(dateString ? [dateString] : [])
            }
            value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
            style={{ marginBottom: 8, width: "100%" }}
          />
        ) : (
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
        )}
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
      dataIndex === "updatedOn"
        ? record[dataIndex]?.startsWith(value)
        : record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    render: (text) =>
      dataIndex === "updatedOn" ? (
        dayjs(text).format("YYYY-MM-DD")
      ) : searchedColumn === dataIndex ? (
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
      title: "Status ID",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
    },
    {
      title: "Status Name",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <Tag color={record.theme || "blue"}>{record.title}</Tag>
      ),
      ...getColumnSearchProps("title"),
    },
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
      key: "edit",
      width: "10%",
      render: (_, record) => (
        <Button
          onClick={() => handleEdit(record)}
          type="dashed"
          icon={<EditOutlined />}
        />
      ),
    },
  ];


  const handleEdit = (itm) => {
    console.log(itm);
    setOpen(true);
    setIsEdit(true);
    setButton("Update");

    form.setFieldsValue({
      statusName: itm.title,
      status: itm.status,
      theme: itm.theme,
    });

    setFormData(itm);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const newStatus = {
          code: formData.code,
          title: formData.title,
          label: label,
          theme: formData.theme,
          status: formData.status,
        };

        dispatch(createMaster(newStatus))
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
      <div className="row" style={{ paddingLeft: "10px" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          Create
        </Button>
        <Drawer
          title={
            !isEdit ? (
              `Create Status`
            ) : (
              <Tag color="blue" className="ticket-tag">
                {formData.code}
              </Tag>
            )
          }
          width={400}
          onClose={onClose}
          open={open}
          styles={{ body: { paddingBottom: 80 } }}
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
          <Form form={form} layout="vertical">
            <Row gutter={16} style={{ paddingLeft: '20px' }}>
              <Col span={24}>
                <Form.Item
                  name="statusName"
                  label={
                    <span>
                      Status Name <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  required={false}
                  rules={[
                    { required: true, message: "Please enter status name" },
                  ]}
                >
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                    }}
                    style={{ width: "300px" }}
                    placeholder="Enter category name"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingLeft: '20px' }}>
              <Col span={24}>
                <Form.Item
                  name="theme"
                  label={
                    <span>
                      Color <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  required={false}
                  rules={[
                    { required: true, message: "Please select the theme" },
                  ]}
                >
                  <ColorPicker
                    value={formData.theme}
                    onChange={(color) => {
                      const hex = color.toHexString();
                      setFormData({ ...formData, theme: hex });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingLeft: '20px' }}>
              <Col span={24}>
                <Form.Item name="status" label="Status" valuePropName="checked">
                  <Switch
                    value={formData.theme}
                    onChange={(checked) => {
                      setFormData({ ...formData, status: checked });
                    }}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
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
        rowKey="categoryId"
        pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) =>
              `${range[0]}–${range[1]} of ${total} items`,
            defaultPageSize: 8,
            position: ['bottomLeft']
          }}
           className="left-pagination"
        style={{ margin: "10px 5px" }}
      />
    </>
  );
}
