import { CSSProperties, useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/api";
import Product, { ProductDetailsProps } from "../components/Card";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [products, setProduct] = useState<ProductDetailsProps[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = searchParams.getAll("category"); // multiple
  const sort = searchParams.get("sort") || "";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      try {
        const res = await getProducts();
        if (isMounted) {
          setProduct(res);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    return () => {
      isMounted = false; // ✅ cleanup
    };
  }, []);

  const filterProducts = useMemo(() => {
    let temp = [...products];
    // ✅ Multiple filter
    if (categories.length > 0) {
      temp = temp.filter((p) => categories.includes(p.category));
    }
    if (sort === "priceLow") {
      temp.sort((a, b) => a.price - b.price);
    }

    if (sort === "priceHigh") {
      temp.sort((a, b) => b.price - a.price);
    }

    if (sort === "ratingHigh") {
      temp.sort((a, b) => b?.rating.rate - a?.rating.rate);
    }

    if (sort === "ratingLow") {
      temp.sort((a, b) => a?.rating.rate - b?.rating.rate);
    }

    return temp;
  }, [sort, categories, products]);

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
     <div style={{
      width: "50px",
      height: "50px",
      border: "5px solid #eee",
      borderTop: "5px solid #1e293b",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "100px auto"
    }} />
    );
  }
  return (
    <div style={style.body}>
      <p></p>
      <div style={style.filter}>
        {["electronics", "jewelery", "men's clothing", "women's clothing"].map(
          (cat) => (
            <label style={style.multifilter} key={cat}>
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ),
        )}
        <select
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

      <div style={style.container}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: "200px",
                  background: "#eee",
                  borderRadius: "8px",
                }}
              />
            ))
          : filterProducts.map((product) => (
              <Product key={product.id} {...product} />
            ))}
      </div>
    </div>
  );
};
export default Home;

const style: { [key: string]: CSSProperties } = {
  body: {
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  filter: {
    position: "sticky",
    top: 0,
    background: "white",
    zIndex: 10,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "10px",
    padding: "10px 16px",
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
