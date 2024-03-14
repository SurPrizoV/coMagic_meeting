import { FaHeartbeat } from "react-icons/fa";
import s from './Logo.module.css'

export const Logo = () => {
    return (
        <p className={s.logo}>{<FaHeartbeat/>} MagicMeeting</p>
    )
}