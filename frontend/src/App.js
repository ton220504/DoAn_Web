import './App.scss';
import Users from './Components/Users';
import TableUsers from './Components/TableUsers';
import Top_Header from './layout/FE/Header/Header';
import Home from './Components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layoutfontend from './layout/FE/layout';
import Login from './page/Login';
import Register from './page/Register';
import ProductDetail from './page/Product/ProductDetail';
import Cart from './page/Product/Cart';
import AllProduct from './page/Product/AllProduct';
import ProductByCategory from './page/Product/ProductByCategory';
import Pay from './page/Product/Pay';

//import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  return (


    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layoutfontend />}>
          <Route index element={<Home />} />
          <Route path="tableU" element={<TableUsers />} />
          <Route path="login" element={<Login />} />
          <Route path="dangki" element={<Register />} />
          <Route path="chi-tiet-san-pham/:id" element={<ProductDetail />} />
          <Route path="gio-hang" element={<Cart />} />
          <Route path="tat-ca-san-pham" element={<AllProduct />} />
          <Route path="san-pham-theo-loai/:id" element={<ProductByCategory />} />
          
        </Route>
        <Route path="thanh-toan" element={<Pay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
