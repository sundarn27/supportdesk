import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  List,
  Menu,
  message,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { rgba } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  DownloadOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import AttachmentList from "../AttachmentList/AttachmentList";
import { Paperclip } from 'lucide-react';
import { fetchMasterList } from "../../features/masterSlice";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, fetchTicketList } from "../../features/ticketSlice";
import { motion, AnimatePresence } from "framer-motion";

const { Option } = Select;
const { Text, Title } = Typography;

const getIconByExtension = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(ext)) {
    return <FileImageOutlined style={{ color: "#1890ff" }} />;
  }
  if (["ppt", "pptx"].includes(ext)) {
    return <FilePptOutlined style={{ color: "#f60" }} />;
  }
  if (["pdf"].includes(ext)) {
    return <FilePdfOutlined style={{ color: "#cf1322" }} />;
  }
  return <FileOutlined />;
};

export default function EditTicket1({ isEdit, singleData, onClose }) {
  const dispatch = useDispatch();
  const { masterData, loading, error } = useSelector((state) => state.master);
  console.log(isEdit, singleData);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [comments, setComments] = useState("");
  const searchInput = useRef(null);
  const [dataSource, setDataSource] = useState(singleData);
  const [open, setOpen] = useState(isEdit);
  const [fileList, setFileList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filesNameLst, setFilesNameLst] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selected, setSelected] = useState(statusOptions[0]);
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [openModalIndex, setOpenModalIndex] = useState(null);


  const handleMenuClick = (e) => {
    const newStatus = statusOptions.find((opt) => opt._id === e.key);
    setSelected(newStatus);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {statusOptions.map((item) => (
        <Menu.Item key={item._id} icon={<Tag color={item.theme}>{item.title}</Tag>}>
          {item.code}
        </Menu.Item>
      ))}
    </Menu>
  );
  useEffect(() => {
    dispatch(fetchMasterList());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(masterData)) {
      var filteredDep = masterData.filter((i) => i.label === "Status");
      setStatusOptions(filteredDep);
    } else {
      setStatusOptions([]);
    }
    console.log(dataSource);
  }, [masterData]);
  const showModal = (index) => {
    setOpenModalIndex(index)
  };
  const handleClosePreview = () => {
    setOpenModalIndex(null)
  };

  useEffect(() => {
    if (isEdit && singleData) {
      form.setFieldsValue(singleData);
    }
  }, [isEdit, singleData]);

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

  const handleUpdate = () => {
    setMessageVisible(false);
    form
      .validateFields()
      .then((values) => {
        const prev = dataSource.updatedBy || [];
        const statusChanged = dataSource.status !== values.status;

        if (statusChanged && (!comments || comments.trim() === "")) {
          message.error("Please enter comments when changing status.");
          return;
        }

        const uptTicket = {
          ticketId: dataSource.ticketId,
          subject: dataSource.subject,
          description: dataSource.description,
          department: dataSource.department,
          category: dataSource.category,
          piriority: dataSource.piriority,
          status: dataSource.status,
          requester: "sudalai@codasol.com",
          updatedBy: [
            ...prev,
            {
              name: "Sudalai S",
              email: "sudalai@codasol.com",
              comments: comments || "",
              attchments: filesNameLst,
              updatedOn: new Date().toISOString(),
            },
          ],
          createdOn: dataSource.createdOn || new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };

        console.log("Updating ticket:", uptTicket);

        dispatch(createTicket({ data: uptTicket, files: uploadedFiles }))
          .then((response) => {
            const responseMessage = response.payload;
            console.log(response)
            if (responseMessage.toLowerCase().includes("successfully")) {
              setMessageVisible(true);
              setMessageType("success");
              setMessageContent(responseMessage);
              dispatch(fetchTicketList());
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
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
        setMessageVisible(true);
        setMessageType("error");
        setMessageContent("Please fill all required fields.");
      });
  };

  return (
    <>
      <Drawer
        title={
          <Tag color="blue" className="ticket-tag">
            {dataSource.ticketId}
          </Tag>
        }
        width={1200}
        onClose={() => {
          form.resetFields();
          onClose();
        }}
        open={true}
        style={{ zIndex: 1000 }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleUpdate} type="primary">Update</Button>
          </Space>
        }
      >
        <AnimatePresence>
          {messageVisible && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
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
                style={{
                  position: 'fixed',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                  width: 'fit-content',
                  maxWidth: '90%',
                }}
              />

            </motion.div>
          )}
        </AnimatePresence>
        <Form layout="vertical" form={form}>
          <Text strong style={{ padding: "5px" }}>
            Subject :
          </Text>
          <Text style={{ padding: "5px" }}>{dataSource.subject}</Text>
          <Select
            style={{ width: 120, position: 'absolute', right: '30px', top: '67px' }}
            placeholder="Select Status"
            optionLabelProp="label"
            value={dataSource.status}
            onChange={(value) => {
              setDataSource((prev) => ({
                ...prev,
                status: value
              }))
            }}
          >
            {statusOptions.map((item) => (
              <Option
                key={item._id}
                value={item.title}
                label={
                  <Tag color={item.theme} style={{ margin: 0 }}>
                    {item.title}
                  </Tag>
                }
              >
                <Tag color={item.theme} style={{ marginRight: 8 }}>
                  {item.title}
                </Tag>
              </Option>
            ))}
          </Select>
          <Row style={{ height: "100%" }}>
            <Col span={18} style={{ paddingRight: "10px" }}>
              <Card loading={loading} className="comment-card">
                {dataSource?.updatedBy?.map((dt, index) => (
                  <Col key={index} span={24}>
                    {index !== 0 && <Divider style={{ marginTop: "10px" }} />}
                    <Card.Meta
                      avatar={
                        <Avatar
                          size="default"
                          style={{ backgroundColor: "#bbb", fontSize: 12 }}
                        >
                          {dt.name.substring(0, 1).toUpperCase()}
                        </Avatar>
                      }
                      title={
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Text strong style={{ fontSize: "12px" }}>
                            {dt.name || "Unknown User"}
                          </Text>
                          <Text
                            strong
                            style={{ color: "#999", fontSize: "10px" }}
                          >
                            {dt.updatedOn}
                          </Text>
                          <Button color="default" variant="text" onClick={() => showModal(index)} style={{ position: 'absolute', right: '5px' }}>
                            <Paperclip color="black" size={14} />
                          </Button>
                          <Modal
                            open={openModalIndex === index}
                            footer={null}
                            onCancel={() => setOpenModalIndex(null)}
                            width={600}
                          >
                            <AttachmentList
                              attachments={Array.isArray(dt?.attchments) ? dt.attchments : []}
                            />
                          </Modal>
                        </div>
                      }
                      description={<Text>{dt.comments}</Text>}
                    />
                  </Col>
                ))}
              </Card>
              <Row className="comments">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  {" "}
                  <Form.Item
                    name="comments"
                    label="Leave a comment"
                    rules={[
                      { required: true, message: "Please enter comments" },
                    ]}
                  >
                    <TextArea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} placeholder="Enter comments..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {" "}
                  <Form.Item
                    name="attachment"
                    label="Attachment"
                    style={{ paddingLeft: "10px" }}
                  >
                    <Upload
                      multiple
                      customRequest={handleCustomUpload}
                      fileList={fileList}
                      onChange={({ file, fileList }) => {
                        const fileNames = fileList.map((file) => file.name);
                        setFilesNameLst(fileNames);
                        setFileList(fileList);

                        const validFiles = fileList
                          .filter((f) => f.status === "done")
                          .map((f) => f.originFileObj);

                        setUploadedFiles(validFiles);
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Card
                loading={loading}
                style={{
                  height: "80vh",
                  backgroundColor: "#f0f2f5",
                  margin: "5px",
                }}
                title="Tickt Details"
              >
                <Divider />
                <Row>
                  <Col span={8}>
                    <Text style={{ fontWeight: "600" }}>TicketId</Text>
                  </Col>
                  <Col span={1} style={{ marginTop: "-1px" }}>
                    <Text>:</Text>
                  </Col>
                  <Col span={15}>
                    <Text>{dataSource.ticketId}</Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col span={8}>
                    <Text style={{ fontWeight: "600" }}>Piriority</Text>
                  </Col>
                  <Col span={1} style={{ marginTop: "-1px" }}>
                    <Text>:</Text>
                  </Col>
                  <Col span={15}>
                    <Text>{dataSource.piriority}</Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col span={8}>
                    <Text style={{ fontWeight: "600" }}>Category</Text>
                  </Col>
                  <Col span={1} style={{ marginTop: "-1px" }}>
                    <Text>:</Text>
                  </Col>
                  <Col span={15}>
                    <Text>{dataSource.category}</Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col span={8}>
                    <Text style={{ fontWeight: "600" }}>Department</Text>
                  </Col>
                  <Col span={1} style={{ marginTop: "-1px" }}>
                    <Text>:</Text>
                  </Col>
                  <Col span={15}>
                    <Text>{dataSource.department}</Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col span={8}>
                    <Text style={{ fontWeight: "600" }}>Created</Text>
                  </Col>
                  <Col span={1} style={{ marginTop: "-1px" }}>
                    <Text>:</Text>
                  </Col>
                  <Col span={15}>
                    <Text>{dataSource.createdOn}</Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col span={8}>
                    <Text style={{ fontWeight: "600" }}>Last activity</Text>
                  </Col>
                  <Col span={1} style={{ marginTop: "-1px" }}>
                    <Text>:</Text>
                  </Col>
                  <Col span={15}>
                    <Text>{dataSource.updatedOn}</Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col span={8}>
                    <Text style={{ fontWeight: "600" }}>Requester</Text>
                  </Col>
                  <Col span={1} style={{ marginTop: "-1px" }}>
                    <Text>:</Text>
                  </Col>
                  <Col span={15}>
                    <Text>{dataSource.requester}</Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
}
