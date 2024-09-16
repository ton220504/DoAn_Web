import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ContentHeader = () => {
    const [menu, setMenu] = useState([
        { id: 1, name: "iPhone 15" },
        { id: 2, name: "Xiaomi" },
        { id: 3, name: "Sam sung" },
        { id: 4, name: "Galaxy S23" },
        { id: 5, name: "Realme C25s" }
    ]);

    const [user, setUser] = useState(null); // Trạng thái lưu người dùng
    const [category, setCategory] = useState([]);
    const navigate = useNavigate(); // Hook để điều hướng trang

    useEffect(() => {
        const fetchcategory = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/categories");
                console.log(response.data); // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    setCategory(response.data);
                } else {
                    console.error("Dữ liệu không phải là mảng:", response.data);
                }
            } catch (error) {
                console.log("Lỗi call API", error);
            }
        };
        fetchcategory();
    }, []);

    // Hàm kiểm tra token khi component được render
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserData(token); // Lấy thông tin người dùng nếu có token
        }
    }, []);

    // Hàm lấy thông tin người dùng từ API
    const getUserData = (token) => {
        axios
            .get("http://127.0.0.1:8000/api/auth", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setUser(response.data.user); // Lưu thông tin người dùng vào state
            })
            .catch(() => {
                localStorage.removeItem("token"); // Xóa token nếu xảy ra lỗi
                setUser(null); // Xóa thông tin người dùng
            });
    };

    // Hàm xử lý khi người dùng nhấn "Đăng nhập"
    const handleLoginClick = () => {
        navigate("/login"); // Điều hướng đến trang đăng nhập
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem("token"); // Xóa token khỏi localStorage
        setUser(null); // Xóa thông tin người dùng
        navigate("/"); // Điều hướng về trang chủ sau khi đăng xuất
        window.location.reload(); // Tải lại trang
    };

    return (
        <div className="content-header">
            <div className="container">
                <div className="row">
                    <div className="col-2 category">
                        <Dropdown>
                            <Dropdown.Toggle variant="warning" id="dropdown-basic">
                                Danh mục sản phẩm
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {category.length > 0 ? (
                                    category.map((cate) => (
                                        <Dropdown.Item key={cate.id} href="#">
                                            {cate.name}
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item disabled>Không có danh mục nào</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="col-6 hot-product">
                        <b> Sản phẩm HOT:</b>
                        {menu.map((item) => (
                            <div className="item-product" key={item.id}>
                                <div>
                                    {item.name}
                                    <img
                                        className="icon-hot"
                                        src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/hot_icon.png?1719291840576"
                                        alt="Hot Icon"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-4">
                        <div className="function">
                            <div className="text-white">
                                {user ? (
                                    <Dropdown>
                                        <Dropdown.Toggle className="text-white" variant="toggle" id="dropdown-basic">
                                            <FaUser />
                                            <span className="text-white">{user.name}</span>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item className="text-black" onClick={() => navigate("/my-account")}>
                                                My Account
                                            </Dropdown.Item>
                                            <Dropdown.Item className="text-black" onClick={() => navigate("/track-my-order")}>
                                                Track My Order
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item className="text-black" onClick={logout}>Đăng xuất</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                ) : (
                                    <div onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                                        <FaUser />
                                        <span className="ms-1">Đăng nhập</span>
                                    </div>
                                )}
                            </div>
                            <div className="ms-3 text-white">
                                <Link to="/cart">
                                    <FaShoppingCart />
                                    <span className="ms-1">Giỏ hàng</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentHeader;
