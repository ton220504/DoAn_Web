import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../../scss/Cart.scss"
import { SiCashapp } from "react-icons/si";

const Pay = () => {
    // const { show, handleClose, handleShow } = props;
    // const listProvince = [
    //     "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
    //     "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
    //     "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên",
    //     "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
    //     "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa",
    //     "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai",
    //     "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ",
    //     "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
    //     "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
    //     "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang",
    //     "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
    // ]
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const fee = "40.000";
    const isShowComplete = () => {
        return province
    }

    return (
        <>
            <div className="Pay container">
                <div className="main container">
                    <div className="main-header">
                        <img className="logo" src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/checkout_logo.png?1726452627090" />
                    </div>
                    <div className="main-content">
                        <div className="information row">
                            <div className="col-6">
                                <div className="title my-3">
                                    <label><b>Thông tin người nhận</b></label>
                                    {/* <Link to="/login">
                                        <FaUser />
                                        <span>Đăng nhập</span>
                                    </Link> */}
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control"
                                        value={email}
                                        placeholder="Nhập email" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control"
                                        value={name}
                                        placeholder="Nhập Họ Tên" />
                                </div>
                                <div className="mb-3">
                                    <input type="number" className="form-control"
                                        value={phone}
                                        placeholder="Số điện thoại" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control"
                                        value={address}
                                        placeholder="Địa chỉ(Tùy chọn)" />
                                </div>
                                <div className="mb-3">
                                    {/* <select className="form-select">
                                        <option>Chọn tỉnh thành</option>
                                        {province.map((province, index) => {
                                            return (
                                                <option value="">
                                                    {province}
                                                </option>
                                            );
                                        })}

                                    </select> */}
                                    {<input type="text" className="form-control"
                                        value={province}
                                        onChange={(e) => setProvince(e.target.value)}
                                        placeholder="Tỉnh, thành"

                                    />}
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control"
                                        value={district}
                                        placeholder="Quận, huyện" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control"
                                        value={ward}
                                        placeholder="Phường, xã" />
                                </div>
                            </div>
                            <div className="col-6 " >
                                <div className="title my-3">
                                    <label><b>Vận chuyển</b></label>
                                </div>
                                {isShowComplete() ?
                                    (
                                        <div className="ship-cod form-control">
                                            <div className="ship">
                                                <input type="radio" checked />
                                                Giao hàng tận nơi
                                            </div>
                                            <span className="cod">{fee}</span>
                                        </div>
                                    )
                                    :
                                    (
                                        <span className="null form-control">Vui lòng nhập thông tin giao hàng</span>
                                    )
                                }
                                <div className="title my-3">
                                    <label><b>Thanh toán</b></label>
                                </div>
                                <div className="method ">
                                    <div className="method-cash form-control">
                                        <div className="cash">
                                            <input type="radio" id="cash" name="fav_language" />
                                            <label for="cash">Tiền mặt</label>
                                        </div>
                                        <span className="icon">
                                            <SiCashapp />
                                        </span>
                                    </div>
                                    <div className="method-transfer mt-2 form-control">
                                        <div className="transfer">
                                            <input type="radio" id="transfer" name="fav_language" />
                                            <lable for="transfer">Chuyển khoản</lable>
                                        </div>
                                        <span className="icon">
                                            <SiCashapp />
                                        </span>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="order container">
                    <div className="order-header">
                        <span className="title ">
                            <b>Đơn hàng(1 sản phẩm)</b><hr />
                        </span>
                    </div>
                    <div className="content-order">
                        <div className="order-detail">
                            <div className="img">
                                <img src="https://bizweb.dktcdn.net/thumb/thumb/100/497/960/products/81967124-442a-4108-a1c6-39e6cb3c.jpg?v=1696428620620"
                                    style={{ width: "70px" }} />
                            </div>
                            <div className="infor m-2">
                                <b>Pin Sạc Dự Phòng Remax 5.000mAh Hình Con Thú</b><br />
                                <span>250.000đ</span>
                                {/* <Link onClick={() => handleDeleteProduct(item.id)}>Xóa</Link> */}
                            </div>
                        </div>
                        <hr />
                        <div className="code-sale">
                            <input type="text" placeholder="Nhập mã giảm giá" className="form-control" style={{ width: "50%" }} />
                            <button className="btn btn-success">Áp dụng</button>
                        </div>
                        <hr />
                        <div className="bill-detail">
                            <div className="tam-tinh">
                                <span>Tạm tính</span>
                                <span>250.000đ</span>
                            </div>
                            <div className="feeship">
                                <span>Phí vận chuyển</span>
                                <span>{fee}</span>
                            </div>
                        </div>
                        <hr />
                        <div className="Sum d-flex justify-content-between">
                            <span>Tổng cộng</span>
                            <span>290.000đ</span>
                        </div>
                        <div className="buy d-flex justify-content-between my-3">
                            <Link to="/cart">{"<Quay về giỏ hàng"}</Link>
                            <button className="btn btn-success">Thanh toán</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
export default Pay;