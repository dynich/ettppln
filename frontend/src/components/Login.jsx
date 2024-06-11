import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, Typography, message } from "antd";
import { LoginUser, reset } from "../features/authSlice";
import { MailOutlined, LockOutlined } from "@ant-design/icons"

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const onFinish = (values) => {
    const { email, password } = values;
    dispatch(LoginUser({ email, password }));
  };

  return (
    <section className="hero is-fullheight is-fullwidth">
      <div className="login-page">
        <div className="login-left">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src="/ettppln_white.svg"
              alt="Gambar Anda"
              style={{
                maxWidth: "60%",
                maxHeight: "200px",
                margin: "20px auto",
              }}
            />
          </div>
        </div>

        <div className="login-right">
          <Form
            form={form}
            name="login-form"
            onFinish={onFinish}
            className="custom-form"
          >
            {isError && (
              <p className="has-text-centered" style={{ color: "red" }}>
                {message}
              </p>
            )}
            <Title
              level={2}
              style={{ marginBottom: "35px", fontSize: "30px", fontWeight: 700 }}
            >
              Sign In
            </Title>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={
                  <MailOutlined
                    style={{ color: "#868AA5", marginRight: "8px" }}
                  />
                }
                placeholder="Email"
                type="email"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined
                    style={{ color: "#868AA5", marginRight: "8px" }}
                  />
                }
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                style={{ width: "100%" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
