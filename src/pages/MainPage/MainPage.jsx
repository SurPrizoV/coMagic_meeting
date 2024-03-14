import { Header } from "../../components/Header/Header";
import { UserCard } from "../../components/UserCard/UserCard";
import { useEffect, useState } from "react";
import { Breadcrumb, Layout, Input, Select } from "antd";
import s from "./MainPage.module.css";
import { getAllUsers } from "../../services/APIrequests";

const { Content } = Layout;

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "100%",
};

export const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState(null);
  const [filterAge, setFilterAge] = useState(null);

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

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <Layout style={layoutStyle}>
      <Header />
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }} />
        <div className={s.filters}>
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
        <div className={s.card_box}>
          {filteredUsers.map((user) => (
            <UserCard
              key={user.uid}
              id={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              photo={user.photo}
              age={user.age}
              gender={user.gender}
              city={user.city}
            />
          ))}
        </div>
      </Content>
    </Layout>
  );
};
