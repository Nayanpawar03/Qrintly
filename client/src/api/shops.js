import API from "./axios";

export const createShop = (data) => API.post('/shops', data);
export const getMyShop = (data) => API.get('/shops/me');
export const getShopByShopId = (shopId) => API.get(`/shops/${shopId}`);