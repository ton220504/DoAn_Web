import React, { useState } from "react";
import { LuPhoneCall } from "react-icons/lu";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import ContentHeader from "./ContentHeader";
//import { Link } from "react-router-dom";
//import SearchItem from "../../../page/SreachItem";
//import { toast } from "react-toastify";
import { Link } from "react-router-dom";

//Lấy dữ liệu từ database


const Header = () => {


    const [keySearch, setKeySearch] = useState('');
    //const [filteredProducts, setFilteredProducts] = useState(product);

    // Hàm xử lý khi người dùng nhập từ khóa tìm kiếm
    const handleSearch = (event) => {
        event.preventDefault();
        const keyword = event.target.value.toLowerCase();
        setKeySearch(keyword);

        //Tìm sản phẩm phù hợp với từ khóa
        //const findKey = product.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()));


        // Lọc danh sách sản phẩm dựa trên từ khóa
        // if (keyword.length > 0) {
        //     const found = product.filter((item) =>
        //         item.name.toLowerCase().includes(keyword)
        //     )
        //     //setFilteredProducts(found);
        // } else {
        //     setFilteredProducts([])
        // }

    }
    const handlekeyDown = (e) => {
        if (e.key === 'Enter') {  // Kiểm tra nếu phím Enter được nhấn
            window.location.href = `/search-results?query=${keySearch}`;  // Điều hướng đến trang kết quả tìm kiếm
        }
    };


    return (
        <>
            <div className="Top-header container ">
                <div className="row">
                    <div className="col-xl-2 col-lg-2 col-md-12 col-sm-12 col-xs-12 col-12 header-logo">
                        <Link to={"/"}>
                        <img className="img-header"
                            src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/logo.png?1719291840576" />
                        </Link>
                    </div>
                    <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12">

                        <div className="input-group mb-3 ">
                            <input type="text"
                                value={keySearch}
                                onChange={(e) => handleSearch(e)}
                                onKeyDown={(e) => handlekeyDown(e)}
                                placeholder="Bạn muốn tìm gì" className="form-control" />
                            <div className="input-group-text">
                                <CiSearch />
                            </div>

                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 box-right">
                        <div className="CTP">
                            <div className="icon-phone">
                                <LuPhoneCall className="icon" />
                            </div>
                            <div className="content-phone">
                                <span>Hỗ trợ 24/24</span><br />
                                <span>19001005</span>
                            </div>

                        </div>
                        <div className="CTST">
                            <div className="icon-store">
                                <HiOutlineBuildingStorefront className="icon" />
                            </div>
                            <div className="content-store">
                                <span>Số hệ thống</span><br />
                                <span>8 hệ thống</span>
                            </div>

                        </div>


                    </div>

                </div>
            </div>
            <ContentHeader />

            {/* {isShow && (
                <SearchItem
                    //product={product}
                    filteredProducts={filteredProducts}
                />
            )} */}

        </>
    );
}

export default Header;