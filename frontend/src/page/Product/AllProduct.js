import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../scss/AllProduct.scss";
import ComeBack from "../../Components/ComeBack";
import numeral from "numeral";
import axios from "axios";
import { Card } from "react-bootstrap";

import "../../../src/assets/css/pagination.css";
import Pagination from "react-js-pagination";

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [perPage, setPerPage] = useState(0);

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const getProducts = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const result = await axios.get(`http://127.0.0.1:8000/api/product?page=${pageNumber}`);
            console.log(result.data.data); // Log dữ liệu từ API để kiểm tra
            setCurrentPage(result.data.data.currentPage );
            setPerPage(result.data.data.perPage);
            setTotalItemsCount(result.data.data.totalItemsCount || 0);
            setProducts(result.data.data); // Giả sử dữ liệu sản phẩm nằm trong thuộc tính 'products'
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <>
            <ComeBack />
            <div className="AllProduct mt-5">
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
                                <Card className="box col-2 m-2" key={item.id}>
                                    <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                        <Card.Img
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
                    </div>

                    {/* Phân trang */}
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={perPage}
                        totalItemsCount={totalItemsCount}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </section>
            </div>
        </>
    );
};

export default AllProduct;
