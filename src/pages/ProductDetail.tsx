import React, { CSSProperties, useEffect, useState } from "react";
import { ProductDetailsProps } from "../components/Card";
import { getProductById } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useCart } from "../context/CartContext";

const MemoStarRating = React.memo(StarRating);

const ProductDetail = () => {
  const [product, setProduct] = useState<ProductDetailsProps>();
  const { id } = useParams<{ id: string }>();
  const { addToCart, cart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);

        if (isMounted) {
          setProduct(res);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false; // ✅ cleanup
    };
  }, [id]);

  if (!product) {
    return (
      <div style={style.loaderContainer}>
        <div style={style.loader}></div>
      </div>
    );
  }
  //container
  const { title, description, image, price, rating } = product;
  const isInCart = cart.some((item) => item.id === product.id);

  const reviewText =
    rating.count < 2 ? `${rating.count} Review` : `${rating.count} Reviews`;

  const buttonStyle = isInCart
    ? { ...style.button, ...style.buttonDisabled }
    : style.button;

  return (
    <div style={style.container}>
      <button
        style={style.backButton}
        onClick={() => navigate(-1) || navigate("/")}
      >
        ← Back
      </button>
      <h3 style={style.title}>{title}</h3>
      <img style={style.img} src={image} alt={title} loading="lazy" />
      <h3> ₹{price}</h3>
      <div style={style.rating}>
        <MemoStarRating rating={rating.rate} />
        <p style={style.review}>{reviewText}</p>
      </div>
      <p style={style.description}>{description}</p>
      <button
        style={{
          ...buttonStyle,
          transition: "transform 0.2s ease",
        }}
        disabled={isInCart}
        onClick={() => {
          addToCart(product);
          setShowToast(true);

          setTimeout(() => {
            setShowToast(false);
          }, 2000);
        }}
      >
        {isInCart ? "✓ Added" : "Add to Cart"}
      </button>
      {showToast && <div style={style.toast}>✅ Added to cart</div>}
    </div>
  );
};

export default ProductDetail;

const style: { [key: string]: CSSProperties } = {
  container: {
    padding: "10px 20px 40px 20px",
  },
  card: {
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
  },
  img: {
    width: "100%",
    height: "350px",
    objectFit: "contain",
    display: "block", //avoid the gaps
  },
  rating: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  review: {
    fontSize: "12px",
    color: "#c7c7c7",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  title: {
    fontSize: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  description: {},
  button: {
    padding: "10px 40px",
    cursor: "pointer",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
  buttonDisabled: {
    background: "#ccc", // grey
    color: "#666",
    cursor: "not-allowed", // 🚫 cursor
    opacity: 0.7,
  },
  backButton: {
    marginBottom: "10px",
    padding: "6px 12px",
    cursor: "pointer",
    background: "transparent",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  toast: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "black",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: 1000,
  },
  loaderContainer: {
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid #ccc",
    borderTop: "4px solid black",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
