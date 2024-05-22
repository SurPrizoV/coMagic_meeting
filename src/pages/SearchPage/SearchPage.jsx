import { useEffect, useState } from "react";
import {
  Layout,
  Breadcrumb,
  Input,
  Select,
  Card,
  Button,
  List,
  Pagination,
} from "antd";
import s from "./SearchPage.module.css";
import { getAllUsers } from "../../services/APIrequests";
import { Logo } from "../../components/Logo/Logo";
import { PageLayout } from "../../layout/Layout";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Meta } = Card;

export const SearchPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState(null);
  const [filterAge, setFilterAge] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(res);
      setFilteredUsers(res);
    });
  }, []);

  useEffect(() => {
    let filtered = users;
    if (filterCity) {
      filtered = filtered.filter((user) => user.city === filterCity);
    }
    if (filterAge) {
      filtered = filtered.filter((user) => user.age === filterAge);
    }
    setFilteredUsers(filtered);
  }, [users, filterCity, filterAge]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setFilteredUsers(users.slice(startIndex, endIndex));
  }, [currentPage, users]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <PageLayout
      contentChildren={
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <div>
              <Input.Search
                placeholder="Поиск по имени или фамилии"
                onSearch={handleSearch}
                style={{ width: 200, marginRight: 16 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Фильтр по городу"
                style={{ width: 200, marginRight: 16 }}
                onChange={(value) => setFilterCity(value)}
                allowClear
              >
                {users &&
                  users
                    .reduce((uniqueCities, user) => {
                      if (!uniqueCities.includes(user.city)) {
                        uniqueCities.push(user.city);
                      }
                      return uniqueCities;
                    }, [])
                    .map((city) => (
                      <Select.Option key={city} value={city}>
                        {city}
                      </Select.Option>
                    ))}
              </Select>
              <Select
                placeholder="Фильтр по возрасту"
                style={{ width: 200 }}
                onChange={(value) => setFilterAge(value)}
                allowClear
              >
                {users &&
                  users
                    .reduce((uniqueAge, user) => {
                      if (!uniqueAge.includes(user.age)) {
                        uniqueAge.push(user.age);
                      }
                      return uniqueAge;
                    }, [])
                    .map((age) => (
                      <Select.Option key={age} value={age}>
                        {age}
                      </Select.Option>
                    ))}
              </Select>
            </div>
          </Breadcrumb>
          <div className={s.card_box}>
            {filteredUsers.map((user) => (
              <Card
              onClick={() => navigate(`/user/${user.uid}`)}
                key={user.uid}
                hoverable
                style={{ width: 296, height: 690 }}
                cover={
                  <img
                    alt={user.firstName}
                    src={user.photo}
                    style={{ width: 297, height: 445, objectFit: "cover" }}
                  />
                }
                actions={[
                  <Button
                    key="openButton"
                    type="primary"
                    target="_blank"
                    onClick={() => navigate(`/user/${user.uid}`)}
                  >
                    Открыть
                  </Button>,
                ]}
              >
                <Meta
                  title={`${user.firstName} ${user.lastName}`}
                  description={
                    <List
                      size="small"
                      dataSource={[
                        `Возраст: ${user.age}`,
                        `Пол: ${user.gender}`,
                        `Город: ${user.city}`,
                      ]}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  }
                />
              </Card>
            ))}
          </div>
          <Pagination
            style={{ marginTop: 16, textAlign: "center" }}
            current={currentPage}
            total={users.length}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </Content>
      }
      footerChildren={<Logo />}
    />
  );
};
