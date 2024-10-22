import { useEffect, useState } from "react";
import "../../scss/Delivery.scss"
import { CiDeliveryTruck } from "react-icons/ci";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import numeral from "numeral";



const TabTrans = (props) => {

    const { show, products, handleClose, handleShow } = props
    const [abateuserid, setAbateuserid] = useState([]);

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const handleDanhgia = () => {
        handleClose();
        Swal.fire({
            icon: 'success',
            title: 'Cảm ơn bạn đã đánh giá!',
            confirmButtonText: 'OK'
        });
        //return 0;

    }

    const [error, setError] = useState(null);

    const getAbateByUserId_status = async (userId) => {
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');

            // Gửi yêu cầu GET với token trong header
            const response = await axios.get(`http://127.0.0.1:8000/api/abate/getAbateByUserId_status/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const abateByUserId = response.data;
            setAbateuserid(abateByUserId);
        } catch (error) {
            console.error("Lỗi khi gọi abate by user_id", error);
            setError("Không thể tải dữ liệu đơn hàng."); // Cập nhật lỗi nếu có
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            // Giải mã token để lấy userId
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id; // Lấy userId từ token

            // Gọi hàm getAbateByUserId với userId
            getAbateByUserId_status(userId);
        } else {
            console.error("Không tìm thấy token");
        }
    }, []); // Chạy một lần khi component được mount

    return (
        <>
            <div className="font-sans mb-3">
                <div className="bg-gray-100 mt-3">
                    <input type="text" placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm" className="w-full p-2 border border-gray-300 rounded form-control" />
                </div>
                <div>
                    {abateuserid.length > 0 ? (
                        abateuserid.map((item, index) => {
                            // Giải chuỗi products
                            const products = JSON.parse(item.products); // Giải chuỗi JSON để chuyển đổi thành mảng

                            return (
                                <div className="bg-white p-4 mt-2" key={`index-${index}`}>
                                    <div className="d-flex justify-content-between d-inline">
                                        <div className="d-flex flex-row d-block">
                                            {/* <div>
                                                <button className="bg-danger rounded text-white me-2">Yêu thích+</button>
                                            </div> */}
                                            {/* <div>
                                                <b className="me-2">| Phụ Kiện Giá Sỉ Aha24h |</b>
                                            </div> */}
                                            {/* <div>
                                                <Link className="p-1 rounded me-2 bg-primary text-white border">Chat</Link>
                                            </div>
                                            <div>
                                                <Link className="text-white bg-warning rounded border">Xem Shop</Link>
                                            </div> */}
                                            <div>
                                                <p style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>
                                                    Đơn hàng thứ {index + 1}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="">
                                            <CiDeliveryTruck className="text-success" />
                                            <span className="ml-1 me-2 border-right text-success">Giao hàng nhanh |</span>
                                            <span className="text-red-500 font-bold text-danger"><b>Tiết kiệm</b></span>
                                        </div>
                                    </div>
                                    <hr />
                                    {products.map((product, productIndex) => (
                                        <div className="d-flex flex-row align-items-center" key={`product-${productIndex}`}>
                                            <Link to="/##">
                                                {/* <img src={product.photo} style={{ width: "80px", height: "80px" }} alt={product.name} /> */}
                                                <img
                                                    src={`../../../img/${product.photo}`}
                                                    alt={product.name}
                                                    style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                />
                                            </Link>
                                            <div className="align-content-center ms-3">
                                                <div className=""><b>{product.name}</b></div>
                                                <span className="text-secondary">Phân loại hàng: {item.category}</span> {/* Nếu bạn có category */}
                                                <div className="">Số lượng: {product.quantity}</div>
                                                <span className="text-success">Trả hàng miễn phí 15 ngày</span>
                                            </div>
                                        </div>
                                    ))}
                                    <hr />
                                    <div className="d-flex flex-row-reverse mb-5">
                                        <span>Thành tiền: <b className="thanh-tien">{formatCurrency(item.totalMoney)}</b></span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="danh-gia">
                                            Đánh giá sản phẩm trước <span className="text-danger">15-10-2024</span>
                                            <br />
                                            <span className="text-danger">Đánh giá ngay và nhận 200 Xu</span>
                                        </div>
                                        <div className="btn-action">
                                            <button className="btnDanhgia me-2 " onClick={handleShow}>Đánh Giá</button>
                                            <button className="btnLienhe me-2">Liên Hệ Người Bán</button>
                                            {/* <button className="btnMualai">Mua Lại</button> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-products">
                            <div className="bg-img"></div>
                        </div>
                    )}
                </div>


            </div>




            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                </Modal.Header>
                <div className="d-flex flex-row align-items-center container">
                    <Link to="/##"><img src="https://down-vn.img.susercontent.com/file/da017171936fb9d52f1df8f2ea5e39ad_tn" style={{ width: "80px", height: "80px" }} /></Link>
                    <div className="align-content-center ms-3">
                        <div className=""><b>Mắt kính giả cận thời trang nam nữ gọng kính mắt chữ V hàn quốc đẹp</b></div>
                        <span className="text-secondary">Phân loại hàng: AH129 - Trong đen</span>

                    </div>
                </div>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Màu sắc:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="để lại đánh giá."
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Chất liệu:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="để lại đánh giá."
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Đúng với mô tả</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} >
                        Trở lại
                    </Button>
                    <Button variant="primary" onClick={handleDanhgia} >
                        Đánh giá
                    </Button>
                </Modal.Footer>
            </Modal >

        </>

    )
}

export default TabTrans;