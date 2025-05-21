import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong on our end."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back to Login page
        </Button>
      }
    />
  );
};

export default ServerErrorPage;
