import Category from "../page/Admin/Category/Category";
import Products from "../page/Admin/Product/Product";
import ProductCreate from "../page/Admin/Product/ProductCreate";
import ProductEdit from "../page/Admin/Product/ProductEdit";
import User from "../page/Admin/User/User";

const BERouter = [
    //{ path: "/admin/user", components: <TableUsers /> },
    { path: "/admin/product", components: <Products /> },
    { path: "/admin/category", components: <Category /> },
    { path: "/admin/productCreate", components: <ProductCreate /> },
    { path: "/admin/ProductEdit/:id", components: <ProductEdit /> },
    { path: "/admin/user", components: <User /> },




]
export default BERouter;