import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import numeral from 'numeral';
import axios from "axios";
import '../../../scss/Accessory.scss'

//import AccessoryItem from "../Product/AccessoryItem";

const ProductiPhone = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/product/category/paginate/2");

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
        return <div>Đang tải...</div>;
    }


    return (

        <div className="accessory mt-5">
            <section className="content container">
                <div className="title-index">
                    <Link className="name-title">
                        <span className="phukien-link">iPhone</span>Nổi bật
                    </Link>
                    <div className="link-title">
                        <Link>iPhone 15 </Link>
                        <Link>iPhone 14 </Link>
                        <Link>iPhone 13 </Link>
                        <Link>iPhone 12 </Link>
                        <Link>iPhone 11 </Link>
                    </div>

                </div>
                <div className="my-deal-phone container p-3 mt-3">
                    <section className="content container">
                        <div className="content-deal row p-2">
                            {/* Lặp qua danh sách sản phẩm và hiển thị */}
                            {products.length > 0 ? (
                                products.map((item, index) => {

                                    return (
                                        <Card className="box col-2 m-2" key={item.id}>
                                            <Link to={`chi-tiet-san-pham/${item.id}`}>
                                                <Card.Img
                                                    src={`./img/${JSON.parse(item.photo)[0]}`}


                                                    alt={JSON.parse(item.photo)[0]}
                                                />
                                            </Link>
                                            <div>
                                                <p className="text_name">{item.name}</p>
                                                {/* <Card.Text>{item.description}</Card.Text> */}
                                            </div>
                                            {/* <ListGroup className="list-group-flush">
                                        <ListGroup.Item className="text_price text-red" >Giá: {formatCurrency(item.price)}</ListGroup.Item>
                                        <ListGroup.Item className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</ListGroup.Item>
                                    </ListGroup> */}
                                            <div className="list-group-flush">
                                                <hr />
                                                <p className="text_price" >Giá: {formatCurrency(item.price)}</p>
                                                <hr />
                                                <p className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                            </div>
                                        </Card>
                                    );

                                })
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
export default ProductiPhone;