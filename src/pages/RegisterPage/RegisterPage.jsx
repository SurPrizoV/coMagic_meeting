import { observer } from "mobx-react-lite";
import { Button, Form, Input, Spin } from "antd";
import { handleRegister } from "../../services/APIrequests";
import s from "./RegisterPage.module.css";
import User from "../../store/user";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo/Logo";

export const RegisterPage = observer(() => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    User.setLoading();
    handleRegister(values.mail, values.password)
      .then((userCredential) => {
        localStorage.setItem("access", userCredential.user.uid);
        User.data.uid = localStorage.getItem("access");
        User.data.photo = userCredential.user.photoURL
        navigate("/");
      })
      .catch((error) => {
        console.error("Ошибка регистрации:", error);
        User.data.error = "Произошла ошибка, попробуйте позже.";
        setTimeout(() => {
          User.data.error = "";
        }, 3000);
      })
      .finally(() => {
        User.setLoading();
      });
  };
  const onFinishFailed = () => {
    User.data.error("Пожалуйста, введите электронную почту и пароль.");
  };

  return (
    <div className={s.form}>
      <header className={s.header}>
        <Logo />
      </header>
      <Spin spinning={User.data.loading} size="large">
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
            padding: "0 16px",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="E-mail"
            name="mail"
            rules={[
              {
                required: true,
                message: "Пожалуйста введите e-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: "Пожалуйста введите пароль!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            {User.data.error && (
              <p style={{ color: "red" }}>{User.data.error}</p>
            )}
            <Button
              type="primary"
              htmlType="submit"
            >
              Регистрация
            </Button>
          </Form.Item>
          <Link to={"/login"} style={{fontSize: "12px"}}>Есть аккаунт?</Link>
        </Form>
      </Spin>
    </div>
  );
});
