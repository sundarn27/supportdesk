import React from "react";
import {
  Layout,
  Typography,
  Avatar,
  Space,
  Button,
  Input,
  Upload,
  Select,
  Checkbox,
  Divider,
  Card,
  Tag,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const TicketDetail = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Header */}
      <Header style={{ background: "#001529", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>🖥 HELP DESK</div>
        <Space>
          <Text style={{ color: "#fff" }}>James Nelson</Text>
          <Avatar src="https://i.pravatar.cc/40" />
        </Space>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: 24, display: "flex", justifyContent: "space-between" }}>
        {/* Left: Ticket Body */}
        <div style={{ flex: 2, marginRight: 24 }}>
          <Button icon={<ArrowLeftOutlined />}>Go Back</Button>
          <Title level={3} style={{ marginTop: 16 }}>Title: Email synchronization issue</Title>
          <Space align="center" style={{ marginBottom: 8 }}>
            <Avatar src="https://i.pravatar.cc/40?img=2" />
            <div>
              <Text strong>Sagar Mehta</Text><br />
              <Text type="secondary">12/03/2024 11:18 AM</Text>
            </div>
          </Space>
          <Text>User reports weak WiFi signal at their desk, affecting connectivity.</Text>

          <Divider />

          <Title level={4}>Leave a comment</Title>
          <div style={{ border: "1px solid #d9d9d9", borderRadius: 6, padding: 12, marginBottom: 12 }}>
            {/* Rich Text Placeholder */}
            <TextArea rows={6} placeholder="Write your comment..." />
            <div style={{ marginTop: 8 }}>
              <Checkbox>Pending</Checkbox>
              <Checkbox>Closed</Checkbox>
            </div>
            <div style={{ marginTop: 12 }}>
              <Select placeholder="Choose Boilerplate Response" style={{ width: 300 }} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text strong>Supporting Documents <span style={{ color: "#999" }}>(optional)</span></Text>
            <Upload.Dragger name="files" multiple>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">Drag and drop files here or click to upload</p>
            </Upload.Dragger>
          </div>

          <Button type="primary" icon={<CheckOutlined />}>Submit</Button>
        </div>

        {/* Right: Sidebar */}
        <div style={{ flex: 1 }}>
          <Card title="Ticket Details" bordered={false}>
            <p><strong>ID:</strong> #7064444326</p>
            <p><strong>Priority:</strong> <Tag color="red">Urgent</Tag></p>
            <p><strong>Status:</strong> <Tag color="green">Open</Tag></p>
            <p><strong>Category:</strong> Software Support</p>
            <p><strong>Sub Category:</strong> Installation and Setup Assistance</p>
            <p><strong>Department:</strong> Software Support</p>
            <p><strong>Created:</strong> 12/03/2024 11:22 AM</p>
            <p><strong>Last activity:</strong> 03/21/2025 11:22 AM</p>
            <p><strong>Requester:</strong> Sagar Mehta</p>
            <p><strong>Assigned To:</strong> James Nelson</p>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default TicketDetail;
