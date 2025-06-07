import {
  Alert,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
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

export default function Categories() {
  const dispatch = useDispatch();
  const { masterData, loading, error } = useSelector((state) => state.master);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [label, setLabel] = useState("Category");
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
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    dispatch(fetchMasterList());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(masterData)) {
      var filteredDep = masterData.filter((i) => i.label === "Department");
      setDepartments(filteredDep);
    } else {
      setDepartments([]);
    }
    console.log(departments);
  }, [masterData]);

  useEffect(() => {
    if (Array.isArray(masterData)) {
      var filteredCat = masterData.filter((i) => i.label === label);
      filteredCat = filteredCat.map((j) => {
        return {
          ...j,
          parent: titleByCode(j.parent) ?? "",
        };
      });
      console.log(filteredCat);
      setDataSource(filteredCat);
    } else {
      setDataSource([]);
    }
    console.log(dataSource);
  }, [masterData]);

  const titleByCode = (code) => {
    if (code) {
      const item = masterData.find((i) => i.code === code);
      return item?.title || "";
    }
    return "";
  };

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
      title: "Category ID",
      dataIndex: "code",
      key: "code",
      render: (text) => <a href="#">{text}</a>,
      ...getColumnSearchProps("code"),
    },
    {
      title: "Category Name",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Department Name",
      dataIndex: "parent",
      key: "parent",
      ...getColumnSearchProps("parent"),
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

  const handleEdit = (itm) => {
    console.log(itm);
    setOpen(true);
    setIsEdit(true);
    setButton("Update");

    form.setFieldsValue({
      categoryName: itm.title,
      status: itm.status,
      departmentName: itm.parent,
    });

    setFormData(itm);
  };

  const handleSubmit = () => {
    console.log(formData);
    form
      .validateFields()
      .then((values) => {
        const newCategory = {
          code: formData.code,
          title: formData.title,
          label: label,
          parent: formData.parent,
          status: formData.status,
        };

        dispatch(createMaster(newCategory))
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
              `Create Category`
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
                  name="categoryName"
                  label={
                    <span>
                      Category Name <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  required={false}
                  rules={[
                    { required: true, message: "Please enter category name" },
                  ]}
                >
                  <Input
                    id="categoryName"
                    placeholder="Enter category name"
                    style={{ width: 300 }}
                    value={formData?.title}
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
            <Row gutter={16} style={{ paddingLeft: '20px' }}>
              <Col span={24}>
                <Form.Item
                  name="departmentName"
                  label={
                    <span>
                      Department Name <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  required={false}
                  rules={[
                    { required: true, message: "Please enter department" },
                  ]}
                >
                  <Select
                    style={{ width: 300 }}
                    options={departments.map((i) => ({
                      value: i.code,
                      label: i.title,
                    }))}
                    value={formData?.parent}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        parent: value,
                      }))
                    }
                    placeholder="Select a department"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingLeft: '20px' }}>
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
          </Form>
        </Drawer>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="categoryId"
        style={{ margin: "10px 5px" }}
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
      />
    </>
  );
}
