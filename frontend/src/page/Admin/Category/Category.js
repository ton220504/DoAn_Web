import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";

const Category = () => {
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [editModalShow, setEditModalShow] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [success, setSuccess] = useState(false);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        if (name === "name") setName(value);
    };

    const submitCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/product/categories", { name });
            Swal.fire({
                icon: "success",
                text: response.data.message,
            }).then(() => {
                fetchCategories();
                setName("");
            });
        } catch (error) {
            if (error.response.status === 422) {
                Swal.fire({
                    text: error.response.data.message,
                    icon: "error",
                });
            } else {
                console.error("Error creating category", error);
            }
        }
    };

    const deleteCategory = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!isConfirm.isConfirmed) {
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:8000/api/product/categories/${id}`);
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Category has been deleted successfully.",
            }).then(() => {
                fetchCategories();
            });
        } catch (error) {
            console.error("Failed to delete category", error);
            Swal.fire({
                text: "Failed to delete category",
                icon: "error",
            });
        }
    };

    const openEditModal = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/product/categories/${id}`);
            const category = response.data;
            setEditCategoryId(category.id);
            setEditCategoryName(category.name);
            setEditModalShow(true);
        } catch (error) {
            console.error("Error fetching category for edit", error);
            Swal.fire({
                text: "Failed to fetch category for edit",
                icon: "error",
            });
        }
    };

    const closeEditModal = () => {
        setEditModalShow(false);
        setEditCategoryId(null);
        setEditCategoryName("");
    };

    const handleEditCategory = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/product/categories/${editCategoryId}`, { name: editCategoryName });
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: response.data.message,
            });
            fetchCategories();
            setEditModalShow(false);
        } catch (error) {
            console.error("Failed to update category", error);
            Swal.fire({
                text: "Failed to update category",
                icon: "error",
            });
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/product/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Error fetching categories", error);
            setCategories([]);
        }
    };

    return (
        <div className="row">
            <div className="col-4"  >
                <form onSubmit={submitCategory}>
                    <div className="container-fluid card shadow my-2 mx-2">
                        <div>
                            <h3 className="text-success text-center">Create Category</h3>
                        </div>
                        <div className="mb-3 mt-3">
                            <label htmlFor="name" className="form-label">Thương hiệu</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Nhập tên thương hiệu"
                                value={name}
                                onChange={changeHandler}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mb-2">Lưu</button>
                    </div>
                </form>
            </div>
            <div className="col-8">
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">All Category</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" cellSpacing="0" style={{ width: "700px" }}>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th style={{ width: "150px" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr key={category.id}>
                                                <td>{category.id}</td>
                                                <td>{category.name}</td>
                                                <td>
                                                    <Button variant="success me-2" onClick={() => openEditModal(category.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button variant="danger" onClick={() => deleteCategory(category.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                        </svg>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={editModalShow} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="editName" className="form-label">Tên thương hiệu</label>
                        <input
                            type="text"
                            className="form-control"
                            id="editName"
                            name="editName"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditCategory}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;
