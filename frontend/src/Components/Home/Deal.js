



import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";  // Import axios


const Deal = () => {
    // State để lưu danh sách sản phẩm
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gọi API khi component được mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/products?page=1");

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
        <div className="my-deal container p-3 mt-3">
            <section className="content container">
                <div className="box-deal">
                    <div className="set-time col-4">
                        <div className="icon">
                            <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/flash-yl.png?1719291840576"
                                style={{ width: "15px" }}
                            />
                        </div>
                        <div className="content">
                            <h4>GIỜ VÀNG DEAL SỐC</h4>
                            <span>Kết thúc trong:</span>
                        </div>
                    </div>
                    <div className="is-going-on col-4">
                        <Link>
                            <span>12:00 - 20:00</span><br />
                            <span>Đang diễn ra</span>
                        </Link>
                    </div>
                    <div className="coming-soon col-4">
                        <Link>
                            <span>20:00 - 24:00</span><br />
                            <span>Sắp diễn ra</span>
                        </Link>
                    </div>
                </div>

                <div className="content-deal row p-2">
                    {/* Lặp qua danh sách sản phẩm và hiển thị */}
                    {products.length > 0 ? (
                        products.map((item, index) => {
                            
                                return (
                                    <Card className="col-2 m-2" key={item.id}>
                                        <Card.Img
                                            src={`./img/${JSON.parse(item.photo)[0]}`}

                                            
                                            alt={JSON.parse(item.photo)[0]}                                         
                                        />
                                        <Card.Body>
                                            <Card.Title>{item.name}</Card.Title>
                                            <Card.Text>{item.title}</Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>{item.price}</ListGroup.Item>
                                            <ListGroup.Item>Tặng sạc cáp nhanh 25w trị giá 250k</ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                );
                            
                        })
                    ) : (
                        <div>Không có sản phẩm nào để hiển thị</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Deal;


