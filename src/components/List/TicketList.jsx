import React, { useEffect, useRef, useState } from "react";
import {
  List,
  Avatar,
  Button,
  Tooltip,
  Typography,
  Space,
  Tag,
  Table,
  DatePicker,
  Input,
  Row,
  Col,
  Form,
  Drawer,
  Select,
  message,
  Upload,
  Alert,
  notification,
} from "antd";
import {
  MailOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  EllipsisOutlined,
  SearchOutlined,
  PoweroffOutlined,
  SyncOutlined,
  PlusOutlined,
  InboxOutlined,
  EditOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import tickets from "../../tickets.json";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Highlighter from "react-highlight-words";
import SimpleEditor from "../SimpleEditor/SimpleEditor";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, fetchTicketList } from "../../features/ticketSlice";
import { generateCode } from "../../features/commonSlice";
import { setFiles } from "@testing-library/user-event/dist/cjs/utils/index.js";
import { comment } from "stylis";
import { motion, AnimatePresence } from "framer-motion";
import duration from "dayjs/plugin/duration";
import EditTicket from "../EditTicket/EditTicket";
import { fetchMasterList } from "../../features/masterSlice";
import { useParams } from "react-router-dom";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
const { Dragger } = Upload;
const style = { background: "#0092ff", padding: "8px 0" };

const data = tickets;
const { Text, Title } = Typography;
const prData = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];
export default function TicketList() {
  const { prm } = useParams();
  const dispatch = useDispatch();
  const fileListRef = useRef([]);
  const { masterData } = useSelector((state) => state.master);
  const { ticketData, loading, error } = useSelector((state) => state.ticket);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const parseDate = (date) => dayjs(date);
  const statusMaster = ["Open", "Closed", "Pending"];
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState(dataSource);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [label, setLabel] = useState("Ticket");
  const [formData, setFormData] = useState({
    ticketId: "",
    subject: "",
    description: "",
    department: "",
    category: "",
    piriority: "",
    status: "Open",
    requester: "",
    comments: [
      { name: "", email: "", comment: "", attchments: [], updatedOn: null },
    ],
  });
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [button, setButton] = useState("Submit");
  const [isEdit, setIsEdit] = useState(false);
  const [isEditTicket, setIsEditTicket] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filesNameLst, setFilesNameLst] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [status, setStatus] = useState([]);
  const [openn, setOpenn] = useState(null);
  const [pending, setPending] = useState(null);
  const [closed, setClosed] = useState(null);
  const [clf, setClf] = useState(null);
  const [complete, setComplete] = useState(null);

  useEffect(() => {
    dispatch(fetchMasterList());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(masterData)) {
      var filteredDep = masterData.filter((i) => i.label === "Department" && i.status === true);
      setDepartments(filteredDep)
    } else {
      setDepartments([]);
    }
    console.log(departments);
  }, [masterData]);

  useEffect(() => {
    if (Array.isArray(masterData)) {
      const filteredCategories = masterData.filter(
        (item) => item.label === "Category" && item.status === true
      );
      setAllCategories(filteredCategories);
    } else {
      setAllCategories([]);
    }
    console.log("masterData:", masterData);
    console.log("dataSource:", dataSource);
  }, [masterData]);

  const titleByCode = (code) => {
    if (code) {
      const item = masterData.find((i) => i.code === code);
      return item?.title || "";
    }
    return "";
  };

  const codeByTitle = (title) => {
    if (title) {
      const item = masterData.find((i) => i.code === title);
      return item?.code || "";
    }
    return "";
  };
  const themeByStatus = (sts) => {
    if (sts) {
      const item = masterData.find((i) => i.title === sts);
      return item?.theme || "";
    }
    return "";
  };
  const codeByStatus = (sts) => {
    if (sts) {
      const item = masterData.find((i) => i.title === sts);
      return item?.code || "";
    }
    return "";
  };

  useEffect(() => {
    if (Array.isArray(masterData)) {
      var filteredSts = masterData.filter((i) => i.label === "Status" && i.status === true);
      var filteredOpen = filteredSts.filter((i) => i.title === "Open");
      console.log(filteredOpen)
      setStatus(filteredOpen[0]?.code);
      setStatuses(filteredSts);
      console.log(status)
    } else {
      setStatuses([]);
    }
  }, [masterData]);

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {


      console.log("Uploading file:", file);

      setTimeout(() => {
        onSuccess("ok");
        message.success(`${file.name} uploaded successfully`);
      }, 1000);
    } catch (err) {
      console.error(err);
      onError(err);
      message.error(`${file.name} upload failed`);
    }
  };

  useEffect(() => {
    dispatch(fetchTicketList());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(ticketData)) {
      const withKeys = ticketData.map((item) => ({
        ...item,
        key: item.ticketId,
        // department: titleByCode(item.department),
        // category: titleByCode(item.category),
        // status: titleByCode(item.status),
      }));
      console.log(withKeys)
      const sortedData = withKeys.sort((a, b) =>
        dayjs.utc(b.updatedOn).valueOf() - dayjs.utc(a.updatedOn).valueOf()
      );
      console.log(sortedData)
      setDataSource(sortedData);
    } else {
      setDataSource([]);
    }
  }, [ticketData]);

  useEffect(() => {
    if (masterData.length && dataSource.length) {
      setOpenn(dataSource.filter(i => i.status === codeByStatus("Open")).length);
      setPending(dataSource.filter(i => i.status === codeByStatus("Pending")).length);
      setClf(dataSource.filter(i => i.status === codeByStatus("Clarification")).length);
      setComplete(dataSource.filter(i => i.status === codeByStatus("Completed")).length);
      setClosed(dataSource.filter(i => i.status === codeByStatus("Closed")).length);
      console.log("Open:", openn, "Pending:", pending, "Clarification:", clf, "Completed:", complete, "Closed:", closed);
    }
  }, [masterData, dataSource]);


  const showDrawer = () => {
    setOpen(true);
    dispatch(generateCode(label))
      .then((response) => {
        console.log(response);
        setFormData((prev) => ({
          ...prev,
          ticketId: response.payload,
          department: "",
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
    setMessageVisible(false);
  };

  const searchInput = useRef(null);
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
            value={selectedKeys[0] ? dayjs.utc(selectedKeys[0]) : null}
            style={{ marginBottom: 8, display: "block", width: "100%" }}
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
    onFilter: (value, record) => {
      if (dataIndex === "updatedOn") {
        return record[dataIndex] ? record[dataIndex].startsWith(value) : false;
      }
      return record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    render: (text) =>
      dataIndex === "updatedOn" ? (
        dayjs.utc(text).format("YYYY-MM-DD")
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
      title: "Ticket ID",
      dataIndex: "ticketId",
      key: "ticketId",
      render: (text) => <a href="#">{text}</a>,
      ...getColumnSearchProps("ticketId"),
      width: "10%",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: "30%",
      ...getColumnSearchProps("subject"),
    },
    Table.EXPAND_COLUMN,
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      ...getColumnSearchProps("department"),
      render: (code) => {
        const item = departments.find((i) => i.code === code);
        return item?.title || code;
      }
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      ...getColumnSearchProps("category"),
      render: (code) => {
        const item = allCategories.find((i) => i.code === code);
        return item?.title || code;
      },
      width: '15%'
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      // filters: statusMaster.map((status) => ({
      //   text: status,
      //   value: status,
      // })),
      // onFilter: (value, record) => record.status === value,
      render: (status) => {
        const item = statuses.find((i) => i.code === status);
        return (
          <Tag color={themeByStatus(item?.title || status)}>
            {item?.title || status}
          </Tag>
        );
      }
    },
    {
      title: "Created Date",
      dataIndex: "createdOn",
      key: "createdOn",
      width: "10%",
      sorter: (a, b) =>
        parseDate(a.createdOn).valueOf() - parseDate(b.createdOn).valueOf(),
      sortDirections: ["descend", "ascend"],
      render: (text) =>
        dayjs.utc(text).format("DD-MM-YYYY hh:mm A"),
    },
    // {
    //   title: "Time Spent",
    //   key: "timeSpent",
    //   width: "10%",
    //   render: (record) => {
    //     if (!record.createdOn || !record.updatedOn) return "-";

    //     const created = dayjs(record.createdOn);
    //     const updated = dayjs(record.updatedOn);

    //     const diff = dayjs.duration(updated.diff(created));

    //     const days = diff.days();
    //     const hours = diff.hours();
    //     const minutes = diff.minutes();

    //     return `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m`;
    //   },
    // },
    {
      title: <span style={{ fontSize: "12px", marginLeft: "25%" }}>Actions</span>,
      dataIndex: "operation",
      width: "10%",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            type="text"
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleView(record);
            }}
            type="text"
          >
            <EyeOutlined />
          </Button>
        </div>
      )
    },
  ];

  const handleEdit = (itm) => {
    console.log("EDIT:", itm);
    setEditingTicket({ ...itm, mode: "edit" });
  };

  const handleView = (itm) => {
    console.log("VIEW:", itm);
    setEditingTicket({ ...itm, mode: "view" });
  };

  const handleClose = () => {
    setEditingTicket(null);
  };
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const newTicket = {
          ticketId: formData.ticketId,
          subject: formData.subject,
          description: formData.description,
          department: formData.department,
          category: formData.category,
          piriority: formData.piriority,
          status: status,
          requester: "sudalai@codasol.com",
          updatedBy: [
            {
              name: "Sudalai S",
              email: "sudalai@codasol.com",
              comments: formData.description,
              attchments: filesNameLst,
              updatedOn: new Date(),
            },
          ],
          createdOn: new Date(),
          updatedOn: new Date(),
        };

        console.log(newTicket);

        dispatch(createTicket({ data: newTicket, files: uploadedFiles }))
          .then((response) => {
            const responseMessage = response.payload;
            if (responseMessage.toLowerCase().includes("successfully")) {
              setMessageVisible(true);
              setMessageType("success");
              setMessageContent(responseMessage);
              dispatch(fetchTicketList());
              setIsEdit(false);
              setButton("Submit");
              form.resetFields();
              setFileList([]);
              dispatch(generateCode(label))
                .then((response) => {
                  console.log(response);
                  setFormData((prev) => ({
                    ...prev,
                    ticketId: response.payload,
                    department: "",
                  }));
                })
                .catch((error) => {
                  <Alert>{error.message}</Alert>;
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
    let filtered = dataSource;

    if (activeStatus !== "All") {
      filtered = filtered.filter((t) => t.status === activeFilter);
    }

    if (prm?.trim()) {
      const searchTerm = prm.toLowerCase();
      filtered = filtered.filter((t) =>
        (t.ticketId && t.ticketId.toLowerCase().includes(searchTerm)) ||
        (t.subject && t.subject.toLowerCase().includes(searchTerm)) ||
        (t.department && t.department.toLowerCase().includes(searchTerm)) ||
        (t.category && t.category.toLowerCase().includes(searchTerm)) ||
        (t.status && t.status.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredTickets(filtered);
  }, [dataSource, activeFilter, prm]);


  const handleFilter = (status) => {
    setActiveStatus(status);
    setActiveFilter(codeByStatus(status));
  };

  const handleDepartment = (val) => {
    console.log("Selected department value:", val);

    setFormData((prev) => ({
      ...prev,
      department: val,
      category: "",
    }));

    form.setFieldValue('category', '');

    const parentTitle = codeByTitle(val);
    console.log("Parent Title:", parentTitle);

    const filteredCat = allCategories.filter(
      (item) => item.parent === parentTitle
    );

    console.log("Filtered categories for department:", filteredCat);
    setCategories(filteredCat);
  };

  useEffect(() => {
    let timer;
    if (messageVisible) {
      timer = setTimeout(() => {
        setMessageVisible(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [messageVisible]);

  return (
    <>
      {editingTicket && (
        <EditTicket
          isEdit={editingTicket.mode === "edit"}
          singleData={editingTicket}
          onClose={handleClose}
        />
      )}
      <div>
        <div className="row" style={{ marginTop: "20px", paddingLeft: "10px" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
            Create
          </Button>
          <Space
            size="large"
            style={{
              fontSize: 14,
              fontWeight: 500,
              position: "absolute",
              right: "20px",
            }}
          >
            <Space wrap>
              {["Open", "Clarification", "Completed", "Closed", "Pending", "All"].map((status) => (
                <div key={status} style={{ position: "relative", display: "inline-block" }}>
                  {/* Close Button (if needed) */}
                  {(activeStatus !== 'All' && activeStatus === status) && <div className="close-btn" >
                    <Button
                      size="small"
                      type="text"
                      danger
                      icon={<CloseCircleOutlined />}
                    onClick={() => handleFilter("All")} 
                    />
                  </div>
                  }
                  {/* Status Button */}
                  <Button
                    onClick={() => handleFilter(status)}
                    className={`status-btn ${status.toLowerCase()} ${activeStatus === status ? "active" : ""}`}
                  >
                    <Text strong>{status}</Text>
                    <Text style={{ marginLeft: 6 }}>
                      {status === "Open"
                        ? openn
                        : status === "Clarification"
                          ? clf
                          : status === "Completed"
                            ? complete
                            : status === "Closed"
                              ? closed
                              : status === "Pending"
                                ? pending
                                : dataSource.length}
                    </Text>
                  </Button>
                </div>
              ))}
            </Space>

          </Space>
          <Drawer
            title="Create Ticket"
            width={720}
            onClose={onClose}
            open={open}
            styles={{ body: { paddingBottom: 80 } }}
            extra={
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            <AnimatePresence>
              {messageVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    message={messageContent}
                    type={messageType}
                    showIcon
                    closable
                    onClose={() => setMessageVisible(false)}
                    style={{ position: 'absolute', top: '10px', left: '33%', zIndex: '100', justifyContent: 'center' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Form form={form} layout="vertical">
              <Row style={{ paddingLeft: '20px' }}>
                <Col span={24}>
                  <Form.Item
                    name="subject"
                    label={
                      <span>
                        Subject <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required={false}
                    rules={[
                      { required: true, message: "Please enter subject" },
                    ]}
                  >
                    <Input
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                      }}
                      placeholder="Enter subject"
                      maxLength={120}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '20px' }}>
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Form.Item
                    name="department"
                    label={
                      <span>
                        Dapartment <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required={false}
                    rules={[
                      { required: true, message: "Please enter Dapartment" },
                    ]}
                  >
                    <Select
                      value={formData.department}
                      onChange={(value) => handleDepartment(value)}
                      placeholder="Selct department"
                      options={departments.map((i) => {
                        return {
                          value: i.code,
                          label: i.title,
                        };
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ paddingLeft: "10px" }}>
                  <Form.Item
                    name="category"
                    label={
                      <span>
                        Category <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required={false}
                    rules={[
                      { required: true, message: "Please enter category" },
                    ]}
                  >
                    <Select
                      value={formData.category}
                      onChange={(value) => {
                        setFormData({ ...formData, category: value });
                      }}
                      placeholder="Selct category"
                      options={categories.map((i) => {
                        return {
                          value: i.code,
                          label: i.title,
                        };
                      })}
                      disabled={!formData?.department?.trim()}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '20px' }}>
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Form.Item
                    name="priority"
                    label={
                      <span>
                        Priority <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required={false}
                    rules={[
                      { required: true, message: "Please enter priority" },
                    ]}
                  >
                    <Select
                      value={formData.piriority}
                      onChange={(value) => {
                        setFormData({ ...formData, piriority: value });
                      }}
                      options={prData}
                      placeholder="Selct priority"
                    />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ paddingLeft: "10px" }}>
                  <Form.Item name="status" label="Status">
                    <Select
                      defaultValue={"Open"}
                      disabled
                      placeholder="Selct status"
                      options={statuses.map((i) => {
                        return {
                          value: i.code,
                          label: i.title,
                        };
                      })}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row style={{ paddingLeft: '20px' }}>
                <Col span={24}>
                  {" "}
                  <Form.Item
                    name="description"
                    label={
                      <span>
                        Description <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required={false}
                    rules={[
                      { required: true, message: "Please enter description" },
                    ]}
                  >
                    <TextArea
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        });
                      }}
                      rows={4}
                      placeholder="Enter description..."
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '20px' }}>
                <Col span={24}>
                  <Form.Item name="attchment" label="Attchment">
                    <Dragger
                      name="file"
                      multiple
                      customRequest={handleCustomUpload}
                      fileList={fileList}
                      beforeUpload={(file) => {
                        const isDuplicate = fileListRef.current.some(
                          (f) => f.name === file.name && f.size === file.size
                        );
                        if (isDuplicate) {
                          setMessageContent(`${file.name} is already added.`);
                          setMessageType("warning");
                          setMessageVisible(true)
                          message.warning();
                          return Upload.LIST_IGNORE;
                        }

                        const isLt5MB = file.size / 1024 / 1024 < 5;
                        if (!isLt5MB) {
                          setMessageContent(`${file.name} is larger than 5MB.`);
                          setMessageType("warning");
                          setMessageVisible(true)
                          message.error(`${file.name} is larger than 5MB.`);
                          return Upload.LIST_IGNORE;
                        }

                        return true;
                      }}
                      onChange={({ fileList: newFileList }) => {
                        setFileList(newFileList);
                        fileListRef.current = newFileList;

                        const fileNames = newFileList.map((file) => file.name);
                        setFilesNameLst(fileNames);

                        const validFiles = newFileList
                          .filter((f) => f.status === "done")
                          .map((f) => f.originFileObj);

                        setUploadedFiles(validFiles);
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for single or bulk upload.
                      </p>
                    </Dragger>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Drawer>
        </div>
        <Table
          style={{ padding: "10px" }}
          columns={columns}
          dataSource={filteredTickets}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ paddingLeft: "30px" }}>
                <p style={{ margin: 0 }}>
                  <Text strong style={{ fontSize: 14 }}>
                    Description
                  </Text>
                </p>
                <span style={{ paddingLeft: "2px" }}>{record.description}</span>
              </div>
            ),
            expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
            onExpand: (expanded, record) => {
              setExpandedRowKey(expanded ? record.key : null);
            },
            rowExpandable: () => true,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => handleView(record),
            };
          }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) =>
              `${range[0]}–${range[1]} of ${total} items`,
            defaultPageSize: 10,
            position: ['bottomLeft']
          }}
          className="left-pagination"
        />
      </div >
    </>
  );
}
