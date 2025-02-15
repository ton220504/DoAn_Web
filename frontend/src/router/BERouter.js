import AdminPage from "../page/Admin/admin";
import Abate from "../page/Admin/Cart/Abate";
import Cart from "../page/Admin/Cart/Cart";
import Wishlist from "../page/Admin/Cart/Wishlist";
import Category from "../page/Admin/Category/Category";
import Products from "../page/Admin/Product/Product";
import ProductCreate from "../page/Admin/Product/ProductCreate";
import ProductEdit from "../page/Admin/Product/ProductEdit";
import User from "../page/Admin/User/User";

const BERouter = [
    //{ path: "/admin/user", components: <TableUsers /> },
    //{ path: "/admin/login", components: <LoginAdmin /> },
    { path: "/admin", components: <AdminPage /> },
    { path: "/admin/product", components: <Products /> },
    { path: "/admin/category", components: <Category /> },
    { path: "/admin/productCreate", components: <ProductCreate /> },
    { path: "/admin/ProductEdit/:id", components: <ProductEdit /> },
    { path: "/admin/user", components: <User /> },
    { path: "/admin/cart", components: <Cart /> },
    { path: "/admin/abate", components: <Abate /> },
    { path: "/admin/wishlist", components: <Wishlist /> },




]
export default BERouter;