import React, { useState } from "react";
import { Form, Input, Select, Button, message, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./CA.css";
import AdminLayout from "../../components/layout/AdminLayout";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";

const AddCA = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordModal, setPasswordModal] = useState({ visible: false, password: "" });

  const [files, setFiles] = useState({
    pan: null,
    aadhaar: null,
    certificate: null,
    photo: null,
  });

  const handleFileChange = (info, key) => {
    setFiles((prev) => ({ ...prev, [key]: info.file.originFileObj }));
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Required fields
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("specialization", values.specialization);
      formData.append("experienceYears", values.experienceYears);

      // Upload documents
      if (files.pan) formData.append("pan", files.pan);
      if (files.aadhaar) formData.append("aadhaar", files.aadhaar);
      if (files.certificate) formData.append("certificate", files.certificate);
      if (files.photo) formData.append("photo", files.photo);

      // API call
      const res = await API.post("/ca", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setLoading(false);

      // Show password popup
      setPasswordModal({
        visible: true,
        password: res.data.password,
      });

      message.success("CA added successfully!");

    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error("Failed to add CA");
    }
  };

  return (
    <AdminLayout>
      <div className="ca-container">
        <h2 className="page-title">Add New CA</h2>

        <Form layout="vertical" onFinish={onFinish} className="ca-form">

          <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter CA’s Name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input placeholder="Enter Email" />
          </Form.Item>

          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input placeholder="Enter Phone Number" />
          </Form.Item>

          <Form.Item label="Experience (Years)" name="experienceYears" rules={[{ required: true }]}>
            <Input type="number" placeholder="Years of Experience" />
          </Form.Item>

          <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
            <Select placeholder="Select Category">
              <Select.Option value="ITR">ITR Filing</Select.Option>
              <Select.Option value="GST">GST Filing</Select.Option>
              <Select.Option value="Registration">Company Registration</Select.Option>
              <Select.Option value="Trademark">Trademark</Select.Option>
            </Select>
          </Form.Item>

          {/* Document Upload Section */}
          <h3 className="section-title">Upload Documents</h3>

          <Form.Item label="PAN Card">
            <Upload beforeUpload={() => false} onChange={(info) => handleFileChange(info, "pan")}>
              <Button icon={<UploadOutlined />}>Upload PAN</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Aadhaar Card">
            <Upload beforeUpload={() => false} onChange={(info) => handleFileChange(info, "aadhaar")}>
              <Button icon={<UploadOutlined />}>Upload Aadhaar</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="CA Certificate">
            <Upload beforeUpload={() => false} onChange={(info) => handleFileChange(info, "certificate")}>
              <Button icon={<UploadOutlined />}>Upload Certificate</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Profile Photo">
            <Upload beforeUpload={() => false} onChange={(info) => handleFileChange(info, "photo")}>
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ backgroundColor: "#199A8D", width: "100%", height: 45 }}
          >
            Add CA
          </Button>

        </Form>

        {/* PASSWORD MODAL */}
        <Modal
          open={passwordModal.visible}
          onCancel={() => {
            setPasswordModal({ visible: false, password: "" });
            navigate("/ca");
          }}
          onOk={() => {
            setPasswordModal({ visible: false, password: "" });
            navigate("/ca");
          }}
          title="CA Password Generated"
        >
          <p>
            The CA account has been created.  
            Share this password with the CA:
          </p>

          <h2 style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }}>
            {passwordModal.password}
          </h2>

          <p style={{ marginTop: 20, color: "red" }}>
            Make sure to copy this password now. It will not be shown again.
          </p>
        </Modal>

      </div>
    </AdminLayout>
  );
};

export default AddCA;
