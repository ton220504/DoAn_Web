import axios from "axios";
import numeral from "numeral";
import { useEffect, useState } from "react";

const ProductCartDetail = ({ id,onPriceChange  }) => {
    const [product, setProduct] = useState(null); // Chỉnh sửa thành 'product' thay vì 'products'
    

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`); // Sử dụng 'id' thay vì 'product.id'

                // Cập nhật state với đối tượng sản phẩm
                setProduct(response.data);
                if (onPriceChange) {
                    onPriceChange(response.data.price);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchProduct();
    }, [id,onPriceChange ]); // Đảm bảo chỉ gọi khi ID thay đổi

    return (
        <div>
            {product ? ( // Kiểm tra nếu 'product' không phải null
                <div>
                    <div className="col-md-3 product-img" >
                        <img style={{width:"100px", height:"100px"}} className='img' src={`../../../img/${JSON.parse(product.photo)[0]}`} alt={product.name} />
                    </div>
                    <div>{product.name}</div>
                    <p>{formatCurrency(product.price)}</p>
                </div>
            ) : (
                <p>Đang tải sản phẩm...</p> // Hiển thị thông báo loading nếu chưa có dữ liệu
            )}
        </div>
    );
}

export default ProductCartDetail;
