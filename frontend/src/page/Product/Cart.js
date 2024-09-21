import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import ComeBack from "../../Components/ComeBack";
import { toast } from 'react-toastify';
import ProductCartDetail from './ProductCartDetail';
import numeral from 'numeral';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [ifproduct, setIfproduct] = useState([]);
    const [productPrices, setProductPrices] = useState({}); // State để lưu giá sản phẩm

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/product/cart-list'); // API để lấy giỏ hàng
            setIfproduct(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/product/cart-list/${productId}`); // API để xóa sản phẩm
            setIfproduct(ifproduct.filter(item => item.id !== productId));
            toast.success("Xóa thành công");
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        }
    };

    const handlePriceChange = (id, price) => {
        setProductPrices(prev => ({ ...prev, [id]: price }));
    };

    const thanhtien = (price, quantity) => price * quantity;

    // Cập nhật số lượng sản phẩm lên server
    const updateProductQuantity = async (productId, newQuantity) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/product/cart-list/${productId}`, {
                quantity: newQuantity,
            });
            console.log("Cập nhật số lượng thành công!");
        } catch (error) {
            //console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
        }
    };

    const handleIncrement = (productId) => {
        setIfproduct(ifproduct.map(product =>
            product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
        ));
        const updatedProduct = ifproduct.find(product => product.id === productId);
        if (updatedProduct) {
            updateProductQuantity(productId, updatedProduct.quantity + 1);
        }
    };

    const handleDecrement = (productId) => {
        setIfproduct(ifproduct.map(product =>
            product.id === productId && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
        ));
        const updatedProduct = ifproduct.find(product => product.id === productId);
        if (updatedProduct && updatedProduct.quantity > 1) {
            updateProductQuantity(productId, updatedProduct.quantity - 1);
        }
    };

    

    return (
        <>
            <ComeBack />
            <div className="mynocart container mt-2">
                <h5 className="title-cart">Giỏ hàng của bạn</h5>
            </div>
            {ifproduct.length === 0 ? (
                <div className="content-nocart container text-center mt-5" style={{ height: "200px" }}>
                    <div className="icon">
                        <img src="https://bizweb.dktcdn.net/100/479/509/themes/897806/assets/no-cart.png?1677998172667" alt="No cart" /><br />
                        <span>Không có sản phẩm nào trong giỏ hàng</span>
                    </div>
                </div>
            ) : (
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
                        {ifproduct.map((item, index) => (
                            <tr key={index}>
                                
                                <td>
                                    <div className="product-detail">
                                        <ProductCartDetail id={item.stock_id} onPriceChange={(price) => handlePriceChange(item.stock_id, price)} />
                                            <Button onClick={() => handleDeleteProduct(item.id)}>xóa</Button>
                                    </div>
                                </td>
                                <td className="money">{formatCurrency(productPrices[item.stock_id] ? productPrices[item.stock_id] : "Đang tải...")}</td>
                                <td className="money">
                                    <button onClick={() => handleDecrement(item.id)}>-</button>
                                    <input className='text-center' value={item.quantity} readOnly style={{ width: "30px" }} />
                                    <button onClick={() => handleIncrement(item.id)}>+</button>
                                </td>
                                <td className="money">{formatCurrency(thanhtien(productPrices[item.stock_id], item.quantity))}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <Link to={"/thanh-toan"}>
            <Button style={{float:"right"}}>Thanh toán</Button>
            </Link>
        </>
    );
};

export default Cart;
