import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ComeBack from "../ComeBack";
import { Button, Card } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import Axios from "axios"; // Sửa đổi từ "Axios" thành "axios"
import numeral from "numeral";

const SearchItem = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const getProducts = useCallback(() => {
        setLoading(true); // Set loading to true before fetching data
        Axios.get(`http://127.0.0.1:8000/api/productSearch`).then((result) => {
            //setCurrentPage(result.data.data.current_page);
            //setPerPage(result.data.data.per_page);
            //setTotal(result.data.data.total);
            setProducts(result.data);
            setLoading(false); // Data fetched, set loading to false
        });
    }, []);

    // Similar to componentDidMount
    useEffect(() => {
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        const searchTerms = query.toLowerCase().split(' ');
    
        console.log("Search terms:", searchTerms); // Debug: Kiểm tra các từ khóa
        
    
        const results = products.filter(item => 
            searchTerms.some(term => item.name.toLowerCase().includes(term))
        );
    
        console.log("Filtered Products:", results); // Debug: Kiểm tra kết quả lọc
        setFilteredProducts(results);
    }, [products, query]);
    
    
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
        <>
            <ComeBack />
            <div className="container my-3">
                <h3>Kết quả tìm kiếm cho: "{query}"</h3>
                <div className="row my-3">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <Card className="box col-2 m-2 product-card" key={item.id}>
                                <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                    <Card.Img
                                        className="product-image"
                                        src={`../../../img/${JSON.parse(item.photo)[0]}`}
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
                        <p>Không tìm thấy sản phẩm!</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default SearchItem;
