import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../scss/AllProduct.scss";
import ComeBack from "../../Components/ComeBack";
import numeral from "numeral";
import axios from "axios";
import { Card } from "react-bootstrap";

import Pagination from "react-js-pagination";


const ProductByCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0); // Tổng số sản phẩm
    const [perPage, setPerPage] = useState(0);
    const { id } = useParams();

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const getProducts = async (pageNumber = 1) => {
        setLoading(true); // Bật trạng thái loading
        try {
            const result = await axios.get(`http://127.0.0.1:8000/api/product/category/paginate/${id}?page=${pageNumber}`);
            setCurrentPage(result.data.data.currentPage); // Cập nhật trang hiện tại
            setPerPage(result.data.data.perPage); // Cập nhật số lượng sản phẩm mỗi trang
            setTotalItemsCount(result.data.data.totalItemsCount); // Cập nhật tổng số sản phẩm
            setProducts(result.data.data); // Cập nhật danh sách sản phẩm
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    // useEffect để gọi API khi component được mount lần đầu tiên và khi currentPage thay đổi
    useEffect(() => {
        getProducts(currentPage);
    }, [currentPage]);

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Cập nhật trạng thái currentPage
    };
    console.log('Total Items:', totalItemsCount, 'Per Page:', perPage);


    // Nếu đang loading, hiển thị loading text
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
                            <span className="product-link"></span>
                        </Link>
                        <div className="link-title">
                            
                        </div>
                    </div>
                    <div className="product-item row">
                        {products.length > 0 ? (
                            products.map((item) => (
                                <Card className="box col-2 m-2" key={item.id}>
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
                    </div>

                    {/* Phân trang */}


                </section>
            </div>
            <div className="pagination" style={{ width: "160px", height: "100px" }}>
                {products.length > 0 && totalItemsCount > perPage && (
                    
                    <div className="pagination-container">
                        <Pagination
                            activePage={currentPage} // Trang hiện tại
                            itemsCountPerPage={perPage} // Số sản phẩm mỗi trang
                            totalItemsCount={totalItemsCount} // Tổng số sản phẩm
                            pageRangeDisplayed={5} // Số trang hiển thị
                            onChange={handlePageChange} // Gọi hàm khi trang thay đổi
                            itemClass="page-item" // Class tùy chỉnh cho item
                            linkClass="page-link" // Class tùy chỉnh cho link
                            firstPageText="First" // Nút "First"
                            lastPageText="Last" // Nút "Last"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductByCategory;
