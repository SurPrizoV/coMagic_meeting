import { Header } from "../../components/Header/Header";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Layout,
  Card,
  Flex,
  Typography,
  Tag,
  Button,
} from "antd";
import s from "./UserPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getUserData } from "../../services/APIrequests";

const { Content } = Layout;

const cardStyle = {
  width: 620,
};
const imgStyle = {
  display: "block",
  width: 273,
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "100dvw",
  height: "100dvh",
};

export const UserPage = () => {
  const [user, setUser] = useState();

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getUserData(params.id).then((res) => setUser(res[0]));
  }, []);

  return (
    <Layout style={layoutStyle}>
      <Header />
      <Content
        style={{
          margin: "0 16px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        ></Breadcrumb>
        <Card
          hoverable
          style={cardStyle}
          styles={{
            body: {
              padding: 0,
              overflow: "hidden",
            },
          }}
        >
          <Flex justify="space-between">
            <img alt="avatar" src={user && user.photo} style={imgStyle} />
            <Flex
              vertical
              align="flex-end"
              justify="space-between"
              style={{
                padding: 32,
              }}
            >
              <div className={s.about}>
                <Typography.Title level={3}>
                  {user?.firstName} {user?.lastName}
                </Typography.Title>
                <Typography.Title level={5}>{user?.age}</Typography.Title>
                <Typography.Title level={5}>{user?.city}</Typography.Title>
                <Typography.Title level={5}>{user?.gender}</Typography.Title>
                <div className={s.badges}>
                  {user &&
                    user.hobbies.map((hobby) => {
                      let color = "#108ee9";
                      if (hobby.length > 5) {
                        color = "#87d068";
                      } else if (hobby.length < 8) {
                        color = "#2db7f5";
                      }

                      return (
                        <Tag color={color} key={hobby}>
                          {hobby}
                        </Tag>
                      );
                    })}
                </div>
              </div>
              <Button
                type="primary"
                onClick={() => navigate(`/chat/${user.uid}`)}
              >
                Написать
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Content>
    </Layout>
  );
};
