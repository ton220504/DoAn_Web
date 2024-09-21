//import Home from "../page/Home";
//import Login from "../page/Login";
import ProductDetail from "../page/Product/ProductDetail";
//import Register from "../page/Register";
import Cart from "../page/Product/Cart";
import AllProduct from "../page/Product/AllProduct";

const FERouter = [
  //{ path: "/", components: <Home /> },
  //{ path: "login", components: <Login /> },
  //{ path: "dangki", components: <Register /> },
  { path: "chi-tiet-san-pham/:id", components: <ProductDetail /> },
  { path: "cart", components: <Cart /> },
  { path: "tat-ca-san-pham", components: <AllProduct /> },
  // Các dòng bị comment, có thể xóa bỏ
  // { path: "/", components: <Home /> },
  // { path: "/", components: <Home /> },
  // { path: "/", components: <Home /> },
  // { path: "/", components: <Home /> },
];

export default FERouter;