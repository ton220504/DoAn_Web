import React from "react";
import { LuPhoneCall } from "react-icons/lu";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import ContentHeader from "./ContentHeader";

const Header = () => (
    <>
        <div className="Top-header container ">
            <div className="row">
                <div className="col-xl-2 col-lg-2 col-md-12 col-sm-12 col-xs-12 col-12 header-logo">
                    <img className="img-header"
                        src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/logo.png?1719291840576" />
                </div>
                <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12">
                    <div className="search ">
                        <input type="search" placeholder="Bạn muốn tìm gì" className="form-control" />
                        <button className="icon-search">
                            <CiSearch />
                        </button>
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
    </>
)
export default Header