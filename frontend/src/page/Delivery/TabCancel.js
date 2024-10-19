import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

const TabCancel = () => {

    return (
        <>
            <div className="font-sans">

                <div className="bg-white p-4 mt-2">
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
                            {/* <CiDeliveryTruck className="text-success" /><span className="ml-1 me-2 border-right text-success">Giao hàng thành công |</span> */}
                            <span className="text-red-500 font-bold text-danger"><b>ĐÃ HỦY</b></span>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex flex-row align-items-center ">
                        <Link to="/##"><img src="https://down-vn.img.susercontent.com/file/da017171936fb9d52f1df8f2ea5e39ad_tn" style={{ width: "80px", height: "80px" }} /></Link>
                        <div className="align-content-center ms-3">
                            <div className=""><b>Mắt kính giả cận thời trang nam nữ gọng kính mắt chữ V hàn quốc đẹp</b></div>
                            <span className="text-secondary">Phân loại hàng: AH129 - Trong đen</span>
                            <div className="">x1</div>
                            <span className="text-success">Trả hàng miễn phí 15 ngày</span>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex flex-row-reverse mb-5">
                        <span>Thành tiền: <b className="thanh-tien">100.000đ</b></span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="danh-gia">
                            <span className="text-danger">Đã hủy tự động bởi hệ thống Bean</span>
                            <br />
                            <span className="hover" data-toggle="tooltip" data-placement="right" title="ssssssssssss"><FiAlertCircle /></span>

                        </div>
                        <div className="btn-action">
                            <button className="btnDanhgia me-2 text-white ">Đánh Giá</button>
                            <button className="btnLienhe me-2 ">Xem chi tiết hủy đơn</button>
                            <button className="btnMualai ">Mua Lại</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
export default TabCancel;