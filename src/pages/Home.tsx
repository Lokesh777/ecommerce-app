import { CSSProperties, useEffect, useState } from "react";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
} from "../services/api";
import Product, { ProductDetailsProps } from "../components/Card";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [products, setProduct] = useState<ProductDetailsProps[]>([]);
  const [allProductsCache, setAllProductsCache] = useState<
    ProductDetailsProps[] | null
  >(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = searchParams.getAll("category"); // multiple
  const sort = searchParams.get("sort") || "";
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState<string[]>([]);

  useEffect(() => {
    getCategories().then(setCategoryList);
  }, []);
  const categoriesKey = categories.join(",");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        let data: ProductDetailsProps[] = [];

        if (categories.length > 0) {
          const results = await Promise.all(
            categories.map((cat) => getProductsByCategory(cat)),
          );
          data = results.flat();
        } else {
          // ✅ cache usage
          if (allProductsCache) {
            data = allProductsCache;
          } else {
            data = await getProducts();
            setAllProductsCache(data);
          }
        }

        // ✅ sorting
        if (sort === "priceLow") {
          data.sort((a, b) => a.price - b.price);
        } else if (sort === "priceHigh") {
          data.sort((a, b) => b.price - a.price);
        } else if (sort === "ratingHigh") {
          data.sort((a, b) => b.rating.rate - a.rating.rate);
        } else if (sort === "ratingLow") {
          data.sort((a, b) => a.rating.rate - b.rating.rate);
        }

        if (isMounted) setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [categoriesKey, sort, ]);

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
        <option value="ratingHigh">Rating: High → Low</option>
        <option value="ratingLow">Rating: Low → High</option>
      </select>
    </div>
  </section>

  <section style={style.container}>
    {loading
      ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={style.skeleton} />
        ))
      : products.map((product) => (
          <article data-testid="product-item" key={product.id}>
            <Product {...product} />
          </article>
        ))}
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
    width:"100%",
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
};
