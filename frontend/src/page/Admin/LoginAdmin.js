import axios from "axios";
import { useState } from "react";
import { Button, Spinner,Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const LoginAdmin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Xóa thông báo lỗi trước đó
        if(!email){
            setErrorMessage("Vui lòng nhập email!");
            return;
        }
        if(!password){
            setErrorMessage("Vui lòng nhập mật khẩu!");
            return;
        }

        axios
            .post("http://127.0.0.1:8000/api/loginadmin", {
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
                    navigate("/admin");
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
        <Form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="form-control" style={{ width: "300px", height: "100%" }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "10px", marginBottom: "10px" }}>
                    <img
                        className="img-header"
                        src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/logo.png?1719291840576"
                        style={{ width: "200px", marginBottom: "10px" }}
                        alt="Logo"
                    />
                </div>
                {errorMessage && (
                    <div className="alert alert-danger text-center">
                        {errorMessage}
                    </div>
                )}
                <div>
                    <label>Nhập email</label>
                    <input className="form-control mb-3" type="email" name="email" placeholder="Nhập email..." onChange={handleChange} />
                </div>
                <div>
                    <label>Nhập mật khẩu</label>
                    <input className="form-control" type="password" name="password" placeholder="Nhập mật khẩu..." onChange={handleChange} />
                </div>
                <Link className="forgot">Quên mật khẩu</Link>
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
            </div>
        </Form>
    )
}

export default LoginAdmin;
