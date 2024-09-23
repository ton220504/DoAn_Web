import { FaShoppingCart } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ComeBack from "../../Components/ComeBack";
import "../../scss/ProductDetail.scss";
import numeral from "numeral";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";




const ProductDetail = ({ ip, stocks, selectedSize, selectedColor, avaibleQuantity }) => {
    const [activeTab, setActiveTab] = useState('des');
    const [isShow, setIsShow] = useState(false);
   
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    


    const navigate = useNavigate();

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);

                // Cập nhật state với đối tượng sản phẩm
                setProduct(response.data);
                setLoading(false);  // Dừng loading sau khi đã fetch dữ liệu xong
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setLoading(false);  // Dừng loading dù có lỗi
            }
        };

        fetchProduct();
    }, [id]);  // Đảm bảo chỉ gọi khi ID thay đổi
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,
                
            }}>
                <img style={{width:"100px", height:"100px"}} src="../../../img/loading-gif-png-5.gif"/>
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
                <img style={{width:"100px", height:"100px"}} src="../../../img/loading-gif-png-5.gif"/>
            </div>
        );
    }
    const addToCart = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/product/cart-list', {
                stockId: id, // Thay thế với `stockId` nếu bạn cần
                quantity: quantity
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 200) {
                //toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
                // Cập nhật giỏ hàng sau khi thêm sản phẩm
                //getShoppingCartList();
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm vào giỏ hàng thành công',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Chuyển hướng đến trang chủ sau khi người dùng nhấn nút "OK"
                    navigate(`/chi-tiet-san-pham/${id}`);
                    window.location.reload();

                });
            } else {
                 toast.error("Không thể thêm sản phẩm vào giỏ hàng!");

            }
        } catch (error) {
            // console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
            Swal.fire({
                icon: 'error',
                title: 'Sản phẩm đã thêm vào giỏ hàng!',
                //confirmButtonText: 'OK'
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
                        <img className='img' src={`../../../img/${JSON.parse(product.photo)[0]}`} />
                    </div>
                    <div className='col-md-6 product-form'>

                        {/* Header Section */}
                        <div className="product-header">
                            <h1>{product.name}</h1>
                            <span>{product.brand}</span>
                            <span>Tình trạng: Còn hàng</span>
                        </div>

                        {/* Price and Storage Options */}
                        <div className="product-price">
                            <p>Giá: {formatCurrency(product.price)}</p>
                            <span>Giá cũ: <strike className="text-danger">10.000.000đ</strike></span>
                            {/* <div className="storage-options">
                                <label>
                                    <input type="radio" value="64GB" checked={storage === '64GB'} onChange={handleStorageChange} />
                                    64GB - 5.990.000₫
                                </label>
                                <label>
                                    <input type="radio" value="256GB" checked={storage === '256GB'} onChange={handleStorageChange} />
                                    256GB - 6.590.000₫
                                </label>
                            </div> */}
                        </div>
                        {/* Quantity Selection */}
                        <div className="quantity-selection">
                            <span >Số lượng</span>
                            <button onClick={decrementQuantity}>-</button>
                            <input className='text-center' value={quantity} readOnly style={{ width: "30px" }} />
                            <button onClick={incrementQuantity}>+</button>
                        </div>

                        {/* Call-to-Action Buttons */}
                        <div className="action-buttons">
                            <div className="btn-1 ">
                                <button className="btn btn-warning">
                                    <FaShoppingCart /> Mua ngay<br />
                                    <span>Giao hàng tận nơi hoặc nhận tại cửa hàng</span>
                                </button>
                            </div>

                            <div className="btn-2">
                                <button className="themgiohang" onClick={addToCart}>Thêm vào giỏ hàng</button>
                                {/* <button className="themgiohang" onClick={handleClick} disabled={cartLoading}>
                                    {cartLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                                </button> */}
                                <button className="mua-tra-gop">MUA TRẢ GÓP</button >
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

            </div>
        </>
    );

}

export default ProductDetail;
