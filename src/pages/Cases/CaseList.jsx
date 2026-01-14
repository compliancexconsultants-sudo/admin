import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Select, message } from "antd";
import AdminLayout from "../../components/layout/AdminLayout";
import API from "../../utils/api";
import "./Cases.css";
import { useNavigate } from "react-router-dom";

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "assigned", label: "Assigned" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" }
  ];

  // UPDATE STATUS FUNCTION
  const updateStatus = async (caseId, newStatus) => {
    try {
      await API.put(`/cases/status/${caseId}`, { status: newStatus });

      message.success("Status updated successfully!");

      // Refresh all cases after update
      fetchCases();
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status");
    }
  };

  // TABLE COLUMNS
  const columns = [
    { title: "User", dataIndex: "user" },
    { title: "Service", dataIndex: "service" },
    { title: "Assigned CA", dataIndex: "ca" },
    { title: "Date", dataIndex: "date" },

    {
      title: "Status",
      dataIndex: "statusRaw",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          onChange={(val) => updateStatus(record.id, val)}
          options={statusOptions}
        />
      ),
    },

    {
      title: "Actions",
      render: (record) => (
        <div>
          <Button
            type="primary"
            style={{ backgroundColor: "#199A8D" }}
            onClick={() => navigate(`/case/${record.id}`)}
          >
            View
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            onClick={() => navigate(`/assign-ca/${record.id}`)}
          >
            Assign CA
          </Button>
        </div>
      ),
    },
  ];

  // Fetch all cases
  const fetchCases = async () => {
    try {
      const res = await API.get("/cases/list");
      setCases(res.data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Convert backend data → table format
  const caseData = cases.map((c) => ({
    mainid: c._id,
    id: c.caseId,
    user: c.user?.name || "Unknown",
    service: c.serviceName || "—",
    ca: c.assignedCAName || "Not Assigned",
    date: new Date(c.createdAt).toLocaleDateString(),
    status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
    statusRaw: c.status, // actual status used for dropdown
  }));

  return (
    <AdminLayout>
      <div className="case-container">
        <h2 className="page-title">All Cases</h2>

        <Table
          columns={columns}
          dataSource={caseData}
          rowKey="id"
          scroll={{ x: 700 }}
        />
      </div>
    </AdminLayout>
  );
};

export default CaseList;
