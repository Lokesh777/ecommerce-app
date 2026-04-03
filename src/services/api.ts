const BASE_URL = "https://api.escuelajs.co/api/v1";

type EscuelaCategory = {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt?: string;
  updatedAt?: string;
};

type EscuelaProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: EscuelaCategory;
  images: string[];
};

type AppProduct = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  rating: { count: number; rate: number };
};

const toProductsQuery = (params: Record<string, string | number>) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    usp.set(k, String(v));
  });
  return usp.toString();
};

const toAppProduct = (p: EscuelaProduct): AppProduct => ({
  id: p.id,
  title: p.title,
  category: p.category?.name ?? p.category?.slug ?? "",
  description: p.description,
  image: p.images?.[0] ?? "",
  price: p.price,
  rating: { count: 0, rate: 0 },
});

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  const data: EscuelaProduct[] = await res.json();
  return data.map(toAppProduct);
};

export const getProductsPaginated = async (offset: number, limit: number) => {
  const qs = toProductsQuery({ offset, limit });
  const res = await fetch(`${BASE_URL}/products/?${qs}`);
  const data: EscuelaProduct[] = await res.json();
  return data.map(toAppProduct);
};

export const getProductById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  const data: EscuelaProduct = await res.json();
  return toAppProduct(data);
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  const data: EscuelaCategory[] = await res.json();
  return data.map((c) => c.slug);
};

export const getProductsByCategory = async (category: string) => {

  const isNumeric = /^\d+$/.test(category);
  const query = isNumeric
    ? `categoryId=${encodeURIComponent(category)}`
    : `categorySlug=${encodeURIComponent(category)}`;

  const res = await fetch(`${BASE_URL}/products/?${query}`);
  const data: EscuelaProduct[] = await res.json();
  return data.map(toAppProduct);
};

export const getProductsByCategoryPaginated = async (
  category: string,
  offset: number,
  limit: number,
) => {
  const isNumeric = /^\d+$/.test(category);
  const params: Record<string, string | number> = { offset, limit };
  if (isNumeric) {
    params.categoryId = category;
  } else {
    params.categorySlug = category;
  }
  const qs = toProductsQuery(params);

  const res = await fetch(`${BASE_URL}/products/?${qs}`);
  const data: EscuelaProduct[] = await res.json();
  return data.map(toAppProduct);
};