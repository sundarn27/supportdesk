import {
    Alert,
    Avatar,
    Button,
    Card,
    Checkbox,
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
    Layout,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { rgba } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
    ArrowLeftOutlined,
    CheckOutlined,
    DownloadOutlined,
    FileImageOutlined,
    FileOutlined,
    FilePdfOutlined,
    FilePptOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import AttachmentList from "../AttachmentList/AttachmentList";
import { Paperclip } from "lucide-react";
import { fetchMasterList } from "../../features/masterSlice";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, fetchTicketList } from "../../features/ticketSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Content } from "antd/es/layout/layout";

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

export default function EditTicket({ isEdit, singleData, onClose }) {
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
                <Menu.Item
                    key={item._id}
                    icon={<Tag color={item.theme}>{item.title}</Tag>}
                >
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
        setOpenModalIndex(index);
    };
    const handleClosePreview = () => {
        setOpenModalIndex(null);
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
                        console.log(response);
                        if (responseMessage.toLowerCase().includes("successfully")) {
                            setMessageVisible(true);
                            setMessageType("success");
                            setMessageContent(responseMessage);
                            dispatch(fetchTicketList());
                            form.resetFields();
                            setFileList([]);
                            setDataSource((ex) => ({
                                ...ex,
                                status: dataSource.status,
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
                            }))
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
                    isEdit && (
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={handleUpdate} type="primary">
                                Update
                            </Button>
                        </Space>
                    )
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
                                style={{
                                    position: "fixed",
                                    top: "10px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    zIndex: 1000,
                                    width: "fit-content",
                                    maxWidth: "90%",
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Form layout="vertical" form={form}>
                    <Layout style={{ background: "#fff" }}>
                        <Content
                            style={{
                                padding: 12,
                                paddingTop: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 12,
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ flex: "1 1 75%", minWidth: 300 }}>
                                <div
                                    style={{
                                        padding: 0,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: 12,
                                    }}
                                >
                                    <Title level={3} style={{ marginTop: 0 }}>
                                        Subject: {dataSource.subject}
                                    </Title>
                                    <Select
                                        style={{ width: 120 }}
                                        placeholder="Select Status"
                                        optionLabelProp="label"
                                        value={dataSource.status}
                                        onChange={(value) =>
                                            setDataSource((prev) => ({
                                                ...prev,
                                                status: value,
                                            }))
                                        }
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
                                </div>

                                <Card
                                    loading={loading}
                                    className="comment-card"
                                    style={{
                                        marginTop: 0,
                                        overflowY: "auto",
                                        maxHeight: isEdit ? "35vh" : "75vh",
                                    }}
                                >
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
                                                        {dt.attchments.length !== 0 ? <Button
                                                            color="default"
                                                            variant="text"
                                                            onClick={() => showModal(index)}
                                                            style={{ position: "absolute", right: "5px" }}
                                                        >
                                                            <Paperclip color="black" size={14} />
                                                        </Button> : null}
                                                        <Modal
                                                            open={openModalIndex === index}
                                                            footer={null}
                                                            onCancel={() => setOpenModalIndex(null)}
                                                            width={600}
                                                        >
                                                            <AttachmentList
                                                                attachments={
                                                                    Array.isArray(dt?.attchments)
                                                                        ? dt.attchments
                                                                        : []
                                                                }
                                                            />
                                                        </Modal>
                                                    </div>
                                                }
                                                description={<Text>{dt.comments}</Text>}
                                            />
                                        </Col>
                                    ))}
                                </Card>

                                {isEdit && (
                                    <>
                                        <Form.Item
                                            name="comments"
                                            label="Leave a comment"
                                            rules={[
                                                { required: true, message: "Please enter comments" },
                                            ]}
                                        >
                                            <TextArea
                                                value={comments}
                                                onChange={(e) => setComments(e.target.value)}
                                                rows={4}
                                                placeholder="Enter comments..."
                                            />
                                        </Form.Item>

                                        <div style={{ marginTop: 10 }}>
                                            <Text strong>
                                                Supporting Documents{" "}
                                                <span style={{ color: "#999" }}>(optional)</span>
                                            </Text>
                                            <div style={{ paddingTop: "10px" }}>
                                                <Upload
                                                    multiple
                                                    customRequest={handleCustomUpload}
                                                    fileList={fileList}
                                                    onChange={({ fileList }) => {
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
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{ flex: "1 1 23%", minWidth: 250 }}>
                                <Card title="Ticket Details" bordered={false}>
                                    <p>
                                        <strong>ID :</strong> {dataSource.ticketId}
                                    </p>
                                    <p>
                                        <strong>Priority :</strong>{" "}
                                        <Tag
                                            color={
                                                dataSource.piriority === "High"
                                                    ? "red"
                                                    : dataSource.piriority === "Medium"
                                                        ? "yellow"
                                                        : dataSource.piriority === "Low"
                                                            ? "green"
                                                            : ""
                                            }
                                        >
                                            {dataSource.piriority}
                                        </Tag>
                                    </p>
                                    <p>
                                        <strong>Category :</strong> {dataSource.category}
                                    </p>
                                    <p>
                                        <strong>Department :</strong> {dataSource.department}
                                    </p>
                                    <p>
                                        <strong>Created :</strong> {dataSource.createdOn}
                                    </p>
                                    <p>
                                        <strong>Last activity :</strong> {dataSource.updatedOn}
                                    </p>
                                    <p>
                                        <strong>Requester :</strong> {dataSource.requester}
                                    </p>
                                </Card>
                            </div>
                        </Content>
                    </Layout>
                </Form>
            </Drawer>
        </>
    );
}
