import { Link } from "react-router-dom";
import "../../scss/Delivery.scss"
const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="profile-section">
                <img src="profile-placeholder.jpg" alt="Profile" className="profile-img" />
                <div className="username">hongocdung222</div>
                <button className="edit-profile">Sửa Hồ Sơ</button>
            </div>
            <ul className="menu">
                <Link to="/my-account"><li>Tài Khoản Của Tôi</li></Link>
                <Link><li className="active">Đơn Mua</li></Link>
            </ul>
        </div>
    );
}

export default Sidebar;