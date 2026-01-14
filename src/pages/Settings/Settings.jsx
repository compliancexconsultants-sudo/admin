import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Tag,
  List,
  Modal,
  Popconfirm,
  message,
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/layout/AdminLayout";
import API from "../../utils/api";
import "./Settings.css";

const { Option } = Select;

const DEFAULT_DOCUMENTS = [
  { key: "pan", label: "PAN Card" },
  { key: "aadhaar", label: "Aadhaar Card" },
  { key: "bank_statement", label: "Bank Statement" },
  { key: "passport", label: "Passport" },
  { key: "photo", label: "Passport Size Photo" },
  { key: "rent_agreement", label: "Rental Agreement" },
  { key: "electricity_bill", label: "Electricity Bill" },
];

export default function Settings() {
  const [tags, setTags] = useState([]);
  const [services, setServices] = useState([]);

  const [tagForm] = Form.useForm();
  const [serviceForm] = Form.useForm();

  const [editingService, setEditingService] = useState(null);

  const [viewDocsModal, setViewDocsModal] = useState({
    visible: false,
    docs: [],
    serviceName: "",
  });

  // --------------------------------------------
  // LOAD TAGS & SERVICES
  // --------------------------------------------
  useEffect(() => {
    loadTags();
    loadServices();
  }, []);

  const loadTags = async () => {
    try {
      const res = await API.get("/services/tags/list");
      setTags(res.data);
    } catch (err) {
      console.error("Tag load error", err);
    }
  };

  const loadServices = async () => {
    try {
      const res = await API.get("/services/list");
      setServices(res.data);
    } catch (err) {
      console.error("Service load error", err);
    }
  };

  // --------------------------------------------
  // TAG MANAGEMENT
  // --------------------------------------------
  const addTag = async (values) => {
    try {
      const res = await API.post("/services/tags/create", { name: values.tagName });

      setTags((prev) => [...prev, res.data]);
      tagForm.resetFields();
      message.success("Tag added");
    } catch (err) {
      message.error(err.response?.data?.message || "Tag creation failed");
    }
  };

  const editTag = async (id, newName) => {
    try {
      const res = await API.put(`/services/tags/update/${id}`, { name: newName });

      setTags((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
      message.success("Tag updated");
    } catch (err) {
      message.error("Error updating tag");
    }
  };

  const deleteTag = async (id) => {
    try {
      await API.delete(`/services/tags/delete/${id}`);

      setTags((prev) => prev.filter((t) => t._id !== id));
      setServices((prev) => prev.filter((s) => s.tagId !== id));

      message.success("Tag deleted");
    } catch (err) {
      message.error("Error deleting tag");
    }
  };

  // --------------------------------------------
  // SERVICE MANAGEMENT
  // --------------------------------------------
  const onAddOrUpdateService = async (values) => {
    const { tagId, serviceName, price, documents, content } = values;

    const formattedDocs = documents.map((key) => {
      const doc = DEFAULT_DOCUMENTS.find((d) => d.key === key);
      return doc || { key, label: key };
    });

    try {
      if (editingService) {
        // UPDATE
        const res = await API.put(`/services/update/${editingService._id}`, {
          tagId,
          name: serviceName,
          price,
          documents: formattedDocs,
          content,
        });

        setServices((prev) =>
          prev.map((s) => (s._id === editingService._id ? res.data : s))
        );

        setEditingService(null);
        serviceForm.resetFields();
        message.success("Service updated");
      } else {
        // CREATE
        const res = await API.post("/services/create", {
          tagId,
          name: serviceName,
          price,
          documents: formattedDocs,
          content,
        });

        setServices((prev) => [...prev, res.data]);
        serviceForm.resetFields();
        message.success("Service added");
      }
    } catch (err) {
      message.error("Service save failed");
      console.error(err);
    }
  };

  const startEditService = (service) => {
    setEditingService(service);

    serviceForm.setFieldsValue({
      tagId: service.tagId._id || service.tagId,
      serviceName: service.name,
      price: service.price,
      documents: service.documents.map((d) => d.key),
      content: service.content,
    });
  };

  const cancelEdit = () => {
    setEditingService(null);
    serviceForm.resetFields();
  };

  const deleteService = async (id) => {
    try {
      await API.delete(`/services/delete/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      message.success("Service deleted");
    } catch (err) {
      message.error("Error deleting service");
    }
  };

  // --------------------------------------------
  // DOCUMENT MODAL
  // --------------------------------------------
  const openViewDocs = (service) => {
    setViewDocsModal({
      visible: true,
      docs: service.documents,
      serviceName: service.name,
    });
  };

  const closeViewDocs = () => {
    setViewDocsModal({ visible: false, docs: [], serviceName: "" });
  };

  // --------------------------------------------
  // RENDER UI
  // --------------------------------------------
  return (
    <AdminLayout>
      <div className="settings-container">
        <h2 className="page-title">Settings</h2>

        {/* TAG MANAGEMENT */}
        <Card className="settings-card">
          <h3 className="section-title">Manage Tags</h3>

          <Form layout="inline" form={tagForm} onFinish={addTag}>
            <Form.Item name="tagName" rules={[{ required: true }]}>
              <Input placeholder="Enter Tag (e.g., Company Registration)" />
            </Form.Item>

            <Button type="primary" htmlType="submit" style={{ background: "#199A8D" }}>
              Add Tag
            </Button>
          </Form>

          <div className="tag-list">
            {tags.map((t) => (
              <Tag key={t._id} color="blue" style={{ padding: 8 }}>
                <Space>
                  {t.name}
                  <EditTagInline
                    tag={t}
                    onEdit={editTag}
                    onDelete={() => deleteTag(t._id)}
                  />
                </Space>
              </Tag>
            ))}
          </div>
        </Card>

        {/* SERVICE MANAGEMENT */}
        <Card className="settings-card" style={{ marginTop: 20 }}>
          <h3 className="section-title">
            {editingService ? "Edit Service" : "Add Service"}
          </h3>

          <Form layout="vertical" form={serviceForm} onFinish={onAddOrUpdateService}>
            <Form.Item label="Tag" name="tagId" rules={[{ required: true }]}>
              <Select placeholder="Select Tag">
                {tags.map((t) => (
                  <Option key={t._id} value={t._id}>
                    {t.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Service Name" name="serviceName" rules={[{ required: true }]}>
              <Input placeholder="E.g. Pvt Ltd, LLP, OPC" />
            </Form.Item>

            <Form.Item label="Price (₹)" name="price" rules={[{ required: true }]}>
              <Input type="number" placeholder="Enter price" />
            </Form.Item>

            <Form.Item label="Documents" name="documents" rules={[{ required: true }]}>
              <Select mode="multiple" placeholder="Select required documents">
                {DEFAULT_DOCUMENTS.map((d) => (
                  <Option key={d.key} value={d.key}>
                    {d.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Service Description" name="content">
              <Input.TextArea rows={4} placeholder="Enter details" />
            </Form.Item>

            <Space>
              <Button type="primary" htmlType="submit" style={{ background: "#199A8D" }}>
                {editingService ? "Update" : "Save"}
              </Button>

              {editingService && <Button onClick={cancelEdit}>Cancel</Button>}
            </Space>
          </Form>
        </Card>

        {/* SERVICE LIST */}
        <Card className="settings-card" style={{ marginTop: 20 }}>
          <h3 className="section-title">All Services</h3>

          <List
            itemLayout="vertical"
            dataSource={services}
            renderItem={(s) => (
              <List.Item
                key={s._id}
                actions={[
                  <Button icon={<EyeOutlined />} onClick={() => openViewDocs(s)} />,
                  <Button icon={<EditOutlined />} onClick={() => startEditService(s)} />,
                  <Popconfirm title="Delete?" onConfirm={() => deleteService(s._id)}>
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={<b>{s.name}</b>}
                  description={
                    <>
                      <Tag color="green">{s.tagId?.name || "Tag Deleted"}</Tag>
                      <div>Price: ₹{s.price}</div>
                    </>
                  }
                />

                <b>Documents: </b>
                {s.documents.map((d, i) => (
                  <Tag key={i}>{d.label}</Tag>
                ))}
              </List.Item>
            )}
          />
        </Card>

        {/* DOC MODAL */}
        <Modal
          visible={viewDocsModal.visible}
          onCancel={closeViewDocs}
          footer={<Button onClick={closeViewDocs}>Close</Button>}
          title={`Documents for ${viewDocsModal.serviceName}`}
        >
          {viewDocsModal.docs.map((d, i) => (
            <Tag key={i}>{d.label}</Tag>
          ))}
        </Modal>
      </div>
    </AdminLayout>
  );
}

/* -------------------------------------------- */
/* INLINE COMPONENT FOR TAG EDITING             */
/* -------------------------------------------- */

function EditTagInline({ tag, onEdit, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(tag.name);

  if (edit) {
    return (
      <Space>
        <Input
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 140 }}
        />
        <Button
          size="small"
          onClick={() => {
            if (!value.trim()) return message.error("Name required");
            onEdit(tag._id, value.trim());
            setEdit(false);
          }}
        >
          Save
        </Button>
        <Button size="small" onClick={() => setEdit(false)}>
          Cancel
        </Button>
      </Space>
    );
  }

  return (
    <Space>
      <Button size="small" onClick={() => setEdit(true)}>
        Edit
      </Button>
      <Popconfirm title="Delete tag?" onConfirm={onDelete}>
        <Button size="small" danger>
          Delete
        </Button>
      </Popconfirm>
    </Space>
  );
}
