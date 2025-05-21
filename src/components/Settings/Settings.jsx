import { Tabs } from "antd";
import React from "react";
import Departments from "../Departments/Departments";
import Categories from "../Categories/Categories";
import Status from "../Status/Status";
import Email from "../Email/Email";
import TicketDetail from "../TicketDetails/TicketDetails";

export default function Settings() {

    const items = [
      {
        key: "departments",
        label: "Departments",
        children: <Departments />,
      },
      {
        key: "categories",
        label: "Categories",
        children: <Categories />,
      },
      {
        key: "status",
        label: "Status",
        children: <Status />,
      },
      {
        key: "email",
        label: "Email",
        children: <Email />,
      },
      // {
      //   key: "ticket",
      //   label: "Ticket",
      //   children: <TicketDetail />,
      // }
    ];
  return (
    <>
      <div style={{marginTop:'20px'}}>
        <Tabs
        tabPosition="left"
        items={items}
        defaultActiveKey="departments"
      />
      </div>
    </>
  );
}
