import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct, clearError } from '../app/productsSlice';

function Products() {
  const dispatch = useDispatch();
  const { products, loading, error, status } = useSelector((state) => state.products);

  // Local state for UI (form, modal) - Redux chỉ quản lý data chính
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: ''  // Chỉ các fields required cho backend schema
  });

  // Fetch products on mount using Redux thunk
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Handle form input changes (local state)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form: Dispatch Redux actions - Chỉ gửi name/price/image (khớp schema)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update via Redux - Sử dụng _id, chỉ gửi fields cần (backend sẽ update partial)
        const updateData = {
          name: formData.name,
          price: formData.price,
          image: formData.image || editingProduct.image
        };
        await dispatch(updateProduct({ id: editingProduct._id, productData: updateData })).unwrap();
        console.log('Cập nhật sản phẩm qua Redux thành công!');
      } else {
        // Add via Redux - Validate required fields
        if (!formData.name || !formData.price || !formData.image) {
          alert('Vui lòng điền đầy đủ: name, price, image');
          return;
        }
        await dispatch(addProduct(formData)).unwrap();
        console.log('Thêm sản phẩm qua Redux thành công!');
      }
      // Reset local form
      setFormData({ name: '', price: '', image: '' });
      setShowForm(false);
      setEditingProduct(null);
      dispatch(clearError()); // Clear any previous errors
    } catch (err) {
      console.error('Lỗi submit qua Redux:', err);
      // Error đã được handle trong slice
    }
  };

  // Edit: Set local form from selected product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image || ''  // Giữ image hiện tại
    });
    setShowForm(true);
  };

  // Delete via Redux - Nhận _id
  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    dispatch(deleteProduct(id))  // id là _id
      .unwrap()
      .then(() => console.log('Xóa sản phẩm qua Redux thành công!'))
      .catch((err) => console.error('Lỗi xóa qua Redux:', err));
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', image: '' });
    dispatch(clearError());
  };

  // Manual refetch if needed
  const handleRetry = () => {
    dispatch(fetchProducts());
    dispatch(clearError());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error && status === 'failed') {
    return (
      <div className="alert alert-error mx-auto max-w-md mt-8">
        <span>{error}</span>
        <button onClick={handleRetry} className="btn btn-sm btn-outline ml-2">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Danh Sách Sản Phẩm (Redux Integrated)</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          {editingProduct ? 'Chỉnh Sửa' : 'Thêm Sản Phẩm'}
        </button>
      </div>

      <p className="mb-4 text-gray-600">
        Component sử dụng Redux: useSelector lấy products/loading/error từ store,
        useDispatch dispatch thunks cho API calls. Local state chỉ cho UI (form/modal).
        Học: Redux quản lý global data, tránh prop drilling. Form chỉ name/price/image (khớp schema backend).
      </p>

      {/* Form Modal - Fix: Remove description field hoàn toàn để clean */}
      {showForm && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tên sản phẩm</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Giá</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image URL</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Nhập URL hình ảnh (e.g., https://example.com/image.jpg)"
                  className="input input-bordered w-full"
                  required={!editingProduct}  // Required chỉ cho add, update optional
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Cập Nhật' : 'Thêm'}
                </button>
                <button type="button" onClick={handleCloseForm} className="btn">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Không có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card bg-base-100 shadow-xl">
              <figure><img src={product.image} alt={product.name} className="w-full h-48 object-cover" /></figure>  {/* Hiển thị image nếu có */}
              <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p className="text-lg font-semibold text-primary">${product.price}</p>
                <div className="card-actions justify-end space-x-2">
                  <button onClick={() => handleEdit(product)} className="btn btn-warning btn-sm">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="btn btn-error btn-sm">
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;

