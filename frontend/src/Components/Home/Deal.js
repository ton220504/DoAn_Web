
import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";  // Import axios
import HotDeals from "./HotDeals";
import numeral from 'numeral';
import '../../assets/css/Deal.css'; // Đảm bảo rằng đường dẫn đến file CSS là chính xác
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';




const Deal = () => {
    // State để lưu danh sách sản phẩm
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích


    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const handleAddToWishlist = async (productId) => { // Nhận productId làm tham số
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích!',
                confirmButtonText: 'Đăng nhập ngay'
            }).then(() => {
                // Chuyển hướng đến trang đăng nhập
                window.location.href = "/login"; // Đường dẫn đến trang đăng nhập
            });
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/product/wishlist', {
                productId: productId // Gửi productId trong yêu cầu
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setFavoriteProducts([...favoriteProducts, productId]); // Thêm productId vào danh sách yêu thích
                toast.success("Đã thêm vào danh sách yêu thích!")
            }
        } catch (error) {
            if (error.response && error.response.status === 405) {
                toast.warning("Sản phẩm đã thêm vào danh sách yêu thích!")
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra, vui lòng thử lại!',
                    confirmButtonText: 'OK'
                });
            }
        }
    };


    // Gọi API khi component được mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/products?page=3");

                // Kiểm tra nếu response.data có trường chứa sản phẩm
                if (Array.isArray(response.data.data)) {
                    // Cập nhật state với mảng sản phẩm nằm trong response.data.data
                    setProducts(response.data.data);
                } else {
                    console.error("Dữ liệu sản phẩm không nằm trong một mảng:", response.data);
                }
                setLoading(false);  // Dừng loading
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setLoading(false);  // Dừng loading dù có lỗi
            }
        };

        fetchProducts();
    }, []);  // Chỉ gọi 1 lần khi component được render

    // Nếu đang loading, hiển thị loading text
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" />
            </div>
        );
    }

    return (
        <div className="my-deal container p-3 mt-3">
            <ToastContainer/>
            <section className="content container">
                <div className="box-deal">
                    <div className="set-time col-4">
                        <div className="icon">
                            <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/flash-yl.png?1719291840576"
                                style={{ width: "15px" }}
                            />
                        </div>
                        {/* <div className="content">
                            <h4>GIỜ VÀNG DEAL SỐC</h4>
                            <span className="text-white">Kết thúc trong:<HotDeals/></span>
                            
                        </div> */}
                        <div className="content">
                            <h4 className="title-time-deal">GIỜ VÀNG DEAL SỐC</h4>
                            <div className="timer-container">
                                <span className="end">Kết thúc trong:</span>
                                <HotDeals /> {/* Đây là component đếm ngược */}
                            </div>
                        </div>


                    </div>
                    <div className="is-going-on col-4">
                        <Link>
                            <span>12:00 - 20:00</span><br />
                            <span>Đang diễn ra</span>
                        </Link>
                    </div>
                    <div className="coming-soon col-4">
                        <Link>
                            <span>20:00 - 24:00</span><br />
                            <span>Sắp diễn ra</span>
                        </Link>
                    </div>
                </div>

                <div className="content-deal row p-2">
                    {/* Lặp qua danh sách sản phẩm và hiển thị */}
                    {products.length > 0 ? (
                        products.map((item) => (
                            <Card className="box col-2 m-2 item-cart-deal" key={item.id}>
                                <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                                    {/* Đổi icon dựa trên trạng thái yêu thích */}
                                    <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i>
                                </div>
                                <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                    <Card.Img
                                        className="product-image"
                                        src={`./img/${JSON.parse(item.photo)[0]}`}
                                        alt={JSON.parse(item.photo)[0]}
                                    />
                                </Link>
                                <div className="official-badge">Chính Hãng 100%</div> {/* Chính hãng */}
                                <div>
                                    <p className="text_name">{item.name}</p>
                                </div>
                                <div className="list-group-flush">
                                    <hr />

                                    <p className="text_price">Giá: {formatCurrency(item.price)}</p>
                                    <hr />
                                    <p className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div>Không có sản phẩm nào để hiển thị</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Deal;


