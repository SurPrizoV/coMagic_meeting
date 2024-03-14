import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRoutes } from "./services/routes";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
