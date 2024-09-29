import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Table, Toast } from 'react-bootstrap';
import ComeBack from "../../Components/ComeBack";
import { toast } from 'react-toastify';
import ProductWishListDetail from './ProductWishListDetail';
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


    const fetchWishListItems = async (token) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/product/wishlist', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProduct(response.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm yêu thích:", error);
            toast.error("Có lỗi xảy ra khi sản phẩm yêu thích");
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
            fetchWishListItems(token);
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
            toast.error("Đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        } finally {
            setLoadingUser(false);
        }
    };


    useEffect(() => {
        checkUserLogin();
    }, []);

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/product/wishlist/${productId}`);
            setProduct(product.filter(item => item.id !== productId));
            // Toast.success("Xóa sản phẩm thành công");
            window.location.reload(); // Tải lại trang

        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            toast.error("Có lỗi xảy ra khi xóa sản phẩm.");
        }
    };

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
                <h2 style={{ paddingTop: "100px", fontWeight: "bold", color: "red" }}>Bạn cần đăng nhập để xem sản phẩm yêu thích</h2>
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
                <h5 className="title-cart" style={{color:"red", fontSize:"20px", fontWeight:"bolder",fontStyle:"italic", paddingTop:"10px", paddingBottom:"10px"}}>Sản phẩm yêu thích</h5>
            </div>
            {product.length === 0 ? (
                <div className="content-nocart container text-center mt-5" style={{ height: "200px" }}>
                    <div className="icon">
                        <img src="https://bizweb.dktcdn.net/100/479/509/themes/897806/assets/no-cart.png?1677998172667" alt="No cart" /><br />
                        <span>Không có sản phẩm nào! </span>
                    </div>
                </div>
            ) : (
                <div>
                    <Table striped bordered hover className="container">
                        <thead>
                            <tr>
                                <th>Thông tin sản phẩm</th>
                               
                                {/* <th></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {product.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="product-detail">
                                            <ProductWishListDetail id={item.product_id}  className="ProductWishListDetail" />
                                        </div>
                                        <span style={{ color: "red", cursor: "pointer" }} onClick={()=>handleDeleteProduct(item.id)} >Xóa</span>
                                    </td>
                                    
                                    {/* <td>
                                        <Button>Thêm vào giỏ hàng</Button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                   
                </div>
                
            )}
        </>
    );
};

export default WishList;
