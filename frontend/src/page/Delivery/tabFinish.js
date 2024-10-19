import { Button, Modal, Form } from "react-bootstrap";
import { CiDeliveryTruck } from "react-icons/ci";
import { Link } from "react-router-dom";
import swal from 'sweetalert';


const TabFinish = (props) => {
    const { show, products, handleShow, handleClose } = props
    const handleDanhgia = () => {
        handleClose();
        swal("Cảm ơn bạn đã đánh giá!", "Nhấn OK để thoát!", "success")
        //return 0;

    }
    return (
        <>
            {products.map((item, index) => {
                return (
                    <div className="bg-white p-4 mt-2" key={`index-${index}`}>
                        <div className="d-flex justify-content-between d-inline">
                            <div className="d-flex flex-row d-block">
                                <div>
                                    <button className="bg-danger rounded text-white me-2">Yêu thích+</button>
                                </div>
                                <div>
                                    <b className="me-2">| Phụ Kiện Giá Sỉ Aha24h |</b>
                                </div>
                                <div>
                                    <Link className="p-1 rounded me-2 bg-primary text-white border">Chat</Link>
                                </div>
                                <div>
                                    <Link className="text-white bg-warning rounded border">Xem Shop</Link>
                                </div>
                            </div>
                            <div className="">
                                <CiDeliveryTruck className="text-success" /><span className="ml-1 me-2 border-right text-success">Giao hàng thành công |</span>
                                <span className="text-red-500 font-bold text-danger"><b>HOÀN THÀNH</b></span>
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex flex-row align-items-center ">
                            <Link to="/##"><img src={item.image} style={{ width: "80px", height: "80px" }} /></Link>
                            <div className="align-content-center ms-3">
                                <div className=""><b>{item.title}</b></div>
                                <span className="text-secondary">Phân loại hàng: AH129 - Trong đen</span>
                                <div className="">Số lượng: {item.rating.count}</div>
                                <span className="text-success">Trả hàng miễn phí 15 ngày</span>
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex flex-row-reverse mb-5">
                            <span>Thành tiền: <b className="thanh-tien">{item.price}</b></span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="danh-gia">
                                Đánh giá sản phẩm trước <span className="text-danger">15-10-2024</span>
                                <br />
                                <span className="text-danger">Đánh giá ngay và nhận 200 Xu</span>
                            </div>
                            <div className="btn-action">
                                <button className="btnDanhgia me-2 bg-danger text-white p-1 border " onClick={handleShow} >Đánh Giá</button>
                                <button className="btnLienhe me-2 p-1 border">Liên Hệ Người Bán</button>
                                <button className="btnMualai p-1 border">Mua Lại</button>
                            </div>
                        </div>
                    </div>
                )
            })}
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                </Modal.Header>
                <div className="d-flex flex-row align-items-center container">
                    <Link to="/##"><img src="https://down-vn.img.susercontent.com/file/da017171936fb9d52f1df8f2ea5e39ad_tn" style={{ width: "80px", height: "80px" }} /></Link>
                    <div className="align-content-center ms-3">
                        <div className=""><b>Mắt kính giả cận thời trang nam nữ gọng kính mắt chữ V hàn quốc đẹp</b></div>
                        <span className="text-secondary">Phân loại hàng: AH129 - Trong đen</span>

                    </div>
                </div>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Màu sắc:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="để lại đánh giá."
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Chất liệu:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="để lại đánh giá."
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Đúng với mô tả</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} >
                        Trở lại
                    </Button>
                    <Button variant="primary" onClick={handleDanhgia} >
                        Đánh giá
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default TabFinish;