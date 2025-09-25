import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./components/Products";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
              <div>
                <h1 className="text-5xl font-bold">Chào mừng đến Product Store</h1>
                <p className="py-6">Đây là ứng dụng React kết nối với backend ExpressJS để quản lý sản phẩm. Hãy thử truy cập /products để xem danh sách.</p>
                <a href="/products" className="btn btn-primary">Xem Sản Phẩm</a>
              </div>
            </div>
          </div>} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
