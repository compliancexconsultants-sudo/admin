import React, { useEffect, useState } from "react";
import { Card, Tag, Spin } from "antd";
import { useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import API from "../../utils/api";
import "./Cases.css";

const CaseView = () => {
  const { caseId } = useParams();              // ← GET CASE ID FROM URL
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch case from backend
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await API.get(`/cases/details/${caseId}`);
        console.log("Case Details:", res.data);
        setCaseDetails(res.data);
      } catch (err) {
        console.error("Error fetching case:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  if (loading) return <Spin size="large" style={{ marginTop: "100px" }} />;

  if (!caseDetails) return <h2>No case found</h2>;

  return (
    <AdminLayout>
      <div className="case-container">
        <h2 className="page-title">Case Details</h2>

        <Card className="case-card">

          <p><strong>User:</strong> {caseDetails.user?.name}</p>
          <p><strong>Email:</strong> {caseDetails.user?.email}</p>
          <p><strong>Phone:</strong> {caseDetails.user?.phone}</p>

          <p><strong>Service:</strong> {caseDetails.serviceName}</p>

          <p><strong>Assigned CA:</strong> 
            {caseDetails.assignedCAName || " Not Assigned"}
          </p>

          <p>
            <strong>Status:</strong>  
            <Tag color={caseDetails.status === "completed" ? "green" : "orange"}>
              {caseDetails.status}
            </Tag>
          </p>

          <p><strong>Submitted:</strong> 
            {new Date(caseDetails.createdAt).toLocaleString()}
          </p>

          <p><strong>Documents:</strong></p>
          <ul>
            {caseDetails.documents && caseDetails.documents.length > 0 ? (
              caseDetails.documents.map((doc, index) => (
                <li key={index}>
                  <a href={doc.file} target="_blank" rel="noopener noreferrer">
                    {doc.key}
                  </a>
                </li>
              ))
            ) : (
              <li>No documents uploaded</li>
            )}
          </ul>

        </Card>
      </div>
    </AdminLayout>
  );
};

export default CaseView;
