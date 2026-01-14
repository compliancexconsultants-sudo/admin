import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Card, Form, Input, Button, message } from "antd";
import "./ThemeSettings.css";

const AdminThemeSettings = () => {
  // Theme States
  const [theme, setTheme] = useState({
    primary: "#199A8D",
    text: "#222222",
    heading: "#000000",
  });

  // Section form state
  const [section, setSection] = useState({
    title: "",
    description: "",
  });

  // Saved sections
  const [sections, setSections] = useState(
    JSON.parse(localStorage.getItem("theme_sections") || "[]")
  );

  // Load saved theme on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("theme_settings"));
    if (saved) setTheme(saved);
  }, []);

  // Live theme update (affects entire UI)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.primary);
    root.style.setProperty("--text-color", theme.text);
    root.style.setProperty("--heading-color", theme.heading);
  }, [theme]);

  // Save theme settings
  const saveTheme = () => {
    localStorage.setItem("theme_settings", JSON.stringify(theme));
    message.success("Theme updated successfully!");
  };

  // Add new homepage section
  const addSection = () => {
    if (!section.title.trim()) {
      return message.error("Section title is required.");
    }

    const updated = [...sections, section];
    setSections(updated);
    localStorage.setItem("theme_sections", JSON.stringify(updated));

    setSection({ title: "", description: "" });
    message.success("Section added.");
  };

  return (
    <AdminLayout>
      <div className="theme-settings-container">
        <h2 className="page-title">Theme Customization</h2>

        {/* THEME CARD */}
        <Card className="theme-card">
          <h3 className="section-title">Choose Theme Colors</h3>

          {/* Primary Color Row */}
          <div className="theme-row">
            <div className="theme-label">Primary Color</div>

            <input
              type="color"
              value={theme.primary}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, primary: e.target.value }))
              }
              className="color-picker"
            />

            <Input
              style={{ width: 120 }}
              value={theme.primary}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, primary: e.target.value }))
              }
            />
          </div>

          {/* Text Color */}
          <div className="theme-row">
            <div className="theme-label">Main Text Color</div>

            <input
              type="color"
              value={theme.text}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, text: e.target.value }))
              }
              className="color-picker"
            />

            <Input
              style={{ width: 120 }}
              value={theme.text}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, text: e.target.value }))
              }
            />
          </div>

          {/* Heading Color */}
          <div className="theme-row">
            <div className="theme-label">Heading Color</div>

            <input
              type="color"
              value={theme.heading}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, heading: e.target.value }))
              }
              className="color-picker"
            />

            <Input
              style={{ width: 120 }}
              value={theme.heading}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, heading: e.target.value }))
              }
            />
          </div>

          <Button
            type="primary"
            style={{ backgroundColor: theme.primary, height: 45, marginTop: 20 }}
            onClick={saveTheme}
          >
            Save Theme
          </Button>
        </Card>

        {/* SECTION MANAGER */}
        <Card className="theme-card" style={{ marginTop: 20 }}>
          <h3 className="section-title">Homepage Sections</h3>

          <Form layout="vertical">
            <Form.Item label="Section Title">
              <Input
                placeholder="e.g., Why Choose Us"
                value={section.title}
                onChange={(e) =>
                  setSection((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Form.Item>

            <Form.Item label="Description">
              <Input.TextArea
                rows={3}
                placeholder="Short description about this section"
                value={section.description}
                onChange={(e) =>
                  setSection((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </Form.Item>

            <Button
              type="primary"
              style={{ backgroundColor: theme.primary }}
              onClick={addSection}
            >
              Add Section
            </Button>
          </Form>

          {/* Display saved sections */}
          <div style={{ marginTop: 20 }}>
            <h4>Saved Sections:</h4>

            {sections.length === 0 && <p className="muted">No sections added yet.</p>}

            {sections.map((sec, idx) => (
              <Card key={idx} style={{ marginTop: 10 }}>
                <h4>{sec.title}</h4>
                <p>{sec.description}</p>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminThemeSettings;
