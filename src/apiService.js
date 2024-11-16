import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Lấy user từ localStorage
    const storedUser = localStorage.getItem('authenication');
    let user = null;

    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error('Lỗi khi phân tích JSON từ localStorage:', error);
      }
    }

    // Kiểm tra nếu có dữ liệu user và user có thuộc tính bear
    if (user && user.state && user.state.user && user.state.user.bear) {
      config.headers.Authorization = `Bearer ${user.state.user.bear}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
