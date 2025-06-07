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
    Radio,
    Input,
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
import DynamicCheckbox from "../DynamicCheckbox/DynamicCheckbox.test";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);


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

const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
};

export default function EditTicket({ isEdit, singleData, onClose }) {
    const dispatch = useDispatch();
    const fileListRef = useRef([]);
    const { masterData, loading, error } = useSelector((state) => state.master);
    console.log("EditTicket Props:", isEdit, singleData);
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
    const [checkboxStates, setCheckboxStates] = useState(null);
    const [value, setValue] = useState(1);
    const onChange = (e) => {
        console.log(e.target.value)
        setDataSource((prev) => ({
            ...prev,
            status: e.target.value,
        }));
        console.log(dataSource)
    };

    useEffect(() => {
        const initialState = {};
        statusOptions.forEach((sts) => {
            initialState[sts.title] = false;
        });
        setCheckboxStates(initialState);
    }, []);

    const handleCheckboxChange = (key) => (checked) => {
        setCheckboxStates((prev) => ({
            ...prev,
            [key]: checked,
        }));
    };
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
    const now = new Date();
    const utcTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const handleUpdate = () => {
        setMessageVisible(false);

        form
            .validateFields()
            .then((values) => {
                const prev = dataSource.updatedBy || [];
                const statusChanged = dataSource.status !== values.status;
                console.log(statusChanged)
                if (statusChanged && (!comments || comments.trim() === "")) {
                    message.error("Please enter comments when changing status.");
                }

                const uptTicket = {
                    ticketId: dataSource.ticketId,
                    subject: values.subject || dataSource.subject,
                    description: values.description || dataSource.description,
                    department: values.department || dataSource.department,
                    category: values.category || dataSource.category,
                    piriority: values.piriority || dataSource.piriority,
                    status: values.status || dataSource.status,
                    requester: "sudalai@codasol.com",
                    updatedBy: [
                        ...prev,
                        {
                            name: "Sudalai S",
                            email: "sudalai@codasol.com",
                            comments: comments || "",
                            attachments: filesNameLst,
                            updatedOn: utcTime.toISOString(),
                        },
                    ],
                    createdOn: dataSource.createdOn || utcTime.toISOString(),
                    updatedOn: utcTime.toISOString(),
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
                            setComments("");

                            setDataSource((ex) => ({
                                ...ex,
                                status: values.status || dataSource.status,
                                updatedBy: [
                                    ...prev,
                                    {
                                        name: "Sudalai S",
                                        email: "sudalai@codasol.com",
                                        comments: comments || "",
                                        attachments: filesNameLst,
                                        updatedOn: utcTime.toISOString(),
                                    },
                                ],
                            }));
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
            <Drawer
                title={
                    <Tag color="blue" className="ticket-tag">
                        {dataSource.ticketId}
                    </Tag>
                }
                width={920}
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
                                    left: "60%",
                                    transform: "translateX(-40%)",
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
                                paddingLeft: 20,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 12,
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ flex: "1 1 65%", minWidth: 300 }}>
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
                                    {/* <Select
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
                                    </Select> */}
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
                                    {dataSource?.updatedBy?.sort((a, b) => dayjs.utc(b.updatedOn).valueOf() - dayjs.utc(a.updatedOn).valueOf()).map((dt, index) => (
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
                                                            {dayjs.utc(dt.updatedOn).format("DD-MM-YYYY hh:mm A")}
                                                        </Text>
                                                        {Array.isArray(dt.attchments) && dt.attchments.length > 0 ? <Button
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
                                                            {/* {dt.attchments.map((url) => {
                                                                return(
                                                                    <FilePreviewer fileUrl={url} />
                                                                )
                                                            })} */}
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
                                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                                            <span style={{ fontWeight: 600 }}>
                                                Leave a comment <span style={{ color: 'red' }}>*</span>
                                            </span>
                                            <Radio.Group value={dataSource.status} onChange={onChange} name="status"
                                                style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>

                                                {statusOptions.map((sts) => (
                                                    <div
                                                        key={sts.code}
                                                        style={{
                                                            "--radio-color": sts.code === value ? sts.theme : "",
                                                            "--radio-check-color": sts.code === value ? sts.theme : "",
                                                            marginBottom: 8,
                                                        }}
                                                    >
                                                        <Radio value={sts.code}><span style={{ color: sts.theme }}>{sts.title}</span></Radio>
                                                    </div>
                                                ))}
                                            </Radio.Group>
                                        </div>
                                        <Form.Item
                                            name="comments"
                                            rules={[{ required: true, message: "Please enter comments" }]}
                                        >

                                            <TextArea rows={4} placeholder="Enter comments..." value={comments} onChange={(e) => { setComments(e.target.value) }} />
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
                                        <strong>Created :</strong> {dayjs.utc(dataSource.createdOn).format("DD-MM-YYYY hh:mm A")}
                                    </p>
                                    <p>
                                        <strong>Requester :</strong> {dataSource.requester}
                                    </p>
                                    <p>
                                        <strong>Last activity :</strong> {dayjs.utc(dataSource.updatedOn).format("DD-MM-YYYY hh:mm A")}
                                    </p>
                                    <p>
                                        <strong>Updatedby :</strong> {dataSource.updatedBy[(dataSource.updatedBy.length) - 1].name}
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
