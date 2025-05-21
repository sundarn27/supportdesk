import React from "react";
import { Tabs, Layout } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import Dashboard from "../../components/Dashboard/Dashboard";
import TicketList from "../../components/List/TicketList";
import Settings from "../../components/Settings/Settings";
import { useNavigate, useParams } from "react-router-dom";

const { Content } = Layout;
const { TabPane } = Tabs;

const items = [
  {
    key: "overview",
    label: "Overview",
    children: <Dashboard />,
  },
  {
    key: "tickets",
    label: "Tickets",
    children: <TicketList />,
  },
  {
    key: "settings",
    label: "Settings",
    children: <Settings />,
  },
];

const Home = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  const tabKey = items.find(item => item.key === key) ? key : "overview";

  const handleTabChange = (key) => {
    navigate("/" + key);
  };

  return (
    <Layout style={{ height: "100%", background: "#f0f2f5" }}>
      <Navbar />
      <Content style={{ paddingTop: "0px", background: "#f2f4f7" }}>
        <Tabs
          activeKey={tabKey}
          onChange={handleTabChange}
          tabBarGutter={24}
          tabBarStyle={{
            position: "sticky",
            top: 50,
            zIndex: 999,
            backgroundColor: "#fff",
            paddingLeft: 10,
            marginBottom: 40,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            height: 50,
          }}
          animated
        >
          {items.map((item) => (
            <TabPane tab={<span>{item.label}</span>} key={item.key}>
              {item.children}
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Home;
