import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../../scss/Cart.scss"
import { SiCashapp } from "react-icons/si";
import { Button, Table } from "react-bootstrap";
import axios from "axios";

const Pay = () => {


    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');


    

    const fee = 40000;
    const isShowComplete = () => {
        return selectedProvince !== ''; // Kiểm tra xem có tỉnh nào được chọn hay không
    };

   



    const location = useLocation();
    const { selectedItems, totalAmount } = location.state || { selectedItems: [], totalAmount: 0 };

    const formatCurrency = (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    useEffect(() => {
        // Lấy danh sách tỉnh thành
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setProvinces(response.data.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        // Lấy danh sách quận huyện khi tỉnh thành được chọn
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`);
                    setDistricts(response.data.data);
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };

            fetchDistricts();
        }
    }, [selectedProvince]);

    useEffect(() => {
        // Lấy danh sách phường xã khi quận huyện được chọn
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`);
                    setWards(response.data.data);
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };

            fetchWards();
        }
    }, [selectedDistrict]);


    return (
        <>
            <div className="Pay container">



                <div className=" row">
                    <div className="col-8">
                        <div className="main-header">
                            <img className="logo" style={{ width: "300px", paddingTop: "10px", display: "block", margin: "0 auto" }} src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/checkout_logo.png?1726452627090" />
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className=" my-3">
                                    <b>Thông tin người nhận</b>

                                </div>
                                <div className="mb-3">
                                    <input type="email" name="email" className="form-control"

                                        placeholder="Nhập email" />
                                </div>
                                <div className="mb-3">
                                    <input type="name" name="name" className="form-control"

                                        placeholder="Nhập Họ Tên" />
                                </div>
                                <div className="mb-3">
                                    <input type="phone" name="phone" className="form-control"

                                        placeholder="Số điện thoại" />
                                </div>
                                {/* <div className="mb-3">
                                    <input type="address" name="address" className="form-control"

                                        placeholder="Địa chỉ(Tùy chọn)" />
                                </div> */}
                                <div className="mb-3">
                                    <select
                                        className="form-control"
                                        placeholder="Tỉnh, Thành phố"
                                        onChange={(e) => setSelectedProvince(e.target.value)}
                                    >
                                        <option value="">Chọn Tỉnh, Thành phố</option>
                                        {provinces.map((province) => (
                                            <option key={province.id} value={province.id}>{province.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <select
                                        className="form-control"
                                        placeholder="Quận, huyện"
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                    >
                                        <option value="">Chọn Quận, Huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.id} value={district.id}>{district.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <select className="form-control" placeholder="Phường, xã">
                                        <option value="">Chọn Phường, Xã</option>
                                        {wards.map((ward) => (
                                            <option key={ward.id} value={ward.id}>{ward.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <textarea rows="4" className="form-control" placeholder="Nhập địa chỉ cần giao..." />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className=" my-3">
                                    <b>Vận chuyển</b>
                                </div>
                                {isShowComplete() ?
                                    (
                                        <div className="ship-cod form-control">
                                            <div className="ship">
                                                <input type="radio" checked readOnly />
                                                Giao hàng tận nơi
                                            </div>
                                            <span className="cod">{formatCurrency(fee)}</span>
                                        </div>
                                    )
                                    :
                                    (
                                        <span className="null form-control">Vui lòng nhập thông tin giao hàng</span>
                                    )
                                }
                                <div className=" my-3">
                                    <b>Thanh toán</b>
                                </div>
                                <div className="method ">
                                    <div className="method-cash form-control">
                                        <div className="cash">
                                            <input type="radio" id="cash" name="fav_language" />
                                            <label >Tiền mặt</label>
                                        </div>
                                        <span className="icon">
                                            <SiCashapp />
                                        </span>
                                    </div>
                                    <div className="method-transfer mt-2 form-control">
                                        <div className="transfer">
                                            <input type="radio" id="transfer" name="fav_language" />
                                            <p >Chuyển khoản</p>
                                        </div>
                                        <span className="icon">
                                            <SiCashapp />
                                        </span>
                                    </div>


                                </div>

                            </div>
                        </div>


                    </div>
                    <div className="col-4  " style={{ height: "730px", width: "400px", borderLeft: "3px solid lightgray" }} >
                        <div className="order container">

                            <div className="container">
                                <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px", textAlign: "center" }}>Thông tin thanh toán</p>
                                <div className="order-summary">
                                    <p>Sản phẩm đã chọn:</p>
                                    {selectedItems.length === 0 ? (
                                        <p>Không có sản phẩm nào được chọn.</p>
                                    ) : (
                                        <ul>
                                            {selectedItems.map((item, index) => (
                                                <>
                                                    <hr />
                                                    <li key={item.id} className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">
                                                            {/* Hiển thị hình ảnh sản phẩm */}
                                                            <img
                                                                src={`../../../img/${item.photo}`}
                                                                alt={item.name}
                                                                style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                            />
                                                            <div>
                                                                <span style={{ fontWeight: "bold", width: "200px" }}>{item.name}</span><br />
                                                                <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>Số lượng: {item.quantity}</span><br />

                                                            </div>


                                                        </div>
                                                        <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>{formatCurrency(item.price * item.quantity)}</span>
                                                    </li>

                                                </>

                                            ))}
                                        </ul>
                                    )}
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <p>Tạm tính: </p>
                                        <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>{formatCurrency(totalAmount)}</strong>


                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p>Phí vận chuyển: </p>
                                        <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>
                                            {isShowComplete() ?
                                                (
                                                    <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>{formatCurrency(fee)}</strong>
                                                )
                                                :
                                                (
                                                    <span>---</span>
                                                )
                                            }
                                        </strong>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <strong style={{ fontSize: "25px", fontWeight: "bold" }}>Tổng tiền:</strong>
                                        <strong style={{ color: "red", fontSize: "25px", fontWeight: "bold" }}>
                                            {
                                                isShowComplete() ?
                                                (
                                                    <p>{formatCurrency(totalAmount+fee)}</p>
                                                ):(
                                                    <p>{formatCurrency(totalAmount)}</p>
                                                )
                                            }
                                        </strong>

                                    </div>
                                    <button className="form-control" style={{ marginTop: "10px", backgroundColor: "SlateBlue", color: "white" }}>Thanh toán</button>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>



            </div>
        </>

    );
}
export default Pay;