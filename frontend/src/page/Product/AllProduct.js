import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../scss/AllProduct.scss";
import ComeBack from "../../Components/ComeBack";
import numeral from "numeral";
import Axios from "axios";
import { Card } from "react-bootstrap";

import "../../../src/assets/css/pagination.css";
import Pagination from "react-js-pagination";
import Swal from "sweetalert2";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
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
                Swal.fire({
                    icon: 'success',
                    title: 'Đã thêm vào danh sách yêu thích!',
                    confirmButtonText: 'OK'
                });
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

    const getProducts = useCallback((pageNumber = 1) => {
        setLoading(true); // Set loading to true before fetching data
        Axios.get(`http://127.0.0.1:8000/api/product?page=${pageNumber}`).then((result) => {
            setCurrentPage(result.data.current_page);
            setPerPage(result.data.per_page);
            setTotal(result.data.total);
            setProducts(result.data.data);
            setLoading(false); // Data fetched, set loading to false
        });
    }, []);

    // Similar to componentDidMount
    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
        <>
            <ComeBack />
            <div className="AllProduct mt-5">
                <ToastContainer />
                <section className="content container">
                    <div className="title-index">
                        <Link className="name-title">
                            <span className="product-link">Tất cả sản phẩm</span>Nổi bật
                        </Link>
                        <div className="link-title">
                            <Link>Tai Nghe </Link>
                            <Link>Ốp lưng </Link>
                            <Link>Phụ kiện khác </Link>
                        </div>
                    </div>
                    <div className="product-item row">
                        {products.length > 0 ? (
                            products.map((item) => (
                                <Card className="box col-2 m-2 product-card" key={item.id}>
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
                        <div style={{ float: "left" }}>
                            {products.length > 0 && total > perPage && (
                                <div className="pagination-container">
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={perPage}
                                        totalItemsCount={total}
                                        pageRangeDisplayed={5}
                                        onChange={(pageNumber) => getProducts(pageNumber)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        firstPageText="Đầu"
                                        lastPageText="Cuối"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Phân trang */}

                </section>
            </div>
        </>
    );
};

export default AllProduct;
