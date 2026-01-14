import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./Login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    const { email, password } = values;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        message.success("Login successful");
        window.location.href = "/Dashboard"; // Redirect to admin dashboard
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input size="large" placeholder="Enter admin email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password size="large" placeholder="Enter admin password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
