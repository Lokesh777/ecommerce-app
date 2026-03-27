const BASE_URL = "https://fakestoreapi.com";

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
};

export const getProductById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  return res.json();
};

export const getProductsByCategory = async (category: string) => {
  const res = await fetch(`${BASE_URL}/products/category/${category}`);
  return res.json();
};