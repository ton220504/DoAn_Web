import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const ProductCreate = ({ userId }) => {
    const { id } = useParams();

    const [name, setName] = useState("");
    const [category_id, setCategory_id] = useState(0);
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState(0);
    const [photo, setPhoto] = useState("");
    const [description, setDescription] = useState("");
    const [details, setDetails] = useState("");
    const navigate = useNavigate();


    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi từ server


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
    useEffect(() => {

        getCategories();
    }, []);




    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case 'category_id':
                setCategory_id(parseInt(value)); // Chuyển đổi thành số nguyên
                break;
            case 'brand':
                setBrand(value);
                break;
            case 'price':
                setPrice(parseFloat(value)); // Chuyển đổi thành số thực
                break;
            case 'description':
                setDescription(value);
                break;
            case 'details':
                setDetails(value);
                break;
            default:
                break;
        }
    };
    // Xử lý chọn file ảnh
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Lấy danh sách file từ input
        // Tạo mảng chứa tên file
        const fileNames = files.map(file => file.name); // Lấy tên file từ đối tượng file

        // Kiểm tra đầu ra
        console.log(fileNames); // Sẽ in ra mảng tên file: ["iphone16_black.png", "iphone16_blue.png", ...]

        setPhoto(fileNames); // Lưu trữ tên file ảnh dưới dạng mảng
    };

    function handleSubmit(e) {
        e.preventDefault();
        // Tạo FormData để gửi file và dữ liệu
        const formData = new FormData();
        formData.append("name", name);
        formData.append('category_id', parseInt(category_id)); // Chuyển đổi categoryId thành số nguyên
        formData.append("brand", brand);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("details", details);
        // Thêm tất cả tên file vào formData dưới dạng mảng
        photo.forEach((photoItem) => {
            formData.append("photo[]", photoItem); // Sử dụng "photo[]" để thêm phần tử vào mảng
        });
        console.log(formData.getAll('photo[]')); // Kiểm tra đầu ra của mảng tên file
        console.log({
            name: name,
            category_id: category_id,
            brand: brand,
            price: price,
            description: description,
            details: details,
            photo: photo
        });
        // Gửi yêu cầu POST để tạo sản phẩm với file
        axios.post("http://127.0.0.1:8000/api/products", formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Đảm bảo tiêu đề gửi file
            }
        })
            .then(() => {
                // Xử lý thành công, ví dụ: reset form
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm sản phẩm thành công!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Chuyển hướng đến trang chủ sau khi người dùng nhấn nút "OK"
                    navigate("/admin/product");

                });
            })
            .catch((err) => {
                if (err.response && err.response.status === 422) {
                    console.error("Lỗi 422: Dữ liệu không hợp lệ", err.response.data);
                    setErrorMessage("Lỗi 422: Dữ liệu không hợp lệ");
                } else {
                    setErrorMessage("Lỗi không đặt hàng thành công");
                }
            });
    }


    return (
        <div className="container-fluid">
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Thêm sản phẩm</h6>
                    {errorMessage && (
                        <div className="alert alert-danger text-center">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="small mb-1">Tên sản phẩm</label>
                            <div>
                                <input
                                    className="form-control"
                                    name="name"
                                    onChange={handleChange}
                                    type="name"
                                    placeholder="Tên sản phẩm..."
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Loại</label>
                            <select
                                className="form-control"
                                name="category_id"
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
                            <label className="small mb-1">Thương hiệu</label>
                            <input
                                className="form-control"
                                name="brand"
                                onChange={handleChange}
                                type="brand"
                                placeholder="Thương hiệu..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Giá</label>
                            <input
                                className="form-control"
                                name="price"
                                onChange={handleChange}
                                type="text"
                                placeholder="Giá..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Hình ảnh (2 hình trở lên)</label>
                            <input
                                className="form-control"
                                name="photos"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange} // Xử lý thay đổi khi chọn file
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="small mb-1">Mô tả</label>
                            <textarea
                                rows="4"
                                className="form-control"
                                name="description"
                                onChange={handleChange}
                                placeholder="Mô tả..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="small mb-1">Chi tiết</label>
                            <textarea
                                rows="3"
                                className="form-control"
                                name="details"
                                onChange={handleChange}
                                placeholder="Chi tiết..."
                                required
                            />
                        </div>

                        <div className="form-group mt-3">
                            <button type="submit" className="btn btn-primary btn-block">
                                Thêm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductCreate;