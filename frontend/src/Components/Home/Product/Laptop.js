import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import numeral from 'numeral';
import axios from "axios";
import '../../../scss/Accessory.scss'

//import AccessoryItem from "../Product/AccessoryItem";

const Laptop = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/product/category/paginate/1");

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

        <div className="accessory mt-5">
            <section className="content container">
                <div className="title-index">
                    <Link className="name-title">
                        <span className="phukien-link">Laptop</span>Nổi bật
                    </Link>
                    <div className="link-title">
                        <Link>Asus </Link>
                        <Link>Dell </Link>
                        <Link>Acer </Link>
                        <Link>Macbook </Link>
                        
                    </div>

                </div>
                <div className="my-deal-phone container p-3 mt-3">
                    <section className="content container">
                    <div className="content-deal row p-2">
                            {/* Lặp qua danh sách sản phẩm và hiển thị */}
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <Card className="box col-2 m-2" key={item.id}>
                                        <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                        <div className="favorite-icon">
                                            <i className="far fa-heart"></i> {/* Nút trái tim */}
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

            </section >

        </div >
    )
}
export default Laptop;