import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from "axios";




const Products = () => {
  // State hooks to replace class state
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [product, setProduct] = useState([]);
  const [detailModalShow, setDetailModalShow] = useState(false);



  // Fetch products
  const getProducts = useCallback((pageNumber = 1) => {
    setLoading(true); // Set loading to true before fetching data
    Axios.get(`http://127.0.0.1:8000/api/products?page=${pageNumber}`).then((result) => {
      setCurrentPage(result.data.current_page);
      setPerPage(result.data.per_page);
      setTotal(result.data.total);
      setProducts(result.data.data);
      setLoading(false); // Data fetched, set loading to false
    });
  }, []);

  //chi tiết
  const openDetailModal = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);
      const productDetails = response.data;
      setProduct(productDetails)
      setDetailModalShow(true);

    } catch (error) {
      console.error("Error fetching product details", error);
      Swal.fire({
        text: "Failed to fetch product details",
        icon: "error",
      });
    }
  };

  const closeProductDetailModal = () => {
    setDetailModalShow(false);
    setProduct([])
  }


  
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Handle delete action
  const handleDelete = (productId) => {
    setDeletingProductId(productId);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        Axios.delete(`http://127.0.0.1:8000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: response.data.message,
            }).then(() => {
              getProducts(currentPage); // Refresh the product list after deletion
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response?.data?.message || "Something went wrong!",
            });
          })
          .finally(() => {
            setDeletingProductId(null); // Clear deleting state
          });
      } else {
        setDeletingProductId(null); // If user cancels, clear deleting state
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">All Products</h6>
          <Link to={'/admin/productCreate'} className="btn btn-success my-2 me-2 ">Thêm sản phẩm</Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Hình ảnh(đại diện)</th>

                  <th>Tên sản phẩm</th>

                  <th>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Spinner animation="border" />
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td style={{ textAlign: "center" }}>
                        <img
                          height="60px"
                          width="60px"
                          src={`/img/${JSON.parse(product.photo)[0]}`}
                          alt={JSON.parse(product.photo)[0]}
                        />
                      </td>

                      <td>{product.name}</td>


                      <td style={{ textAlign: "center" }}>
                        <Link to={`/admin/ProductEdit/${product.id}`} className="btn btn-success my-2 me-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                          </svg>
                        </Link>

                        <Button variant="success me-2 btn btn-warning" onClick={() => openDetailModal(product.id)} >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingProductId === product.id}
                        >
                          {deletingProductId === product.id ? <Spinner size="sm" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                          </svg>}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ float: "left" }}>
            {products.length > 0 && total > perPage && (
              <div className="pagination-container">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={perPage}
                  totalItemsCount={total}
                  pageRangeDisplayed={5}
                  onChange={(pageNumber) => getProducts(pageNumber)}
                  itemClass="page-item"
                  linkClass="page-link"
                  firstPageText="First"
                  lastPageText="Last"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal show={detailModalShow} onHide={closeProductDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Hiển thị thông tin của sản phẩm từ object product */}
          {product ? (
            <div>
              {/* Hiển thị hình ảnh */}
              <div><strong>Hình ảnh:</strong></div>
              <div>
                {product.photo && product.photo !== "" ? (
                  JSON.parse(product.photo).map((image, index) => (
                    <img
                      key={index} // Sử dụng key để xác định duy nhất mỗi ảnh
                      height="60px"
                      width="60px"
                      src={`/img/${image}`} // Hiển thị từng ảnh
                      alt={`Hình ảnh ${index + 1}`} // Đặt alt là tên ảnh hoặc số thứ tự ảnh
                      style={{ margin: '5px' }} // Thêm khoảng cách giữa các ảnh (nếu cần)
                    />
                  ))
                ) : (
                  <p>Không có hình ảnh</p> // Hiển thị nếu không có hình ảnh
                )}
              </div>

              {/* Hiển thị thông tin chi tiết sản phẩm */}
              <div><strong>Tên sản phẩm:</strong> {product.name}</div>
              <div><strong>Giá:</strong> {product.price}</div>
              <div><strong>Mô tả:</strong> {product.description}</div>
              <div><strong>Chi tiết:</strong> {product.details}</div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProductDetailModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default Products;
