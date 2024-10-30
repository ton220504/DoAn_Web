import { FaShoppingCart } from "react-icons/fa";
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ComeBack from "../../Components/ComeBack";
import "../../scss/ProductDetail.scss";
import numeral from "numeral";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";




const ProductDetail = () => {
    const [activeTab, setActiveTab] = useState('des');
    const [isShow, setIsShow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [slideDirection, setSlideDirection] = useState(''); // Quản lý hướng trượt


    const thumbnailRef = useRef(null); // Ref để quản lý container ảnh nhỏ
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    //user
    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);




    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    const handleImageClick = (image, direction) => {
        // Thiết lập hướng trượt khi thay đổi ảnh
        setSlideDirection(direction);
        setTimeout(() => {
            setSelectedImage(image); // Cập nhật ảnh to sau khi animation kết thúc
            setSlideDirection(''); // Xóa hướng trượt sau khi animation kết thúc
        }, 500); // Khớp với thời gian transition
    };


    const scrollThumbnails = (direction) => {
        const container = thumbnailRef.current;
        const scrollAmount = 100; // Số pixel cuộn mỗi lần
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth', // Cuộn mượt mà
        });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - thumbnailRef.current.offsetLeft);
        setScrollLeft(thumbnailRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - thumbnailRef.current.offsetLeft;
        const walk = (x - startX); // Nhân đôi tốc độ kéo
        thumbnailRef.current.scrollLeft = scrollLeft - walk;
    };







    // useEffect(() => {
    //     const fetchProduct = async () => {
    //         setLoading(true); // Bắt đầu quá trình tải dữ liệu
    //         try {
    //             const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);

    //             const fetchedProduct = response.data;
    //             setProduct(fetchedProduct);
    //             setName(fetchedProduct.name); // Cập nhật tên sản phẩm
    //             setPrice(fetchedProduct.price); // Cập nhật giá sản phẩm

    //             fetchRelatedProducts(fetchedProduct.name);

    //             // Cập nhật danh sách ảnh và ảnh được chọn
    //             const imageList = JSON.parse(fetchedProduct.photo);
    //             setImages(imageList);
    //             setSelectedImage(imageList[0]);

    //             setLoading(false);  // Dừng loading sau khi đã fetch dữ liệu xong
    //         } catch (error) {
    //             console.error("Lỗi khi gọi API:", error);
    //             setLoading(false);  // Dừng loading dù có lỗi
    //         }
    //     };

    //     fetchProduct();
    // }, [id]);

    // const fetchRelatedProducts = async (productName) => {
    //     try {
    //         const response = await axios.get('http://127.0.0.1:8000/api/productSearch');
    //         const allProducts = response.data;

    //         // Lọc sản phẩm liên quan theo tên
    //         const filteredProducts = allProducts.filter(p => p.name === productName && p.id !== id);
    //         setRelatedProducts(filteredProducts);

    //     } catch (error) {
    //         console.error("Lỗi khi gọi API sản phẩm liên quan:", error);
    //     }
    // };
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);
                const fetchedProduct = response.data;
                
                // Gán giá trị cho `product` để sử dụng trong hàm `handleCheckout`
                setProduct(fetchedProduct);
                
                // Cập nhật dữ liệu cho các trường khác
                setName(fetchedProduct.name);
                setPrice(fetchedProduct.price);
                //setQuantity(fetchedProduct.quantity)

                // Lấy sản phẩm liên quan dựa trên tên sản phẩm hiện tại
                fetchRelatedProducts(fetchedProduct.name);

                // Cập nhật danh sách ảnh
                const imageList = JSON.parse(fetchedProduct.photo);
                setImages(imageList);
                setSelectedImage(imageList[0]);
                
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const fetchRelatedProducts = async (productName) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/productSearch');
            const allProducts = response.data;

            // Lọc các sản phẩm liên quan có cùng tên, trừ sản phẩm hiện tại
            const filteredProducts = allProducts.filter(p => p.name === productName && p.id !== id);
            setRelatedProducts(filteredProducts);
        } catch (error) {
            console.error("Lỗi khi gọi API sản phẩm liên quan:", error);
        }
    };

    // Hàm xử lý sự kiện khi nhấn "Thanh toán"
    const handleCheckout = () => {
        if (!product) {
            console.error("Không có sản phẩm để thanh toán.");
            return;
        }

        // Tạo thông tin sản phẩm cần mua
        const selectedItems = [
            {
                id: id,
                name: name,
                price: price, // Giá tính theo (giá gốc * số lượng)
                quantity: quantity,
                photo: selectedImage, // Lấy ảnh đầu tiên
            }
        ];

        // Tính tổng tiền dựa trên số lượng và giá
        const totalAmount = price * quantity;

        // Điều hướng đến trang thanh toán
        navigate('/thanh-toan', { state: { selectedItems, totalAmount } });
    };





    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../../../img/loading-gif-png-5.gif" />
            </div>
        );
    }
    if (!product) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../../../img/loading-gif-png-5.gif" />
            </div>
        );
    }
    const addToCart = async () => {
        // Kiểm tra nếu người dùng chưa đăng nhập
        const token = localStorage.getItem("token");
        if (!token) {
            // Hiển thị thông báo yêu cầu đăng nhập
            Swal.fire({
                icon: 'error',
                title: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!',
                confirmButtonText: 'Đăng nhập ngay'
            }).then(() => {
                // Chuyển hướng người dùng đến trang đăng nhập
                navigate('/login'); // Đường dẫn đến trang đăng nhập
            });
            return; // Kết thúc hàm nếu chưa đăng nhập
        }

        // Nếu người dùng đã đăng nhập, tiếp tục thêm sản phẩm vào giỏ hàng
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/product/cart-list', {
                stockId: id, // ID sản phẩm
                quantity: quantity, // Số lượng sản phẩm
                name: name, // Tên sản phẩm
                price: price, // Giá sản phẩm
                photo: selectedImage // Đường dẫn hình ảnh sản phẩm
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm vào giỏ hàng thành công',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate(`/chi-tiet-san-pham/${id}`);
                    window.location.reload();
                });
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
            Swal.fire({
                icon: 'error',
                title: 'Sản phẩm đã thêm vào giỏ hàng!',
            });

        }
    };

    



    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };
    const handleShowmore = () => {
        setIsShow(!isShow)
    }
    return (
        <>
            <ComeBack />
            <div className="productdetail container">
                <div className='detail row'>
                    <div className="col-md-3 product-img">
                        {/* <img className='img' src={`../../../img/${JSON.parse(product.photo)[0]}`} /> */}
                        <div className="product-images">
                            {/* Phần hiển thị ảnh to */}
                            <div className="main-image">
                                <img
                                    className={`img ${slideDirection === 'left' ? 'slide-left' : slideDirection === 'right' ? 'slide-right' : 'slide-enter'}`}
                                    src={`../../../img/${selectedImage}`} alt="Product" value={selectedImage} />
                            </div>

                            {/* Phần hiển thị các ảnh nhỏ */}
                            <button className="scroll-button left" onClick={() => scrollThumbnails('left')}>
                                &lt;
                            </button>
                            <div className="thumbnail-images"
                                ref={thumbnailRef}
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                            >

                                {images.map((image, index) => (
                                    <div key={index}>
                                        <img

                                            className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                                            src={`../../../img/${image}`}
                                            alt="Product Thumbnail"
                                            onClick={() => handleImageClick(image, index > images.indexOf(selectedImage) ? 'right' : 'left')} // Xác định hướng trượt dựa trên ảnh đã chọn
                                        />
                                    </div>
                                ))}
                            </div>
                            <button className="scroll-button right" onClick={() => scrollThumbnails('right')}>
                                &gt;
                            </button>


                        </div>
                    </div>

                    <div className='col-md-6 product-form'>

                        {/* Header Section */}
                        <div className="product-header">
                            <h1 value={name}>{product.name}</h1>
                            <span value={price}>{product.brand}</span>
                            <span>Tình trạng: Còn hàng</span>
                        </div>

                        {/* Price and Storage Options */}
                        <div className="product-price">
                            <p>Giá:
                                <a> {formatCurrency(product.price)}</a>
                            </p>

                            <span>Giá cũ: <strike className="price-old">10.000.000đ</strike></span>

                        </div>

                        <div className="quantity-selection">
                            <span>Số lượng</span>
                            <div className="quantity-controls">
                                <button className="quantity-btn" onClick={decrementQuantity}>-</button>
                                <input className="quantity-input text-center" value={quantity} readOnly />
                                <button className="quantity-btn" onClick={incrementQuantity}>+</button>
                            </div>
                        </div>


                        {/* Call-to-Action Buttons */}
                        <div className="action-buttons">
                            <div className="btn-1 ">
                                <button className="btn-shopping" onClick={handleCheckout}>
                                    <FaShoppingCart /> Mua ngay<br />
                                    <span>Giao hàng tận nơi hoặc nhận tại cửa hàng</span>
                                </button>
                            </div>

                            <div className="btn-2">
                                <button className="themgiohang" onClick={addToCart}>Thêm vào giỏ hàng</button>
                                {/* <button className="themgiohang" onClick={handleClick} disabled={cartLoading}>
                                    {cartLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                                </button> */}
                                <button className="mua-tra-gop">Mua trả góp</button >
                            </div>

                        </div>
                    </div>
                    <div className='col-md-3 form-policy'>
                        <div className="sidebar">
                            {/* Chính sách của chúng tôi */}
                            <div className="policies">
                                <div className="section-title">Chính Sách Của Chúng Tôi</div>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_1.png?1719291840576" />
                                    Miễn phí vận chuyển tại TP.HCM
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_2.png?1719291840576" />
                                    Bảo hành chính hãng toàn quốc
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_3.png?1719291840576" />
                                    Cam kết chính hãng 100%
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_4.png?1719291840576" />
                                    1 đổi 1 nếu sản phẩm lỗi
                                </p>
                            </div>

                            {/* Có thể bạn thích */}
                            <div className="recommendations">
                                <div className="section-title">Có Thể Bạn Thích</div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="describe row">
                    <div className="tab">
                        <Link onClick={() => setActiveTab("des")}>Mô tả sản phẩm</Link>
                        <Link onClick={() => setActiveTab("policy")}>Chính sách đổi trả</Link>
                    </div>
                    {activeTab === "des" &&
                        (
                            <div className="des col-9 m-3">
                                {/* <span>
                                    Nguồn gốc iPhone 14 Pro Max chính hãng<br />
                                    iPhone 14 Pro Max 512GB chính hãng nói riêng và toàn bộ sản phẩm công nghệ nói chung
                                    được Di Động Thông Minh nhập trực tiếp từ những nhà phân phối lớn hàng đầu Việt Nam như
                                    FPT Trading, Dầu Khí, Digiworld hay Viettel,...
                                </span><br />
                                {isShow && (
                                    <span>
                                        Chính vì vậy, khi mua hàng tại hệ thống, quý khách hoàn toàn có thể yên tâm về chất lượng cũng như chế độ bảo hành chính hãng.<br />
                                        Không chỉ vậy, Di Động Thông Minh còn cam kết sản phẩm nguyên seal chính hãng và dễ dàng check thông tin IMEI trên trang chủ Apple để kiểm chứng.<br />
                                        Đánh giá thiết kế iPhone 14 Pro Max 512GB : Mới mẻ, thời thượng<br />
                                        iPhone 14 Pro Max 512GB năm nay có màu mới tím mới khá lạ mắt. Còn lại, về hình thức thì không khác biệt gì nhiều so với iPhone 13 Pro Max với mặt lưng kính, phần khung viền thiết kế vuông vức và được bo cong bốn góc.<br />
                                        Bên khung cạnh phải có phím nguồn, còn khung cạnh trái có cần gạt rung, phím chỉnh âm lượng và khe sim, thiết bị vẫn có có cổng Lightning và loa ngoài.<br />
                                        Đánh giá màn hình iPhone 14 Pro Max: Ấn tượng với Dynamic Island kỳ diệu
                                        Màn hình iPhone 14 Pro Max mới có kích thước 6.7” cùng tấm nền OLED với độ phân giải Full HD+ (1290 x 2796 pixel) cho chất lượng hiển thị cực đã mắt.<br />
                                    </span>
                                )} */}
                                <span>{product.description}</span>
                                {/* <div className="bg-cl-active"></div>
                                <button className="showmore" onClick={() => handleShowmore()}>
                                    {isShow ? "Thu gọn" : "Xem thêm"}
                                </button><br /> */}


                            </div>
                        )

                    }
                    {activeTab === "policy" &&
                        (
                            <div className="chinhsach col-9 m-3">
                                + Sản phẩm lỗi, hỏng do quá trình sản xuất hoặc vận chuyện<br />
                                + Nằm trong chính sách đổi trả sản phẩm của Bean<br />
                                + Sản phẩm còn nguyên tem mác không bị rớt vỡ, vô nước<br />
                                + Thời gian đổi trả nhỏ hơn 15 ngày kể từ ngày nhận hàng<br />
                                + Chi phí bảo hành về sản phẩm, vận chuyển khách hàng chịu chi phí
                                Điều kiện đổi trả hàng<br />
                                Điều kiện về thời gian đổi trả: trong vòng 07 ngày kể từ khi nhận được hàng và phải liên hệ gọi ngay cho chúng tôi theo số điện thoại trên để được xác nhận đổi trả hàng.
                                Điều kiện đổi trả hàng:<br />
                                - Sản phẩm gửi lại phải còn nguyên đai nguyên kiện<br />
                                - Phiếu bảo hành (nếu có) và tem của công ty trên sản phẩm còn nguyên vẹn.<br />
                                - Sản phẩm đổi/ trả phải còn đầy đủ hộp, giấy hướng dẫn sử dụng và không bị trầy xước, bể.<br />
                                - Quý khách chịu chi phí vận chuyển, đóng gói, thu hộ tiền, chi phí liên lạc tối đa tương đương 10% giá trị đơn hàng.
                            </div>
                        )
                    }
                </div>

                {/* Additional Information and Recommendations */}

                <div>
                    <p className="mt-3">Sản phẩm liên quan</p>
                    <div className="my-deal-phone container p-3 mt-3">
                        <section className="content container">
                            <div className="content-deal row p-2 justify-content-start">
                                {/* Lặp qua danh sách sản phẩm và hiển thị */}
                                {relatedProducts.length > 0 ? (
                                    relatedProducts.map((item) => (
                                        <Card className="box col-2 m-2 item-cart" key={item.id}>
                                            {/* <div className="discount-badge">-9%</div> Phần giảm giá */}
                                            <div className="favorite-icon" >
                                                {/* Đổi icon dựa trên trạng thái yêu thích */}
                                                {/* <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i> */}
                                            </div>
                                            <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                                <Card.Img
                                                    className="product-image"
                                                    src={`../../../img/${JSON.parse(item.photo)[0]}`}
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

                </div>
            </div>
        </>
    );

}

export default ProductDetail;
