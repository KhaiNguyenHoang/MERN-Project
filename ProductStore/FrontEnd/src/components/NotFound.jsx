import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div>
          <h1 className="text-5xl font-bold">404 - Trang Không Tìm Thấy</h1>
          <p className="py-6">Xin lỗi, trang bạn đang tìm không tồn tại.</p>
          <Link to="/" className="btn btn-primary">Về Trang Chủ</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

