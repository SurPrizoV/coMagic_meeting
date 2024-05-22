import { useEffect, useState } from "react";
import { Layout, Typography, Tag, Button, Image, Spin } from "antd";
import s from "./UserPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUser,
  getUserData,
  handleSendFriendship,
  handleAcceptFriendship,
  handleRemoveFriendship,
  getFriends,
  checkExistingFriendship,
} from "../../services/APIrequests";
import { PageLayout } from "../../layout/Layout";
import { Logo } from "../../components/Logo/Logo";
import User from "../../store/user";
import FriendId from "../../store/friends";
import { observer } from "mobx-react-lite";

const { Content } = Layout;

const badgeColors = ["#108ee9", "#87d068", "#2db7f5"];

export const UserPage = observer(() => {
  const [user, setUser] = useState();
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uid = localStorage.getItem("access");

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUser().then((res) => {
      User.data.displayName = res.displayName;
      User.data.photo = res.photo;
    });

    getUserData(params.id)
      .then((res) => setUser(res[0]))
      .catch((error) => {
        console.error("Ошибка при получении данных о пользователе, ", error);
        setError(
          "Ошибка при получении данных о пользователе, обновите страницу."
        );
      })
      .finally(() => setLoading(false));

    getFriends(uid)
      .then((friends) => {
        const friend = friends.find((friend) => friend.senderUid === params.id);
        setIsFriend(friend !== undefined && friend.status);
      })
      .catch((error) => {
        console.error("Ошибка при получении списка друзей:", error);
        setError("Ошибка при получении списка друзей");
      });

    checkExistingFriendship(uid, params.id)
      .then((existingFriendship) => {
        setIsRequestSent(existingFriendship);
      })
      .catch((error) => {
        console.error(
          "Ошибка при проверке существующего запроса на дружбу:",
          error
        );
      });

    checkExistingFriendship(params.id, uid)
      .then((existingFriendshipFromRecipient) => {
        if (existingFriendshipFromRecipient) {
          setIsFriend(true);
        }
      })
      .catch((error) => {
        console.error(
          "Ошибка при проверке существующего запроса на дружбу от пользователя:",
          error
        );
      });
  }, []);

  const handleAddFriend = () => {
    setLoading(true);
    handleSendFriendship(uid, params.id)
      .then(() => {
        setIsRequestSent(true);
      })
      .catch((error) => {
        console.error("Ошибка при попытке добавить в друзья, ", error);
        setError("Ошибка при попытке добавить в друзья, обновите страницу");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAcceptRequest = () => {
    setLoading(true);
    handleAcceptFriendship(params.id, uid)
      .then(() => {
        setIsFriend(true);
      })
      .catch((error) => {
        console.error("Ошибка при принятии запроса, ", error);
        setError("Ошибка при подтверждении запроса на добавление в друзья");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveFriend = () => {
    setLoading(true);
    const friendshipId = FriendId.data.find(
      (item) => item.friendId === params.id
    )?.id;
    handleRemoveFriendship(friendshipId)
      .then(() => {
        setIsFriend(false);
      })
      .catch((error) => {
        console.error("Ошибка при удалении из друзей, ", error);
        setError("Ошибка при удалении из друзей");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PageLayout
      contentChildren={
        <Content
          style={{
            margin: "8px 0px",
          }}
        >
          <Spin spinning={loading} size="large">
            {error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <div className={s.container}>
                <Image
                  style={{ borderRadius: "10px" }}
                  width={380}
                  src={user && user.photo}
                />
                <div className={s.description}>
                  <Typography.Title level={3}>
                    {user?.firstName} {user?.lastName}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    Возраст: {user?.age}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    Город: {user?.city}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    Пол: {user?.gender}
                  </Typography.Title>
                  <div>
                    <Typography.Title level={4}>Увлечения:</Typography.Title>
                    <div className={s.badges}>
                      {user &&
                        user.hobbies.map((hobby) => {
                          const color =
                            badgeColors[
                              Math.floor(Math.random() * badgeColors.length)
                            ];
                          return (
                            <Tag color={color} key={hobby}>
                              {hobby}
                            </Tag>
                          );
                        })}
                    </div>
                  </div>
                  <div className={s.buttons}>
                    {isFriend ? (
                      <Button
                        type="primary"
                        onClick={handleRemoveFriend}
                        loading={loading}
                      >
                        Удалить из друзей
                      </Button>
                    ) : isRequestSent ? (
                      <Button
                        type="primary"
                        onClick={handleAcceptRequest}
                        loading={loading}
                      >
                        Принять запрос
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={handleAddFriend}
                        loading={loading}
                      >
                        Добавить в друзья
                      </Button>
                    )}
                    <Button
                      type="primary"
                      onClick={() => navigate(`/chat/${user.uid}`)}
                    >
                      Написать сообщение
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Spin>
        </Content>
      }
      footerChildren={<Logo />}
    />
  );
});