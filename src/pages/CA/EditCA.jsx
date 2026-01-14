import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import "./CA.css";
import AdminLayout from "../../components/layout/AdminLayout";
import API from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

const EditCA = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // GET CA ID FROM URL
  const [loading, setLoading] = useState(false);

  // FETCH CA DETAILS
  const fetchCA = async () => {
    try {
      const res = await API.get(`/ca/${id}`);
      form.setFieldsValue(res.data);
    } catch (err) {
      console.log(err);
      message.error("Failed to load CA details");
    }
  };

  useEffect(() => {
    fetchCA();
  }, []);

  // UPDATE CA
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await API.put(`/ca/${id}`, values);
      setLoading(false);

      message.success("CA details updated successfully!");

      navigate("/ca");
    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error("Failed to update CA");
    }
  };

  return (
    <AdminLayout>
      <div className="ca-container">
        <h2 className="page-title">Edit CA</h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className="ca-form"
        >
          <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter CA Name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input placeholder="Enter Email" />
          </Form.Item>

          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input placeholder="Enter Phone Number" />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select specialization">
              <Select.Option value="ITR">ITR Filing</Select.Option>
              <Select.Option value="GST">GST Filing</Select.Option>
              <Select.Option value="Registration">Company Registration</Select.Option>
              <Select.Option value="Trademark">Trademark</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ backgroundColor: "#199A8D", width: "100%", height: 45 }}
          >
            Update CA
          </Button>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default EditCA;
