import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Table, Tag } from "antd";
import { Line, Bar } from '@ant-design/plots';
import AdminLayout from "../../components/layout/AdminLayout";
import API from "../../utils/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [newCases, setNewCases] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [signupGraph, setSignupGraph] = useState([]);
  const [caseGraph, setCaseGraph] = useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/stats/stats");

      setStats({
        totalUsers: res.data.totalUsers,
        totalCases: res.data.totalCases,
        completedCases: res.data.completedCases,
      });

      setNewCases(res.data.newCases);
      setRecentCases(res.data.recentCases);

      // Generate graph data
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

      // USER SIGNUPS
      const userData = await API.get("/user/list");
      const monthlyUsers = monthNames.map((m, i) => ({
        month: m,
        users: userData.data.filter(u => new Date(u.createdAt).getMonth() === i).length
      }));
      setSignupGraph(monthlyUsers);

      // CASE GROWTH
      const allCases = await API.get("/cases/list");
      const monthlyCases = monthNames.map((m, i) => ({
        month: m,
        cases: allCases.data.filter(c => new Date(c.createdAt).getMonth() === i).length
      }));
      setCaseGraph(monthlyCases);

    } catch (error) {
      console.log("Dashboard load error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const recentColumns = [
    { title: "User", dataIndex: "user" },
    { title: "Service", dataIndex: "service" },
    { title: "CA", dataIndex: "ca" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status}
        </Tag>
      )
    },
    {
      title: "Open",
      render: (record) => (
        <Button 
          type="primary"
          style={{ backgroundColor: "#199A8D" }}
          onClick={() => navigate(`/case/${record.caseId}`)}
        >
          View
        </Button>
      )
    }
  ];

  const recentCaseData = recentCases.map(c => ({
    caseId: c.caseId,
    user: c.user?.name || "Unknown",
    service: c.serviceName,
    ca: c.assignedCAName || "Not Assigned",
    status: c.status,
  }));

  const signupConfig = {
    data: signupGraph,
    xField: "month",
    yField: "users",
    color: "#199A8D",
    smooth: true,
  };

  const casesConfig = {
    data: caseGraph,
    xField: "month",
    yField: "cases",
    color: "#199A8D",
  };

  return (
    <AdminLayout>
      <div className="dash-container">

        <h2 className="page-title">Dashboard</h2>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="stats-row">
          <Col xs={12} md={6}>
            <Card className="stat-card">
              <h3>New Cases</h3>
              <p className="stat-value">{newCases.length}</p>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="stat-card">
              <h3>New Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="stat-card">
              <h3>Total Cases</h3>
              <p className="stat-value">{stats.totalCases}</p>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="stat-card">
              <h3>Completed</h3>
              <p className="stat-value">{stats.completedCases}</p>
            </Card>
          </Col>
        </Row>

        {/* New Case Alerts */}
        <Card className="new-cases-card">
          <h3>New Case Alerts</h3>

          {newCases.map((c) => (
            <div className="alert-row" key={c.caseId}>
              <div>
                <strong>{c.user?.name}</strong> — {c.serviceName}
                <p className="time-text">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>

              <Button 
                type="primary"
                style={{ backgroundColor: "#199A8D" }}
                onClick={() => navigate(`/assign-ca/${c.caseId}`)}
              >
                Assign
              </Button>
            </div>
          ))}
        </Card>

        {/* Graphs */}
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col xs={24} md={12}>
            <Card>
              <h3>User Signups</h3>
              <Line {...signupConfig} />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card>
              <h3>Case Growth</h3>
              <Bar {...casesConfig} />
            </Card>
          </Col>
        </Row>

        {/* Recent Cases */}
        <Card className="recent-card" style={{ marginTop: 20 }}>
          <h3>Recent Cases</h3>
          <Table
            columns={recentColumns}
            dataSource={recentCaseData}
            rowKey="caseId"
            pagination={false}
            scroll={{ x: 600 }}
          />
        </Card>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
