import { Breadcrumb, Button } from "antd";
import { Logo } from "../Logo/Logo";
import s from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className={s.header}>
      <Breadcrumb
        items={[
          {
            title: (
              <Link to={"/"}>
                <Logo />
              </Link>
            ),
          },
          {
            title: (
              <Link to={"/profile"}>
                Моя страница
              </Link>
            ),
          }
        ]}
      />
      <Button type="primary" onClick={handleLogOut}>Выход</Button>
    </header>
  );
};
