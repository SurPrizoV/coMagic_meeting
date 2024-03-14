import User from "../store/user";
import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "../pages/NotFound/NotFound";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";
import { ProtectedRoute } from "./protectedRoute";
import { MainPage } from "../pages/MainPage/MainPage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { UserPage } from "../pages/UserPage/UserPage";
import { ChatPage } from "../pages/ChatPage/ChatPage";

export const AppRoutes = observer(() => {
    User.data.uid = localStorage.getItem("access")
 return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute isAllowed={Boolean(User.data.uid)} />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/user/:id" element={<UserPage/>}/>
        <Route path="/chat/:id" element={<ChatPage/>}/>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});
