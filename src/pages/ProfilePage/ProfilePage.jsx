import { useEffect, useState } from "react";
import {
  Layout,
  Button,
  Typography,
  Tag,
  Modal,
  Input,
  Select,
  Spin,
  Image,
} from "antd";
import s from "./ProfilePage.module.css";
import {
  getUser,
  getUserData,
  handleAddUserData,
  handleUpdateProfile,
  handleUploadPhoto,
} from "../../services/APIrequests";
import { PageLayout } from "../../layout/Layout";
import { Logo } from "../../components/Logo/Logo";

const { Content } = Layout;

const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const badgeColors = ["#108ee9", "#87d068", "#2db7f5"];

export const ProfilePage = () => {
  const [user, setUser] = useState({
    photo: "",
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    gender: "",
    hobbys: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [photoURL, setPhotoURL] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      try {
        const url = await handleUploadPhoto(selectedFile);
        setPhotoURL(url);
        setPhotoUploaded(true);
      } catch (error) {
        console.error("Ошибка при обработке загруженного файла:", error);
        setError("Ошибка при обработке загруженного файла, обновите страницу");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getUser()
      .then((res) => {
        if (res.displayName !== null || res.photo !== null) {
          const names = res.displayName?.split(" ");
          setUser((prevUser) => ({
            ...prevUser,
            photo: res.photo,
            firstName: names[0],
            lastName: names.length > 1 ? names.slice(1).join(" ") : "",
          }));
        }
      })
      .then(() => {
        const uid = localStorage.getItem("access");
        getUserData(uid).then((res) => {
          if (res.length !== 0) {
            setUser((prevUser) => ({
              ...prevUser,
              age: res[0].age,
              city: res[0].city,
              gender: res[0].gender,
              hobbys: res[0].hobbies,
            }));
          }
        });
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о пользователе, ", error);
        setError(
          "Ошибка при получении данных о пользователе, обновите страницу."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    handleUpdateProfile(user.firstName, user.lastName, photoURL);
    handleAddUserData(
      user.firstName,
      user.lastName,
      user.photo,
      user.age,
      user.gender,
      user.city,
      user.hobbys
    )
      .then((res) => console.log(res))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsModalOpen(false));
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (value) => {
    setUser((prevUser) => ({
      ...prevUser,
      gender: value,
    }));
  };
  const handleHobbiesChange = (values) => {
    setUser((prevUser) => ({
      ...prevUser,
      hobbys: values,
    }));
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
                  src={user.photo ? user.photo : photoURL}
                />
                <div className={s.description}>
                  <Typography.Title level={3}>
                    {user.firstName} {user.lastName}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    Возраст: {user.age}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    Город: {user.city}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    Пол: {user.gender}
                  </Typography.Title>
                  <div>
                    <Typography.Title level={4}>Увлечения:</Typography.Title>
                    <div className={s.badges}>
                      {user.hobbys &&
                        user.hobbys.map((hobby) => {
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
                  <Button type="primary" onClick={showModal}>
                    Редактировать
                  </Button>
                  <Modal
                    title="Редактирование"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Готово"
                    cancelText="Отмена"
                  >
                    <Input
                      style={{ marginBottom: "8px" }}
                      placeholder="Имя"
                      value={user.firstName}
                      onChange={(e) =>
                        setUser((prevUser) => ({
                          ...prevUser,
                          firstName: e.target.value,
                        }))
                      }
                    />
                    <Input
                      style={{ marginBottom: "8px" }}
                      placeholder="Фамилия"
                      value={user.lastName}
                      onChange={(e) =>
                        setUser((prevUser) => ({
                          ...prevUser,
                          lastName: e.target.value,
                        }))
                      }
                    />
                    <Input
                      style={{ marginBottom: "8px" }}
                      placeholder="Возраст"
                      value={user.age}
                      onChange={(e) =>
                        setUser((prevUser) => ({
                          ...prevUser,
                          age: e.target.value,
                        }))
                      }
                    />
                    <Input
                      style={{ marginBottom: "8px" }}
                      placeholder="Город"
                      value={user.city}
                      onChange={(e) =>
                        setUser((prevUser) => ({
                          ...prevUser,
                          city: e.target.value,
                        }))
                      }
                    />
                    <Select
                      style={{ marginBottom: "8px" }}
                      showSearch
                      placeholder="Выбирите пол"
                      optionFilterProp="children"
                      value={user.gender}
                      onChange={onChange}
                      filterOption={filterOption}
                      options={[
                        {
                          value: "мужской",
                          label: "мужской",
                        },
                        {
                          value: "женский",
                          label: "женский",
                        },
                      ]}
                    />
                    <Select
                      style={{ width: "200px", marginBottom: "8px" }}
                      showSearch
                      mode="multiple"
                      placeholder="Выбирите хобби"
                      optionFilterProp="children"
                      value={user.hobbys}
                      onChange={handleHobbiesChange}
                      filterOption={filterOption}
                      options={[
                        {
                          value: "спорт",
                          label: "спорт",
                        },
                        {
                          value: "театр",
                          label: "театр",
                        },
                        {
                          value: "кофе",
                          label: "кофе",
                        },
                        {
                          value: "автомобили",
                          label: "автомобили",
                        },
                        {
                          value: "прогулки",
                          label: "прогулки",
                        },
                        {
                          value: "велосипед",
                          label: "велосипед",
                        },
                        {
                          value: "плавание",
                          label: "плавание",
                        },
                        {
                          value: "шоппинг",
                          label: "шоппинг",
                        },
                        {
                          value: "общение",
                          label: "общение",
                        },
                        {
                          value: "искусство",
                          label: "искусство",
                        },
                      ]}
                    />
                    <div className={s.badges}>
                      {user.hobbys &&
                        user.hobbys.map((hobby) => {
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
                    <Spin spinning={loading} size="large">
                      {photoUploaded ? (
                        user && (
                          <Typography.Text style={{ color: "green" }}>
                            Фото загружено!
                          </Typography.Text>
                        )
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <Typography.Title level={5}>
                            Редактировать фото
                          </Typography.Title>
                          <input type="file" onChange={handleFileChange} />
                          <button type="submit">Загрузить</button>
                        </form>
                      )}
                    </Spin>
                  </Modal>
                </div>
              </div>
            )}
          </Spin>
        </Content>
      }
      footerChildren={<Logo />}
    />
  );
};
