import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import "./CA.css";
import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const CAList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // Fetch CA list from backend
    const fetchCAs = async () => {
        try {
            setLoading(true);
            const res = await API.get("/ca");
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            message.error("Failed to load CA list");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCAs();
    }, []);

    // Delete CA
    const deleteCA = async (id) => {
        try {
            await API.delete(`/ca/${id}`);
            message.success("CA deleted successfully");
            fetchCAs(); // refresh table
        } catch (err) {
            console.log(err);
            message.error("Failed to delete CA");
        }
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Phone",
            dataIndex: "phone"
        },
        {
            title: "Specialization",
            dataIndex: "specialization"
        },
        {
            title: "Actions",
            render: (record) => (
                <div>

                    {/* EDIT BUTTON */}
                    <Button
                        type="primary"
                        style={{ backgroundColor: "#199A8D" }}
                        onClick={() => navigate(`/edit-ca/${record._id}`)}
                    >
                        Edit
                    </Button>

                    {/* DELETE BUTTON */}
                    <Popconfirm
                        title="Are you sure you want to delete this CA?"
                        onConfirm={() => deleteCA(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger style={{ marginLeft: 10 }}>
                            Delete
                        </Button>
                    </Popconfirm>

                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="ca-container">

                <div className="ca-header">
                    <h2>Manage CA</h2>

                    <Button
                        type="primary"
                        style={{ backgroundColor: "#199A8D" }}
                        onClick={() => navigate('/add-ca')}
                    >
                        + Add CA
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="_id"
                    loading={loading}
                    scroll={{ x: 600 }}
                />

            </div>
        </AdminLayout>
    );
};

export default CAList;
