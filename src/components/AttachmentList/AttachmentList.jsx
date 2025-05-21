import { List, Avatar, Tooltip, Button, Modal, Image, message } from "antd";
import {
  FileOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const BASE_URL = `${process.env.REACT_APP_API_URL}/Uploads` || "http://localhost:5000";

const isImage = (file) => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(file);

const getIconByExtension = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(ext)) {
    return <FileImageOutlined style={{ color: "#1890ff" }} />;
  }
  if (["ppt", "pptx"].includes(ext)) {
    return <FilePptOutlined style={{ color: "#fa8c16" }} />;
  }
  if (["pdf"].includes(ext)) {
    return <FilePdfOutlined style={{ color: "#cf1322" }} />;
  }
  return <FileOutlined />;
};

export default function AttachmentList({ attachments }) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const handlePreview = (file, fileUrl) => {
    const type = getFileType(file);

    if (type === "image" || type === "pdf") {
      setPreviewError(false);
      setPreviewUrl(fileUrl);
      setPreviewVisible(true);
    } else if (type === "office") {
      const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
      window.open(officeUrl, "_blank");
    } else {
      message.warning("Preview not supported for this file type.");
    }
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPreviewUrl("");
  };

  const getFileType = (file) => {
    const ext = file.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "office";
    return "other";
  };

  return (
    <>
      <List
        size="small"
        dataSource={attachments}
        header={<strong>Attachments</strong>}
        renderItem={(file) => {
          const fileUrl = `${BASE_URL}/${file}`;
          return (
            <List.Item
              style={{
                padding: "8px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                <Avatar icon={getIconByExtension(file)} size="small" style={{ marginRight: 8 }} />
                <Tooltip title={file}>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    {file}
                  </span>
                </Tooltip>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {["image", "pdf", "other"].includes(getFileType(file)) && (
                  <Tooltip title="Preview">
                    <Button
                      icon={<EyeOutlined />}
                      type="text"
                      size="small"
                      onClick={() => handlePreview(file, fileUrl)}
                    />
                  </Tooltip>
                )}

                <Tooltip title="Download">
                  <Button
                    icon={<DownloadOutlined />}
                    type="text"
                    size="small"
                    href={fileUrl}
                    download
                  />
                </Tooltip>
              </div>
            </List.Item>
          );
        }}
      />

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handleClosePreview}
        width={previewUrl.endsWith(".pdf") ? "80%" : 600}
      >
        {!previewError ? (
          <>
            {isImage(previewUrl) ? (
              <Image
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "100%" }}
                onError={() => setPreviewError(true)}
              />
            ) : previewUrl.endsWith(".pdf") ? (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                style={{ width: "100%", height: "80vh", border: "none" }}
                onError={() => setPreviewError(true)}
              />
            ) : (
              <div style={{ padding: 20, textAlign: "center" }}>
                <p>Preview not supported for this file type.</p>
                <Button type="primary" href={previewUrl} download icon={<DownloadOutlined />}>
                  Download File
                </Button>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
            <strong>File could not be previewed or is corrupted.</strong>
          </div>
        )}
      </Modal>

    </>
  );
}
