import { Button, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../layout/Layout";
import { Logo } from "../../components/Logo/Logo";

const { Content } = Layout;

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  alignItems: "center",
  padding: "8px",
  overflowY: "auto",
};

export const NotFound = () => {
  const navigate = useNavigate("/");

  return (
    <PageLayout
      contentChildren={
        <Content style={contentStyle}>
          <Typography.Title level={2}>Такой страницы нет!</Typography.Title>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => navigate("/")}
          >
            Вернуться?
          </Button>
        </Content>
      }
      footerChildren={<Logo />}
    />
  );
};
