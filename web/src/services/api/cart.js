import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const addToCart = async (userId, productId, quantity = 1) => {
  const { data } = await axios.post(`${API_URL}/cart`, {
    user_id: userId,
    product_id: productId,
    quantity,
  });
  return data;
};

export const getCart = async (userId) => {
  const { data } = await axios.get(`${API_URL}/cart`, {
    params: { user_id: userId },
  });
  return data;
};
