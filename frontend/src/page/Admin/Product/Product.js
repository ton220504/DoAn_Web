import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";



const Products = () => {
  // State hooks to replace class state
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [deletingProductId, setDeletingProductId] = useState(null);

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

  // Similar to componentDidMount
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
                  <th>Photo</th>
                  <th>Brand</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
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
                          height="30px"
                          width="30px"
                          src={`/img/${JSON.parse(product.photo)[0]}`}
                          alt={JSON.parse(product.photo)[0]}
                        />
                      </td>
                      <td>{product.brand}</td>
                      <td>{product.name}</td>
                      <td>{product.category.name}</td>
                      <td>${product.price}</td>
                      <td>Available</td>
                      <td>
                        <Link to={`/admin/ProductEdit/${product.id}`} className="btn btn-success my-2 me-2">
                          Sửa
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingProductId === product.id}
                        >
                          {deletingProductId === product.id ? <Spinner size="sm" /> : "Xóa"}
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
    </div>
  );
};

export default Products;
