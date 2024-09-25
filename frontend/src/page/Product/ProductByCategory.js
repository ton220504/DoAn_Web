import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ComeBack from "../../Components/ComeBack";
import numeral from "numeral";
import Axios from "axios";
import { Card } from "react-bootstrap";


import "../../../src/assets/css/pagination.css";

import { useCallback } from "react";
import Pagination from "react-js-pagination";


const ProductByCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0); // Tổng số sản phẩm
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const { id } = useParams();

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };



    const getProducts = useCallback((pageNumber = 1) => {
        setLoading(true); // Set loading to true before fetching data
        Axios.get(`http://127.0.0.1:8000/api/product/category/paginate/${id}?page=${pageNumber}`).then((result) => {
            setCurrentPage(result.data.current_page);
            setPerPage(result.data.per_page);
            setTotal(result.data.total);
            setProducts(result.data.data);
            setLoading(false);
        });
    }, []);

    // Similar to componentDidMount
    useEffect(() => {
        getProducts();
    }, [getProducts]);

    // Xử lý chuyển trang
   


    // Nếu đang loading, hiển thị loading text
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../img/loading-gif-png-5.gif" />
            </div>
        );
    }

    return (
        <>
            <ComeBack />
            <div className="AllProduct mt-5">
                <section className="content container">
                    <div className="title-index">
                        <Link className="name-title">
                            <span className="product-link"></span>
                        </Link>
                        <div className="link-title">

                        </div>
                    </div>
                    <div className="product-item row">
                        {products.length > 0 ? (
                            products.map((item) => (
                                <Card className="box col-2 m-2" key={item.id}>
                                    <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                    <div className="favorite-icon">
                                        <i className="far fa-heart"></i> {/* Nút trái tim */}
                                    </div>
                                    <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                        <Card.Img
                                            src={`../img/${JSON.parse(item.photo)[0]}`}
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

export default ProductByCategory;
