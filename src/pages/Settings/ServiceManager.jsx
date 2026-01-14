import React, { useEffect, useState } from "react";
import {
    Card,
    Collapse,
    Tag,
    Button,
    Popconfirm,
    Modal,
    Form,
    Input,
    Select,
    message,
    Space,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import API from "../../utils/api";
import AdminLayout from "../../components/layout/AdminLayout";

const { Panel } = Collapse;
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

export default function ServiceManager() {
    const [tags, setTags] = useState([]);
    const [services, setServices] = useState([]);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [editForm] = Form.useForm();

    // Load tags + services on mount
    useEffect(() => {
        loadTags();
        loadServices();
    }, []);

    const loadTags = async () => {
        try {
            const res = await API.get("/services/tags/list");
            setTags(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadServices = async () => {
        try {
            const res = await API.get("/services/list");
            setServices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getDocsList = () => DEFAULT_DOCUMENTS;

    /* ----------------------------------------------------------------
       EDIT SERVICE
    ---------------------------------------------------------------- */

    const openEditModal = (service) => {
        setEditingService(service);

        editForm.setFieldsValue({
            serviceName: service.name,
            price: service.price,
            documents: service.documents.map((d) => d.key),
            content: service.content,
            tagId: service.tagId._id || service.tagId,
        });

        setEditModalOpen(true);
    };

    const updateService = async () => {
        try {
            const values = await editForm.validateFields();
            const formattedDocs = values.documents.map((key) => {
                const doc = DEFAULT_DOCUMENTS.find((d) => d.key === key);
                return doc || { key, label: key };
            });

            const res = await API.put(`/services/update/${editingService._id}`, {
                name: values.serviceName,
                tagId: values.tagId,
                price: values.price,
                documents: formattedDocs,
                content: values.content || "",
            });

            // Update UI state
            setServices((prev) =>
                prev.map((s) => (s._id === editingService._id ? res.data : s))
            );

            message.success("Service updated");
            setEditModalOpen(false);
            setEditingService(null);
            loadTags();
            loadServices();
        } catch (err) {
            message.error("Update failed");
            console.log(err);
        }
    };

    /* ----------------------------------------------------------------
       DELETE SERVICE
    ---------------------------------------------------------------- */

    const deleteService = async (id) => {
        try {
            await API.delete(`/services/delete/${id}`);
            setServices((prev) => prev.filter((s) => s._id !== id));
            message.success("Service deleted");
        } catch (err) {
            message.error("Delete failed");
        }
    };

    /* ----------------------------------------------------------------
       GROUP SERVICES BY TAG
    ---------------------------------------------------------------- */

    const servicesByTag = tags.map((tag) => ({
        tag,
        services: services.filter((s) => s.tagId?._id === tag._id),
    }));

    /* ----------------------------------------------------------------
       RENDER
    ---------------------------------------------------------------- */

    return (
        <AdminLayout>
            <div style={{ padding: 20 }}>
                <h2>Service Manager</h2>
                <p className="muted">View, edit and delete services under each tag.</p>

                <Collapse accordion style={{ marginTop: 20 }}>
                    {servicesByTag.map(({ tag, services }) => (
                        <Panel
                            header={
                                <Space>
                                    <Tag color="blue">{tag.name}</Tag>
                                    <span style={{ color: "#999" }}>({services.length} services)</span>
                                </Space>
                            }
                            key={tag._id}
                        >
                            {services.length === 0 ? (
                                <div className="muted">No services under this tag</div>
                            ) : (
                                services.map((s) => (
                                    <Card
                                        key={s._id}
                                        style={{ marginBottom: 15 }}
                                        actions={[
                                            <Button
                                                icon={<EditOutlined />}
                                                onClick={() => openEditModal(s)}
                                            >
                                                Edit
                                            </Button>,
                                            <Popconfirm
                                                title="Delete this service?"
                                                onConfirm={() => deleteService(s._id)}
                                            >
                                                <Button danger icon={<DeleteOutlined />}>
                                                    Delete
                                                </Button>
                                            </Popconfirm>,
                                        ]}
                                    >
                                        <h3>{s.name}</h3>
                                        <p>
                                            <b>Price:</b> ₹{s.price}
                                        </p>

                                        <b>Documents:</b>
                                        <div style={{ marginTop: 6 }}>
                                            {s.documents.map((d, i) => (
                                                <Tag key={i}>{d.label}</Tag>
                                            ))}
                                        </div>

                                        {s.content && (
                                            <p style={{ marginTop: 10 }}>
                                                <b>Description:</b> {s.content}
                                            </p>
                                        )}
                                    </Card>
                                ))
                            )}
                        </Panel>
                    ))}
                </Collapse>

                {/* -----------------------------------------
            EDIT SERVICE MODAL
        ----------------------------------------- */}

                <Modal
                    title="Edit Service"
                    open={editModalOpen}
                    onCancel={() => setEditModalOpen(false)}
                    onOk={updateService}
                >
                    <Form layout="vertical" form={editForm}>
                        <Form.Item label="Service Name" name="serviceName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Tag" name="tagId" rules={[{ required: true }]}>
                            <Select>
                                {tags.map((t) => (
                                    <Option key={t._id} value={t._id}>
                                        {t.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Price (₹)" name="price" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item label="Documents" name="documents" rules={[{ required: true }]}>
                            <Select mode="multiple">
                                {DEFAULT_DOCUMENTS.map((d) => (
                                    <Option key={d.key} value={d.key}>
                                        {d.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Description" name="content">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
