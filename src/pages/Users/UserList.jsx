import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import AdminLayout from "../../components/layout/AdminLayout";
import "./Users.css";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);



  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await API.get("/user/list");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Actions",
      render: (record) => {
        console.log('record : ', record);
        
        return (
          <Button
            type="primary"
            style={{ backgroundColor: "#199A8D" }}
            onClick={() => navigate(`/user/${record.firebaseUid}`)}
          >
            View
          </Button>
        )
      }

    },
  ];

  return (
    <AdminLayout>
      <div className="user-container">

        <h2 className="page-title">Users</h2>

        <Input
          placeholder="Search by name or email..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="uid"
          style={{ marginTop: 20 }}
          scroll={{ x: 600 }}
        />
      </div>
    </AdminLayout>
  );
};

export default UserList;
