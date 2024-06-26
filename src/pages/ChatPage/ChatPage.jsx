import { Layout, Input, Button, Avatar, Spin } from "antd";
import { observer } from "mobx-react-lite";
import Chat from "../../store/chat";
import User from "../../store/user";
import {
  handleSendMessage,
  getAllMessages,
  getUser,
  updateMessageReadStatus,
} from "../../services/APIrequests";
import s from "./ChatPage.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../layout/Layout";

const { TextArea } = Input;
const { Content } = Layout;

const contentStyle = {
  display: "flex",
  flexDirection: "column-reverse",
  gap: "16px",
  alignItems: "flex-end",
  padding: "8px",
  overflowY: "auto",
  maxHeight: "calc(100vh - 220px)",
};

export const ChatPage = observer(() => {
  const [messages, setMessages] = useState();
  const [intervalId, setIntervalId] = useState(null);

  const params = useParams();

  const uid = localStorage.getItem("access");
  const secondUid = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        Chat.setLoading();
        const user = await getUser();
        let data = await getAllMessages(uid, secondUid);
        User.data.displayName = user.displayName;
        User.data.photo = user.photo;

        data.forEach((message) => {
          if (message.recipientUid === uid && !message.read) {
            updateMessageReadStatus(message.id);
          }
        });

        setMessages(data);
      } catch (error) {
        console.error("Ошибка при получении сообщений:", error);
        Chat.data.error = "Произошла ошибка, попробуйте позже.";
        setTimeout(() => {
          User.data.error = "";
        }, 3000);
      } finally {
        Chat.setLoading(false);
      }
    };

    fetchData();
    const id = setInterval(fetchData, 3000);
    setIntervalId(id);

    return () => clearInterval(intervalId);
  }, [uid, secondUid]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const sendMessage = async (message, displayName, photo, id, secondId) => {
    try {
      Chat.setLoading();
      await handleSendMessage(message, displayName, photo, id, secondId);
      const data = await getAllMessages(id, secondId);
      setMessages(data);
      Chat.setMessage("");
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      Chat.data.error = "Произошла ошибка, попробуйте позже.";
      setTimeout(() => {
        User.data.error = "";
      }, 3000);
    } finally {
      Chat.setLoading(false);
    }
  };

  return (
    <PageLayout
      contentChildren={
        <Content style={contentStyle}>
          {messages &&
            messages.map((message) => {
              const isMyMessage = message.senderUid === uid;

              return (
                <div key={message.id} className={s.message}>
                  <header
                    className={isMyMessage ? `${s.header_my}` : `${s.header}`}
                  >
                    <Avatar src={message.photo} alt="avatar" />
                    <p>{message.displayName}</p>
                  </header>
                  <div
                    className={
                      isMyMessage ? `${s.message_body_my}` : `${s.message_body}`
                    }
                  >
                    <p>{message.description}</p>
                    <p className={s.time}>
                      {formatTimestamp(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
        </Content>
      }
      footerChildren={
        <>
          <TextArea
            value={Chat.data.message}
            onChange={(e) => Chat.setMessage(e.target.value)}
            placeholder="Текст сообщения"
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
          <Spin spinning={Chat.data.loading} size="large">
            <Button
              type="primary"
              onClick={() =>
                sendMessage(
                  Chat.data.message,
                  User.data.displayName,
                  User.data.photo,
                  uid,
                  secondUid
                )
              }
            >
              Отправить
            </Button>
          </Spin>
          {Chat.data.error && <p style={{ color: "red" }}>{User.data.error}</p>}
        </>
      }
    />
  );
});
