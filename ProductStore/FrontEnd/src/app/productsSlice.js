import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Async thunks for API calls (extract data từ response.data.data vì backend wrap response)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/products`);
      return response.data.data; // Extract array từ {code, status, data: array}
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/products`, productData);
      return response.data.data; // Extract product object từ response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE}/products/${id}`, productData); // Fix: Đổi put thành patch để khớp route backend
      return { ...response.data.data, _id: id }; // Extract và đảm bảo _id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      return id; // Return _id để filter
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  status: 'idle' // idle | loading | succeeded | failed
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.products = action.payload; // Giờ là array
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || 'Không thể tải sản phẩm';
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload); // Thêm product mới
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload || 'Lỗi thêm sản phẩm';
      })
      // Update - Sử dụng _id từ MongoDB
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload || 'Lỗi cập nhật sản phẩm';
      })
      // Delete - Sử dụng _id
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || 'Lỗi xóa sản phẩm';
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
