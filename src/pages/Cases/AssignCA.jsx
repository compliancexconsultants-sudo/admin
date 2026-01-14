import React, { useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import AdminLayout from "../../components/layout/AdminLayout";
import "./Cases.css";
import API from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

const AssignCA = () => {
  const navigate = useNavigate();
  const { caseId } = useParams(); // get case ID from URL

  const [form] = Form.useForm();
  const [caList, setCaList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all CA from backend
  const fetchCAList = async () => {
    try {
      const res = await API.get("/ca");
      setCaList(res.data);
    } catch (err) {
      console.log(err);
      message.error("Failed to load CA list");
    }
  };

  useEffect(() => {
    fetchCAList();
  }, []);

  // Submit assigned CA
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await API.put(`/cases/assign/${caseId}`, {
        caId: values.ca, // selected CA ID
      });

      setLoading(false);
      message.success("CA Assigned Successfully!");

      navigate("/cases");

    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error("Failed to assign CA");
    }
  };

  return (
    <AdminLayout>
      <div className="case-container">

        <h2 className="page-title">Assign CA</h2>

        <Form layout="vertical" onFinish={onFinish} form={form} className="assign-form">

          <Form.Item label="Select CA" name="ca" rules={[{ required: true }]}>
            <Select placeholder="Choose CA">
              {caList.map((ca) => (
                <Select.Option key={ca._id} value={ca._id}>
                  {ca.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ backgroundColor: "#199A8D", width: "100%" }}
          >
            Assign CA
          </Button>

        </Form>

      </div>
    </AdminLayout>
  );
};

export default AssignCA;
