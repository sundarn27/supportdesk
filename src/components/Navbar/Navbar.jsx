import React, { useState } from "react";
import { Avatar, Button, Card, Divider, Dropdown, Input, Layout, List, Menu, Space, Tooltip, Typography } from "antd";
import {
  LinkedinOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import LOGO from "../../../src/assets/coda-logo.png"
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text, Title } = Typography;

const Navbar = ({ collapsed, toggleSidebar }) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/tickets/${searchValue.trim()}`);
    }
  };
  
  const currentDate = new Date().toLocaleString();

  const options = [
    {
      icon: <LogoutOutlined />,
      label: "Sign Out",
    },
  ];

  // const navigate = useNavigate();

  // const handleProfileClick = (e) => {
  //   if (e.key === "profile") {
  //     navigate("/Users/MyProfile");
  //   } else if (e.key === "logout") {
  //     navigate("/");
  //   }
  // };

  const menu = (
    // <Menu onClick={handleProfileClick}>
    <Card
      style={{
        width: 300,
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ textAlign: "center" }}>
        <Avatar size={64} style={{ backgroundColor: "#d9d9d9" }} />
        <Title level={5} style={{ margin: "12px 0 4px" }}>
          Welcome
        </Title>
        <Title level={4} style={{ margin: 0 }}>
          Sudalai Perumal
        </Title>
        <Text strong>50109</Text>
        <br />
        <Text type="secondary">sudalai@codasol.com</Text>
        <div style={{ marginTop: 12 }}>
          <Tooltip title="LinkedIn">
            <LinkedinOutlined style={{ fontSize: 20 }} />
          </Tooltip>
        </div>
      </div>


      <Divider style={{ marginTop: 12, marginBottom: 10 }} />
      <Button variant="text" color="default" icon={<LogoutOutlined />} style={{ padding: "6px 90px" }} >
        Sign Out
      </Button>
      {/* <List
        itemLayout="horizontal"
        dataSource={options}
        split={false}
        renderItem={(item) => (
          <List.Item style={{ padding: "6px 85px" }}>
            <Space>
              {item.icon}
              <Text>{item.label}</Text>
            </Space>
          </List.Item>
        )}
      /> */}
    </Card>
  );

  return (
    <>
      <Layout>
        <Header className="nav-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
            {/* <Button
              type="text"
              onClick={toggleSidebar}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              style={{ color: "#fff" }}
            /> */}
            <img src={LOGO} alt="CODA" style={{ width: 40, height: 30 }} />
            <span style={{ color: "#fff", marginLeft: 16, fontSize: 16, marginBottom: 4 }}>
              Support Desk
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>
            {/* <Search
              placeholder="Search..."
              onSearch={(value) => navigate("/tickets/") }
              style={{ width: 450, marginRight:16}}
              allowClear
            /> */}
            <Input
              size="middle"
              placeholder="Search here..."
              prefix={<SearchOutlined style={{ color: "#aaa",marginRight:2 }} />}
              onChange={(e) => navigate(`/tickets/${e.target.value}`)}
              onKeyDown={(e) => navigate(`/tickets/${e.target.value}`)}
              allowClear
              style={{
                borderRadius: "8px",
                 width: 450, marginRight:16,
              }}
            />
            <Dropdown overlay={menu} placement="bottomRight">
              <Avatar
                style={{ backgroundColor: "#87d068", cursor: "pointer" }}
                size="default"
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
      </Layout>
    </>
  );
};

export default Navbar;
