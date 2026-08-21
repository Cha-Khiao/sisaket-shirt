// BASE_API
const PRODUCTION_API = 'https://sisaket-shirt-api.onrender.com/api';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API;

export const API_ENDPOINTS = {
  // สินค้า
  PRODUCTS: `${BASE_URL}/products`,
  PRODUCT_STOCK: (id: string) => `${BASE_URL}/products/${id}/stock`,

  // ออร์เดอร์
  ORDERS: `${BASE_URL}/orders`,
  MY_ORDERS: `${BASE_URL}/orders/my-orders`,
  ORDER_DETAILS: (id: string) => `${BASE_URL}/orders/${id}`,

  // การชำระเงิน
  UPLOAD_SLIP: `${BASE_URL}/payment/upload-slip`,
  
  // ระบบสมาชิก
  LOGIN: `${BASE_URL}/auth/login`,
  PROFILE: `${BASE_URL}/auth/profile`,
  PROFILE_UPLOAD_IMAGE: `${BASE_URL}/auth/profile/upload-image`,
};

export default API_ENDPOINTS;