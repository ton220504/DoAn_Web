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
        price: ""
        
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
            await axios.put(`http://127.0.0.1:8000/api/products/${id}`, product, {
                //headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setSuccess(true);
            navigate("/admin/product");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error(err);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct({
            ...product,
            [name]: value,
        });

        if (success) {
            setSuccess(false);
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
                        {/* <div className="form-group">
                            <label className="small mb-1">Quantity</label>
                            <input
                                className="form-control"
                                name="quantity"
                                value={product.quantity}
                                onChange={handleChange}
                                type="number"
                                placeholder="Product quantity"
                                required
                            />
                        </div> */}
                        {/* <div className="form-group">
                            <label className="small mb-1">Images</label>
                            <div>
                                {product.photos &&
                                    product.photos.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={`/img/${photo}`}
                                            alt={photo}
                                            className="img-thumbnail"
                                            height="100px"
                                            width="100px"
                                            style={{ marginRight: "10px" }}
                                        />
                                    ))}
                            </div>
                        </div> */}
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