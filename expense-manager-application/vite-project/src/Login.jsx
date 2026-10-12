import { useState } from "react";
import axios from "axios";
import { Form, Input, Button } from "antd";

export default function LoginForm({ setIsLoggedIn }) {
  const [form] = Form.useForm();
  const [isRegister, setIsRegister] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleFinish = async ({ email, password }) => {
    setPending(true);
    setMessage("");

    try {
      const endpoint = isRegister ? "register" : "login";
      const response = await axios.post(
        `http://localhost:5001/api/${endpoint}`,
        { email, password },
        { withCredentials: true },
      );
      localStorage.setItem("token", response.data.data.token);
      setIsLoggedIn(true);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ?? "Unable to connect to the server",
      );
    } finally {
      setPending(false);
    }
  };

  const toggleMode = () => {
    setIsRegister((registering) => !registering);
    setMessage("");
    form.resetFields();
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="w-full h-full flex flex-col justify-center items-center my-10 mt-10 gap-2"
      >
        <Form.Item
          label="Email"
          name="email"
          className="mt-10"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input style={{ width: "150%" }} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password style={{ width: "150%" }} />
        </Form.Item>

        {isRegister && (
          <Form.Item
            label="Confirm Password"
            name="passwordConfirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password style={{ width: "150%" }} />
          </Form.Item>
        )}

        <Button
          type="primary"
          style={{ width: "20%" }}
          htmlType="submit"
          loading={pending}
        >
          {isRegister ? "Register" : "Login"}
        </Button>
        <Button
          type="link"
          htmlType="button"
          onClick={toggleMode}
          disabled={pending}
        >
          {isRegister ? "Switch to Login" : "Create an account"}
        </Button>

        {message && (
          <p role="status" style={{ marginTop: 10 }}>
            {message}
          </p>
        )}
      </Form>
    </div>
  );
}
