import React, { useEffect, useState } from "react";
import { Card, Tag } from "antd";
import AdminLayout from "../../components/layout/AdminLayout";
import "./Users.css";
import API from "../../utils/api";
import { useParams } from "react-router-dom";

const UserView = () => {
  const { uid } = useParams();
  const [data, setData] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const res = await API.get(`/user/details/${uid}`);
      setData(res.data);
    } catch (err) {
      console.error("User details error:", err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!data) return <AdminLayout><p>Loading...</p></AdminLayout>;

  const { user, totalCases, cases } = data;

  return (
    <AdminLayout>
      <div className="user-container">

        <h2 className="page-title">User Details</h2>

        <Card className="user-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Not Provided"}</p>
          <p><strong>Joined On:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Cases:</strong> {totalCases}</p>

          <br />

          <h3 className="sub-title">User Services</h3>
          <ul>
            {cases.map((c, i) => (
              <li key={i}>
                {c.serviceName} –
                <Tag
                  color={c.status === "completed" ? "green" : "orange"}
                  style={{ marginLeft: 5 }}
                >
                  {c.status}
                </Tag>
              </li>
            ))}
          </ul>

          <br />

          <h3 className="sub-title">Documents</h3>
          <ul>
            {cases.flatMap((c) =>
              c.documents?.map((d, index) => (
                <li key={index}>
                  <a href={d.file} target="_blank" rel="noreferrer">
                    {d.key}
                  </a>
                </li>
              ))
            )}
          </ul>

        </Card>

      </div>
    </AdminLayout>
  );
};

export default UserView;
