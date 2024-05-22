import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Layout, Pagination, Spin } from "antd";
import { Logo } from "../../components/Logo/Logo";
import { PageLayout } from "../../layout/Layout";
import s from "./FriendsListPage.module.css";
import { getFriends, handleAcceptFriendship } from "../../services/APIrequests";
import { getAllUsers } from "../../services/APIrequests";

const { Content } = Layout;
const { Meta } = Card;

export const FriendsListPage = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingRequests, setLoadingRequests] = useState({});
  const pageSize = 8;
  const uid = localStorage.getItem("access");

  const navigate = useNavigate();

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const friendRequestsData = await getFriends(uid);
      const usersData = await getAllUsers();
      const filteredRequests = friendRequestsData.filter(
        (request) => request.status === false
      );
      const requestsWithUserData = filteredRequests.map((request) => {
        const userData = usersData.find(
          (user) => user.id === request.senderUid
        );
        return { ...request, ...userData };
      });
      setFriendRequests(requestsWithUserData);
    } catch (error) {
      console.error("Ошибка при получении запросов о дружбе:", error);
      setError("Ошибка при загрузке списка запросов на добавление в друзья");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (requestId) => {
    setLoadingRequests((prevLoadingRequests) => ({
      ...prevLoadingRequests,
      [requestId]: true,
    }));
    const uid = localStorage.getItem("access");
    handleAcceptFriendship(requestId, uid)
      .then(() => {
        fetchFriendRequests();
      })
      .catch((error) => {
        console.error("Ошибка при принятии запроса:", error);
        setError("Ошибка при подтверждении запроса на добавление в друзья");
      })
      .finally(() => {
        setLoadingRequests((prevLoadingRequests) => ({
          ...prevLoadingRequests,
          [requestId]: false,
        }));
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <PageLayout
      contentChildren={
        loading ? (
          <Spin />
        ) : (
          <Content
            style={{
              margin: "0 16px",
            }}
          >
            <div className={s.card_box}>
              {friendRequests.map((request) => (
                <Card
                  key={request.id}
                  hoverable
                  style={{ width: 296, height: "auto" }}
                  cover={
                    <img
                      alt={request.displayName}
                      src={request.photo}
                      style={{ width: 297, height: 445, objectFit: "cover" }}
                    />
                  }
                  actions={[
                    <Button
                      key="openButton"
                      type="primary"
                      target="_blank"
                      onClick={() => navigate(`/user/${request.senderUid}`)}
                    >
                      Открыть
                    </Button>,
                    <Button
                      key="acceptButton"
                      type="primary"
                      target="_blank"
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={loadingRequests[request.id]}
                    >
                      {loadingRequests[request.id] ? (
                        <Spin size="small" />
                      ) : (
                        "Принять"
                      )}
                    </Button>,
                  ]}
                >
                  <Meta title={request.displayName} />
                </Card>
              ))}
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            {friendRequests.length >= 1 && (
              <Pagination
                style={{ marginTop: 16, textAlign: "center" }}
                current={currentPage}
                total={friendRequests.length}
                pageSize={pageSize}
                onChange={handlePageChange}
              />
            )}
          </Content>
        )
      }
      footerChildren={<Logo />}
    />
  );
};
