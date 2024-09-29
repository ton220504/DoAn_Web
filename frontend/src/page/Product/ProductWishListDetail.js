import React, { useEffect, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Link } from 'react-router-dom';

const ProductWishListDetail = ({ id, onPriceChange }) => {
    const [product, setProduct] = useState(null);

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);
            setProduct(response.data);
            if (onPriceChange) {
                onPriceChange(response.data.price);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    useEffect(() => {
        fetchProduct(); // Gọi hàm fetchProduct khi component mount
    }, [id]); // Chỉ gọi lại nếu id thay đổi

    return (
        <div>
            {product ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="col-md-3 product-img">
                        <Link to={`/chi-tiet-san-pham/${product.id}`}>
                            <img
                                style={{ width: "100px", height: "100px" }}
                                className="img"
                                src={`../../../img/${JSON.parse(product.photo)[0]}`}
                                alt={product.name}
                            />
                        </Link>
                    </div>
                    <div>
                        <div style={{ fontWeight: "bold" }}>{product.name}</div>
                        <br />
                        <p style={{ color: "blue", fontWeight: "bold" }}>{formatCurrency(product.price)}</p>
                    </div>
                </div>
            ) : (
                // <p>Đang tải sản phẩm...</p> // Hiển thị thông báo khi chưa có dữ liệu
                <img src='../../../img/loading.gif' />
            )}
        </div>
    );
}

export default ProductWishListDetail;
