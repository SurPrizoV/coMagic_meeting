/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  UserOutlined,
  MailOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Badge } from "antd";
import { getAllChats, getAllUsers } from "../services/APIrequests";
import { Link } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { observer } from "mobx-react-lite";
import { getFriends, getFriendshipRequests } from "../services/APIrequests";
import FriendId from "../store/friends";

const { Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export const PageLayout = observer(({ contentChildren, footerChildren }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [chats, setChats] = useState([]);
  const [unreadMes, setUnreadMes] = useState([]);
  const [unreadMesCount, setUnreadMesCount] = useState(0);
  const [friends, setFriends] = useState([]);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);
  const [allUsers, setAllUsers] = useState([]);

  const uid = localStorage.getItem("access");

  useEffect(() => {
    getAllChats(uid).then((chats) => {
      const unreadCounts = chats.map((chat) => {
        const unreadMessages = chat.messages.filter((message) => {
          const isRecipient = message.recipientUid === uid && !message.read;
          return isRecipient;
        });
        return unreadMessages.length;
      });
      setChats(chats.map((chat) => chat.participantData));
      setUnreadMes(unreadCounts);
      const totalUnreadCount = unreadCounts.reduce(
        (acc, count) => acc + count,
        0
      );
      setUnreadMesCount(totalUnreadCount);
    });

    getFriends(uid).then((res) => {
      setFriends(res.filter((friend) => friend.status === true));
      const data = res.map((friend) => ({
        id: friend.id,
        friendId: friend.senderUid,
      }));
      FriendId.data = data;
    });

    getFriendshipRequests(uid).then((res) => {
      setFriendRequestsCount(res.length);
    });

    getAllUsers().then((users) => {
      setAllUsers(users);
    });
  }, []);

  const items = [
    getItem(
      "Моя страница",
      "profile_page",
      <Link to={"/"}>
        <UserOutlined />
      </Link>
    ),
    getItem(
      "Сообщения",
      "messages",
      <Badge
        size="small"
        style={{ right: "12px", position: "relative" }}
        count={unreadMesCount}
      >
        <MailOutlined />
      </Badge>,
      [
        ...chats.map((chat, index) => {
          return getItem(
            <span>
              <Link to={`/chat/${chat?.id}`}>
                {`${chat?.firstName} ${chat?.lastName}`}
              </Link>
              &nbsp;
              <Badge size="small" count={unreadMes[index]} />
            </span>,
            index
          );
        }),
      ]
    ),
    // getItem(
    //   "Друзья",
    //   "friends",
    //   <Badge
    //     size="small"
    //     style={{ right: "12px", position: "relative" }}
    //     count={friendRequestsCount}
    //   >
    //     <Link to={"/friends"} style={{ color: "inherit" }}>
    //       <TeamOutlined />
    //     </Link>
    //   </Badge>,
    //   [
    //     ...friends.map((friend) => {
    //       const user = allUsers.find((user) => user.id === friend.senderUid || user.id === friend.recipientUid);
    //       return getItem(
    //         <span key={friend.id}>
    //           <Link to={`/user/${friend.senderUid}`}>
    //             {user.firstName} {user.lastName}
    //           </Link>
    //         </span>
    //       );
    //     }),
    //   ]
    // ),

    getItem(
      "Друзья",
      "friends",
      <Badge
        size="small"
        style={{ right: "12px", position: "relative" }}
        count={friendRequestsCount}
      >
        <Link to={"/friends"} style={{ color: "inherit" }}>
          <TeamOutlined />
        </Link>
      </Badge>,
      [
        ...friends.map((friend) => {
          const isSender = friend.senderUid === uid;
          const userId = isSender ? friend.recipientUid : friend.senderUid;
          const user = allUsers.find((user) => user.id === userId);
          return getItem(
            <span key={userId}>
              <Link to={`/user/${userId}`}>
                {user.firstName} {user.lastName}
              </Link>
            </span>
          );
        }),
      ]
    ),
    getItem(
      "Поиск",
      "search",
      <Link to={"/search"}>
        <SearchOutlined />
      </Link>
    ),
  ];

  return (
    <Layout
      style={{
        minHeight: "100dvh",
        minWidth: "100dvw",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header />
        {contentChildren}
        <Footer
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {footerChildren}
        </Footer>
      </Layout>
    </Layout>
  );
});
