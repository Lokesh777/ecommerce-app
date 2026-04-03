import { CSSProperties, useEffect, useState } from "react";
import {
  getCategories,
  getProductsPaginated,
  getProductsByCategoryPaginated,
} from "../services/api";
import Product, { ProductDetailsProps } from "../components/Card";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const PAGE_SIZE = 10;
  const [products, setProduct] = useState<ProductDetailsProps[]>([]);
  const [hasRating, setHasRating] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = searchParams.getAll("category"); // multiple
  const categoryKey = categories.slice().sort().join("|");
  const selectedCategories = categoryKey ? categoryKey.split("|") : [];
  // For simplicity (interview-friendly), if multiple categories are selected we use the first one.
  const activeCategory = selectedCategories[0] ?? null;
  const sort = searchParams.get("sort") || "";
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getCategories().then(setCategoryList);
  }, []);

  // Reset pagination when filters/sort change.
  useEffect(() => {
    setPage(1);
  }, [categoryKey, sort]);

  useEffect(() => {
    let isMounted = true;

    const sortProducts = (
      items: ProductDetailsProps[],
      computedHasRating: boolean,
    ) => {
      const sorted = [...items];
      if (sort === "priceLow") sorted.sort((a, b) => a.price - b.price);
      if (sort === "priceHigh") sorted.sort((a, b) => b.price - a.price);

      // Rating exists only if your backend provides it; EscuelaJS doesn't,
      // so these stay disabled by `hasRating`.
      if (sort === "ratingHigh" && computedHasRating) {
        sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      }
      if (sort === "ratingLow" && computedHasRating) {
        sorted.sort((a, b) => a.rating.rate - b.rating.rate);
      }
      return sorted;
    };

    const fetchProductsPage = async () => {
      setLoading(true);
      const offset = (page - 1) * PAGE_SIZE;

      try {
        const items =
          activeCategory === null
            ? await getProductsPaginated(offset, PAGE_SIZE)
            : await getProductsByCategoryPaginated(
                activeCategory,
                offset,
                PAGE_SIZE,
              );

        const computedHasRating = items.some(
          (p) => (p.rating?.count ?? 0) > 0 || (p.rating?.rate ?? 0) > 0,
        );

        const data = sortProducts(items, computedHasRating);

        if (isMounted) {
          setHasRating(computedHasRating);
          setProduct(data);
          setHasMore(items.length === PAGE_SIZE);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        if (isMounted) {
          setProduct([]);
          setHasMore(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductsPage();

    return () => {
      isMounted = false;
    };
  }, [categoryKey, sort, page, activeCategory]);

  const handleCategoryChange = (cat: string) => {
    let updated = [...categories];

    if (updated.includes(cat)) {
      updated = updated.filter((c) => c !== cat);
    } else {
      updated.push(cat);
    }

    setSearchParams({
      category: updated,
      sort,
    });
  };

  const handleSortChange = (value: string) => {
    if (
      (value === "ratingHigh" || value === "ratingLow") &&
      !hasRating
    ) {
      return;
    }
    setSearchParams({
      category: categories,
      sort: value,
    });
  };

  if (loading) {
    return (
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #eee",
          borderTop: "5px solid #1e293b",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "100px auto",
        }}
      />
    );
  }
  return (
    <section data-testid="product-card" style={style.body}>
      <header>
        <p></p>
      </header>

      <section style={style.filter}>
        {categoryList.map((cat) => (
          <label style={style.multifilter} key={cat}>
            <input
              type="checkbox"
              checked={categories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />
            {cat}
          </label>
        ))}
        <div>
          <label htmlFor="sort">Sort Products:</label>
          <select
            id="sort"
            style={style.dropDown}
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="ratingHigh" disabled={!hasRating}>
              Rating: High → Low
            </option>
            <option value="ratingLow" disabled={!hasRating}>
              Rating: Low → High
            </option>
          </select>
        </div>
      </section>

      <section style={style.container}>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <article data-testid="product-item" key={product.id}>
              <Product {...product} />
            </article>
          ))
        )}
      </section>

      <section style={style.pagination}>
        <button
          type="button"
          style={style.pageBtn}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          Prev
        </button>
        <span style={style.pageText}>Page {page}</span>
        <button
          type="button"
          style={style.pageBtn}
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore || loading}
        >
          Next
        </button>
      </section>
    </section>
  );
};
export default Home;

const style: { [key: string]: CSSProperties } = {
  body: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "100%",
  },
  filter: {
    position: "sticky",
    top: 50,
    zIndex: 10,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "10px",
    padding: "20px 16px 10px 16px",
    backgroundColor: "#ffffff",
  },

  container: {
    flex: 1,
    overflow: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    padding: "20px 16px 30px 16px",
    scrollBehavior: "smooth",
  },
  dropDown: {
    padding: "6px",
    borderRadius: "4px",
    minWidth: "120px", // ✅ prevents shrinking
  },
  multifilter: {
    // display:'flex',
    // alignItems:"center",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px 30px 16px",
  },
  pageBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
  },
  pageText: {
    fontWeight: 600,
  },
};
