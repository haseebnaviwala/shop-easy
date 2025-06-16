import axios from 'axios';

const API_BASE = 'https://684ff4fee7c42cfd1796bd1d.mockapi.io'; // replace with your actual MockAPI URL

export const fetchProducts = () => axios.get(`${API_BASE}/products`);
export const fetchProductById = (id) => axios.get(`${API_BASE}/products/${id}`);
export const fetchReviewsByProductId = (productId) =>
  axios.get(`${API_BASE}/reviews?productId=${productId}`);
export const postReview = (reviewData) =>
  axios.post(`${API_BASE}/reviews`, reviewData);
