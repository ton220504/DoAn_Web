import { Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ComeBack from "../Components/ComeBack";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Xóa thông báo lỗi trước đó
    
        axios
            .post("http://127.0.0.1:8000/api/login", {
                email: email,
                password: password,
            })
            .then((result) => {
                localStorage.setItem("token", result.data.token);
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Chuyển hướng đến trang chủ sau khi người dùng nhấn nút "OK"
                    navigate("/");
                    window.location.reload();
                    
                });
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                // Kiểm tra lỗi từ server
                if (err.response) {
                    if (err.response.status === 422) {
                        // Lỗi xác thực không hợp lệ (thường là email hoặc mật khẩu không chính xác)
                        setErrorMessage("Dữ liệu không hợp lệ. Vui lòng kiểm tra email và mật khẩu.");
                    } else if (err.response.status === 400) {
                        // Nếu API trả về mã lỗi 404 khi email không tồn tại
                        setErrorMessage("Đăng nhập thất bại, vui lòng kiểm tra Email hoặc Mật khẩu của bạn.");
                    } 
                     else {
                        // Xử lý các lỗi khác nếu có
                        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại!");
                    }
                } else {
                    setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
                }
            });
    }
    

    function handleChange(e) {
        if (e.target.name === "email") setEmail(e.target.value);
        if (e.target.name === "password") setPassword(e.target.value);

    }

    return (
        <>
            <ComeBack />
            <Form className="mt-5 Login" onSubmit={handleSubmit}>
                <div className="content-login">
                    <h4 className="text-center">Đăng nhập</h4>
                    {/* Hiển thị thông báo lỗi nếu có */}
                    {errorMessage && (
                        <div className="alert alert-danger text-center">
                            {errorMessage}
                        </div>
                    )}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nhập Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Nhập mật khẩu</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} />
                    </Form.Group>
                    <Link className="forgot">Quên mật khẩu</Link>
                    <Link to="/dangki" className="register">Đăng kí tại đây</Link>

                </div>
                <div className="button p-3">
                    <Button className="signin form-control" type="submit">
                        {loading ? (
                            <div className="align-middle">
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span>Đăng nhập...</span>
                            </div>
                        ) : (
                            <span>Đăng nhập</span>
                        )}
                    </Button>
                </div>
                
            </Form>
        </>



    );
}
export default Login;