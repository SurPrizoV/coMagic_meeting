import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRoutes } from "./services/routes";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <AppRoutes />
  </HashRouter>
);
