import { Link, Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Container, Navbar } from "react-bootstrap";

const Header = (props) => {
    return (
        <>
            <Navbar className="bg-body-tertiary" data-bs-theme="dark">
                <Navbar.Brand to="#home"><h2>Trang quản lí</h2></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: <Link to="#login">Mark Otto</Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                            <Link to="/admin" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                <span className="fs-5 d-none d-sm-inline">Danh mục</span>
                            </Link>
                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link align-middle px-0">
                                        <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Trang chủ</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="user" className="nav-link px-0 align-middle">
                                        <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Người dùng</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="product" className="nav-link px-0 align-middle">
                                        <i className="fs-4 bi-box"></i> <span className="ms-1 d-none d-sm-inline">Sản phẩm</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="category" className="nav-link px-0 align-middle">
                                        <i className="fs-4 bi-tags"></i> <span className="ms-1 d-none d-sm-inline">Danh mục sản phẩm</span>
                                    </Link>
                                </li>
                            </ul>
                            <hr />
                            <div className="dropdown pb-4">
                                <Link to="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30" className="rounded-circle" />
                                    <span className="d-none d-sm-inline mx-1">loser</span>
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                                    <li><Link className="dropdown-item" to="#">New project...</Link></li>
                                    <li><Link className="dropdown-item" to="#">Settings</Link></li>
                                    <li><Link className="dropdown-item" to="#">Profile</Link></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><Link className="dropdown-item" to="#">Sign out</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col py-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
