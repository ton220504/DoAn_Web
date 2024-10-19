import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        category_id: "",
        brand: "",
        description: "",
        details: "",
        price: "",
        photo: "", // Giả sử bạn lưu ảnh dưới dạng mảng

    });

    const [categories, setCategories] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getProduct();
        getCategories();
    }, []);
    const token = localStorage.getItem("token");
    //console.log(token);
    const getProduct = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/products/${id}`
            );
            const productData = response.data;
            setProduct({
                ...productData,
            });
            // Giả sử ảnh cũ là một chuỗi JSON, bạn có thể phân tích nó nếu cần
            // setProduct({
            //     ...productData,
            //     photo: productData.photo // Giữ ảnh cũ trong trạng thái
            // });

        } catch (error) {
            console.error(error);
        }
    };

    const getCategories = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/product/categories`
            );
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Chuyển đổi photo về định dạng mảng trước khi gửi lên server
            const updatedProduct = {
                ...product,
                photo: product.photo ? JSON.parse(product.photo) : [] // Chuyển đổi từ JSON về mảng hoặc giữ nguyên nếu không có ảnh
            };
            await axios.put(`http://127.0.0.1:8000/api/products/${id}`, updatedProduct , {
                //headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setSuccess(true);
            alert("Cập nhật sản phẩm thành công!");
            navigate("/admin/product");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error(err);
        }
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();

    //     // Thêm tất cả các thuộc tính vào FormData
    //     for (const key in product) {
    //         if (key === "photo" && Array.isArray(product.photo)) {
    //             // Nếu là mảng, thêm từng file vào FormData
    //             product.photo.forEach((file) => {
    //                 formData.append("photos[]", file); // Gửi từng file
    //             });
    //         } else {
    //             // Nếu không phải ảnh, thêm các thuộc tính khác
    //             formData.append(key, product[key]);
    //         }
    //     }

    //     try {
    //         await axios.put(`http://127.0.0.1:8000/api/products/${id}`, formData, {
    //             headers: { 'Content-Type': 'multipart/form-data' },
    //             // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //         });
    //         setSuccess(true);
    //         navigate("/admin/product");
    //     } catch (err) {
    //         setError("An unexpected error occurred. Please try again.");
    //         console.error(err);
    //     }
    // };

    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     setProduct({
    //         ...product,
    //         [name]: value,
    //     });

    //     if (success) {
    //         setSuccess(false);
    //     }
    // };
    const handleChange = (event) => {
        const { name, files } = event.target;
    
        if (name === 'photo') {
            // Nếu người dùng chọn tệp
            if (files.length > 0) {
                // Chuyển đổi files thành mảng tên tệp
                const fileNames = Array.from(files).map(file => file.name);
    
                // Cập nhật trạng thái với tên tệp mới
                setProduct(prev => ({
                    ...prev,
                    photo: JSON.stringify(fileNames) // Chuyển đổi thành JSON
                }));
            } else {
                // Nếu không có tệp nào được chọn, giữ nguyên ảnh cũ
                const currentPhotos = product.photo; // Lấy ảnh cũ
                setProduct(prev => ({
                    ...prev,
                    photo: currentPhotos // Giữ nguyên ảnh cũ
                }));
            }
        } else {
            // Xử lý các trường khác
            setProduct(prev => ({
                ...prev,
                [name]: event.target.value
            }));
        }
    };

    return (
        <div className="container-fluid">
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Edit Product</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="small mb-1">Name</label>
                            <input
                                className="form-control"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                type="text"
                                placeholder="Product name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Category</label>
                            <select
                                className="form-control"
                                name="category_id"
                                value={product.category_id}
                                onChange={handleChange}
                            >
                                {categories.map((c) => (
                                    <option value={c.id} key={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Brand</label>
                            <input
                                className="form-control"
                                name="brand"
                                value={product.brand}
                                onChange={handleChange}
                                type="text"
                                placeholder="Product brand"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Price</label>
                            <input
                                className="form-control"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                type="text"
                                placeholder="Product price"
                                required
                            />
                        </div>
                        {/* <div className="form-group">
                            <label className="small mb-1">Size</label>
                            <input
                                className="form-control"
                                name="size"
                                value={product.size}
                                onChange={handleChange}
                                type="text"
                                placeholder="Product size"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Color</label>
                            <input
                                className="form-control"
                                name="color"
                                value={product.color}
                                onChange={handleChange}
                                type="text"
                                placeholder="Product color"
                                required
                            />
                        </div> */}
                        <div className="form-group">
                            <label className="small mb-1">Description</label>
                            <textarea
                                rows="4"
                                className="form-control"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                placeholder="Product description"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Details</label>
                            <textarea
                                rows="2"
                                className="form-control"
                                name="details"
                                value={product.details}
                                onChange={handleChange}
                                placeholder="Product details"
                                required
                            />
                        </div>
                       
                        <div className="form-group">
                            <label className="small mb-1">Images</label>
                            <div>
                                {product.photo && product.photo !== "" ? (
                                    JSON.parse(product.photo).map((image, index) => (
                                        <img
                                            key={index}
                                            height="60px"
                                            width="60px"
                                            src={typeof image === "string" && image.includes("object") ? URL.createObjectURL(image) : `/img/${image}`} // Hiển thị từng ảnh
                                            alt={`Hình ảnh ${index + 1}`}
                                            style={{ margin: '5px' }}
                                        />
                                    ))
                                ) : (
                                    <p>Không có hình ảnh</p> // Hiển thị nếu không có hình ảnh
                                )}
                            </div>
                            <input
                                className="form-control"
                                name="photo"
                                onChange={handleChange}
                                placeholder="Upload image"
                                type="file"
                                multiple // Cho phép chọn nhiều ảnh
                                
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block">
                                Update Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductEdit;