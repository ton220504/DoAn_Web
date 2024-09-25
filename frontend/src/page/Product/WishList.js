import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Toast } from 'react-bootstrap';
import ComeBack from "../../Components/ComeBack";
import { toast } from 'react-toastify';
import ProductCartDetail from './ProductCartDetail';
import numeral from 'numeral';
import { Link, Navigate } from 'react-router-dom';
import "../../scss/Cart.scss";

const WishList = () => {
    const [product, setProduct] = useState([]);
    const [productPrices, setProductPrices] = useState({}); // Lưu giá sản phẩm
    const [loadingCart, setLoadingCart] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState(null);

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const fetchCartItems = async (token) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/product/cart-list', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProduct(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            toast.error("Có lỗi xảy ra khi lấy giỏ hàng");
        } finally {
            setLoadingCart(false);
        }
    };

    const checkUserLogin = () => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserData(token);
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    };

    const getUserData = async (token) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/auth", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
            fetchCartItems(token);
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
            toast.error("Đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        } finally {
            setLoadingUser(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/product/cart-list/${productId}`);
            setProduct(product.filter(item => item.id !== productId));
            // Toast.success("Xóa sản phẩm thành công");
            window.location.reload(); // Tải lại trang

        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            toast.error("Có lỗi xảy ra khi xóa sản phẩm.");
        }
    };

    const handlePriceChange = (id, price) => {
        setProductPrices(prev => ({ ...prev, [id]: price }));
    };

    const thanhtien = (price, quantity) => price * quantity;

    const tinhTongTien = () => {
        return product.reduce((total, item) => {
            const price = productPrices[item.stock_id] || 0;
            return total + thanhtien(price, item.quantity);
        }, 0);
    };

    const updateProductQuantity = async (productId, newQuantity) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/product/cart-list/${productId}`, {
                quantity: newQuantity,
            });
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
        }
    };

    const handleIncrement = (productId) => {
        setProduct(product.map(product =>
            product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
        ));
        const updatedProduct = product.find(product => product.id === productId);
        if (updatedProduct) {
            updateProductQuantity(productId, updatedProduct.quantity + 1);
        }
    };

    const handleDecrement = (productId) => {
        setProduct(product.map(product =>
            product.id === productId && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
        ));
        const updatedProduct = product.find(product => product.id === productId);
        if (updatedProduct && updatedProduct.quantity > 1) {
            updateProductQuantity(productId, updatedProduct.quantity - 1);
        }
    };

    useEffect(() => {
        checkUserLogin();
    }, []);

    if (loadingUser) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container text-center" style={{ height: "280px" }}>
                <h2 style={{ paddingTop: "100px", fontWeight: "bold", color: "red" }}>Bạn cần đăng nhập để xem giỏ hàng</h2>
                <p>Đăng nhập
                    <Link to="/login" className='ms-1'>
                        {/* <Button variant="primary">Đăng nhập</Button> */}
                        tại đây
                    </Link>
                </p>


            </div>
        );
    }

    if (loadingCart) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    return (
        <>
            <ComeBack />
            <div className="mynocart container mt-2">
                <h5 className="title-cart">Giỏ hàng của bạn</h5>
            </div>
            {product.length === 0 ? (
                <div className="content-nocart container text-center mt-5" style={{ height: "200px" }}>
                    <div className="icon">
                        <img src="https://bizweb.dktcdn.net/100/479/509/themes/897806/assets/no-cart.png?1677998172667" alt="No cart" /><br />
                        <span>Không có sản phẩm nào trong giỏ hàng</span>
                    </div>
                </div>
            ) : (
                <div>
                    <Table striped bordered hover className="container">
                        <thead>
                            <tr>
                                <th>Thông tin sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="product-detail">
                                            <ProductCartDetail id={item.stock_id} onPriceChange={(price) => handlePriceChange(item.stock_id, price)} className="ProductCartDetail" />
                                        </div>
                                        <span style={{ color: "red", cursor: "pointer" }} onClick={() => handleDeleteProduct(item.id)}>Xóa</span>
                                    </td>
                                    <td style={{ fontWeight: "bold", color: "blue" }} className="money">{formatCurrency(productPrices[item.stock_id] || "Đang tải...")}</td>
                                    <td className="money">
                                        <button onClick={() => handleDecrement(item.id)}>-</button>
                                        <input className='text-center' value={item.quantity} readOnly style={{ width: "30px" }} />
                                        <button onClick={() => handleIncrement(item.id)}>+</button>
                                    </td>
                                    <td style={{ fontWeight: "bold", color: "red" }} className="money">{formatCurrency(thanhtien(productPrices[item.stock_id], item.quantity))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="container mt-3 d-flex justify-content-between align-items-center">
                        <h5 style={{ margin: 0 }}>Tổng tiền:</h5>
                        <p style={{ color: "red", fontWeight: "bold" }}>{formatCurrency(tinhTongTien())}</p>
                        <Link to="/thanh-toan">
                            <Button variant="primary">Thanh toán</Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default WishList;