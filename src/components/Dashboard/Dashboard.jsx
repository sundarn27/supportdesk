import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Tag, Avatar, Space, Flex, Pagination } from "antd";
import {
  CheckOutlined,
  UnlockOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  ExclamationOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import tickets from "../../tickets.json";
import {
  ClockCircleOutlined,
  MessageOutlined,
  MailOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { AlignJustify, Check, CheckCheck, CircleAlert, CircleHelp, LockOpen, Paperclip } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { fetchTicketList } from "../../features/ticketSlice";
import { fetchMasterList } from "../../features/masterSlice";

const { Text, Title } = Typography;


export default function Dashboard() {
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state.master);
  const { ticketData, loading, error } = useSelector((state) => state.ticket);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [dataSource, setDataSource] = useState([]);
    const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    dispatch(fetchTicketList());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(ticketData)) {
      const withKeys = ticketData.map((item) => ({
        ...item,
        key: item.ticketId,
      }));
      setDataSource(withKeys);
    } else {
      setDataSource([]);
    }
  }, [ticketData]);
  useEffect(() => {
    dispatch(fetchMasterList());
  }, [dispatch]);
  useEffect(() => {
    if (Array.isArray(masterData)) {
      var filteredSts = masterData.filter((i) => i.label === "Status" && i.status === true);
      setStatuses(filteredSts);
    } else {
      setStatuses([]);
    }
  }, [masterData]);

  const paginatedData = dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  var openCount = dataSource.filter((i) => i.status === "Open").length;
  var pendingCount = dataSource.filter((i) => i.status === "Pending").length;
  var closeCount = dataSource.filter((i) => i.status === "Closed").length;
  var clfCount = dataSource.filter((i) => i.status === "Clarification").length;
  var compCount = dataSource.filter((i) => i.status === "Completed").length;
  const cardData = [
    {
      title: "Total",
      value: dataSource.length,
      color: "#3cb2e7",
      icon: <AlignJustify color="#ffffff90" size={30} />,
    },
    {
      title: "Open",
      value: openCount,
      color: "#119d57",
      icon: <LockOpen color="#ffffff90" size={30} />,
    },
    {
      title: "Pending",
      value: pendingCount,
      color: "#f5b400",
      icon: <CircleAlert size={30} color="#ffffff90" />,
    },
    {
      title: "Clarification",
      value: clfCount,
      color: "#dc4437",
      icon: <CircleHelp size={30} color="#ffffff90" />,
    },
    {
      title: "Completed",
      value: compCount,
      color: "#119d57",
      icon: <Check size={30} color="#ffffff90" />,
    },
    {
      title: "Closed",
      value: closeCount,
      color: "#4286f5",
      icon: <CheckCheck size={30} color="#ffffff90" />,
    },
    // {
    //   title: "Overdue",
    //   value: closeCount,
    //   color: "#4285f4",
    //   icon: <CheckOutlined style={{ fontSize: 30, color: "#ffffff90" }} />,
    // },
  ];
  const themeByStatus = (sts) => {
    if (sts) {
      const item = statuses.find((i) => i.title === sts);
      return item?.theme || "";
    }
    return "";
  };
  return (
    <>
      <div className="dash-container">
        <div className="dash-header">
          <Row
            gutter={16}
            style={{
              width: "99.5%",
              margin: "15px 1px",
            }}
          >
            {cardData.map((card, index) => (
              <Col
                className="gutter-row"
                span={4}
                style={{ padding: "10px" }}
                key={index}
              >
                <Card
                  bodyStyle={{ padding: 15, color: "white", position: "relative" }}
                  style={{
                    backgroundColor: card.title === "Total" ? card.color : themeByStatus(card.title),
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    color: "white",
                    overflow: "hidden",
                  }}
                  bordered={false}
                >

                  <Text
                    style={{
                      color: "#fff",
                      opacity: 0.9,
                      position: "absolute",
                      top: 2,
                      left: 10,
                    }}
                  >
                    {card.title}
                  </Text>
                  <Title level={2} style={{ color: "#fff", margin: "8px 0" }}>
                    {card.value}
                  </Title>
                  <div style={{ position: "absolute", bottom: -10, right: 10 }}>
                    {card.icon}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <Card className="header-card">
          <div className="header">
            <Text className="h-cell" style={{ width: "10%" }}>Ticket ID</Text>
            <Text className="h-cell" style={{ width: "40%" }}>Subject</Text>
            <Text className="h-cell" style={{ width: "20%" }}>Requester</Text>
            <Text className="h-cell" style={{ width: "10%" }}>Status</Text>
            <Text className="h-cell" style={{ width: "10%" }}>Priority</Text>
            <Text className="h-cell" style={{ width: "20%" }}>Created</Text>
            {/* <Text className="h-cell" style={{ width: "13%" }}>Modified</Text> */}
          </div>
        </Card>

        <div className="dash-body">
          {dataSource.map((dt, index) => {
            const isHovered = hoveredIndex === index;
            const getStatusColor = (status) => {
              switch (status) {
                case "Open":
                  return "green";
                case "Closed":
                  return "red";
                case "Pending":
                  return "gold";
                default:
                  return "default";
              }
            };

            const getPriorityColor = (priority) => {
              switch (priority) {
                case "High":
                  return "red";
                case "Medium":
                  return "orange";
                case "Low":
                  return "green";
                default:
                  return "gray";
              }
            };

            return (
              <Card
                key={dt.ticketId || index}
                size="small"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`body-card ${isHovered ? "hovered" : ""}`}
              >
                <div className="body">
                  <div className="b-cell" style={{ width: "10%" }}>
                    <Tag color="blue" className="ticket-tag">
                      {dt.ticketId}
                    </Tag>
                  </div>

                  <div className="b-cell" style={{ width: "40%" }}>
                    <Text strong style={{ fontSize: 13 }}>{dt.subject}</Text>
                  </div>

                  <div className="b-cell" style={{ width: "20%" }}>
                    <Avatar size="small" style={{ backgroundColor: "#bbb", fontSize: 12 }}>
                      {dt.requester.substring(0, 1).toUpperCase()}
                    </Avatar>
                    <Text style={{ marginLeft: 6 }}>{dt.requester}</Text>
                  </div>

                  <div className="b-cell" style={{ width: "10%" }}>
                    <Tag color={themeByStatus(dt.status)} className="status-tag">
                      {dt.status}
                    </Tag>
                  </div>

                  <div className="b-cell" style={{ width: "10%",paddingLeft:'5px' }}>
                    <span className="priority-badge">
                      <span
                        className="dot"
                        style={{ backgroundColor: getPriorityColor(dt.piriority) }}
                      />
                      <Text style={{ fontSize: 12 }}>{dt.piriority}</Text>
                    </span>
                  </div>

                  <div className="b-cell" style={{ width: "20%" }}>
                    <Text>{dt.createdOn}</Text>
                  </div>

                  {/* <div className="b-cell" style={{ width: "13%" }}>
                    <Text>{dt.timeSpent}</Text>
                  </div> */}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      {/* <div className="pagination-wrapper">
        <Pagination
          current={currentPage}
          total={data.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div> */}
    </>
  );
}
