import './App.scss';
import Users from './Components/Users';
import TableUsers from './Components/TableUsers';
import Top_Header from './layout/FE/Header/Header';
import Home from './Components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layoutfontend from './layout/FE/layout';
import Login from './page/Login';
import Register from './page/Register';
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
