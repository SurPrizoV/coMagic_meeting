import { Header } from "../../components/Header/Header";
import { Button, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  alignItems: "flex-end",
  padding: "8px",
  overflowY: "auto",
};
const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  height: "100dvh",
  width: "100dvw",
};

export const NotFound = () => {
  const navigate = useNavigate("/");

  return (
    <Layout style={layoutStyle}>
      <Header />
      <Content style={contentStyle}>
        <Typography.Title level={2}>Такой страницы нет!</Typography.Title>
        <Button type="primary" htmlType="submit" onClick={() => navigate("/")}>
          Вернуться?
        </Button>
      </Content>
    </Layout>
  );
};
