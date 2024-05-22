import { FaHeartbeat } from "react-icons/fa";
import s from './Logo.module.css'
import { Link } from "react-router-dom";

export const Logo = () => {
    return (
        <Link to={"/"} className={s.logo}>{<FaHeartbeat/>} MagicMeeting</Link>
    )
}