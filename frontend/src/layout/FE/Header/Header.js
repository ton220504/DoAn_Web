import React, { useState } from "react";
import { LuPhoneCall } from "react-icons/lu";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import ContentHeader from "./ContentHeader";
//import { Link } from "react-router-dom";
//import SearchItem from "../../../page/SreachItem";
//import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../../../assets/css/header.css";

//Lấy dữ liệu từ database


const Header = () => {


    const [keySearch, setKeySearch] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);  // Lưu lịch sử tìm kiếm
    const [suggestions, setSuggestions] = useState([]);  // Lưu gợi ý sản phẩm

    // Danh sách sản phẩm ví dụ
    const products = [
        "Laptop Dell",
        "Laptop HP",
        "iPhone 13",
        "Samsung Galaxy S21",
        "Sony Headphones",
        "MacBook Air",
        "Apple Watch",
    ];


    // Hàm xử lý khi người dùng nhập từ khóa tìm kiếm
    const handleSearch = (event) => {
        event.preventDefault();
        const keyword = event.target.value.toLowerCase();
        setKeySearch(keyword);
        // Cập nhật gợi ý dựa trên từ khóa tìm kiếm
        if (keyword) {
            const filteredSuggestions = products.filter(product =>
                product.toLowerCase().includes(keyword)
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);  // Nếu không có từ khóa, không hiển thị gợi ý
        }

    }
    // const handlekeyDown = (e) => {
    //     if (e.key === 'Enter') {  // Kiểm tra nếu phím Enter được nhấn
    //         window.location.href = `/search-results?query=${keySearch}`;  // Điều hướng đến trang kết quả tìm kiếm
    //     }
    // };
    // Hàm xử lý khi người dùng nhấn phím Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {  // Kiểm tra nếu phím Enter được nhấn
            // Lưu từ khóa vào lịch sử tìm kiếm
            if (keySearch && !searchHistory.includes(keySearch)) {
                setSearchHistory([keySearch, ...searchHistory]);  // Thêm từ khóa mới vào lịch sử
            }
            // Điều hướng đến trang kết quả tìm kiếm
            window.location.href = `/search-results?query=${keySearch}`;
        }
    };

    // Hàm xử lý khi người dùng chọn một gợi ý từ danh sách
    const handleSuggestionClick = (suggestion) => {
        setKeySearch(suggestion);  // Điền gợi ý vào ô tìm kiếm
        setSuggestions([]);  // Ẩn danh sách gợi ý
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
                                onKeyDown={(e) => handleKeyDown(e)}
                                placeholder="Bạn muốn tìm gì" className="form-control" />
                            <div className="input-group-text" >
                                <CiSearch />
                            </div>
                            {/* Hiển thị gợi ý tìm kiếm nằm ngang */}
                            {suggestions.length > 0 && (
                                <div className="suggestions-container">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(suggestion)}  // Xử lý chọn gợi ý
                                        >
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hiển thị lịch sử tìm kiếm
                            {searchHistory.length > 0 && (
                                <div className="mt-3">
                                    <h6>Lịch sử tìm kiếm:</h6>
                                    <ul className="list-group">
                                        {searchHistory.map((historyItem, index) => (
                                            <li key={index} className="list-group-item">
                                                {historyItem}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )} */}

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