import React, { CSSProperties, useEffect, useState } from "react";
import { ProductDetailsProps } from "../components/Card";
import { getProductById } from "../services/api";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useCart } from "../context/CartContext";

const MemoStarRating = React.memo(StarRating);

const ProductDetail = () => {
  const [product, setProduct] = useState<ProductDetailsProps>();
  const { id } = useParams<{ id: string }>();
  const { addToCart, cart } = useCart();

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
    return <p>Loading...</p>;
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
      <h3 style={style.title}>{title}</h3>
      <img style={style.img} src={image} alt={title} loading="lazy" />
      <h3>${price}</h3>
      <div style={style.rating}>
        <MemoStarRating rating={rating.rate} />
        <p style={style.review}>{reviewText}</p>
      </div>
      <p style={style.description}>{description}</p>
      <button
        style={buttonStyle}
        disabled={isInCart}
        onClick={() => addToCart(product)}
      >
        {isInCart ? "✓ Added" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductDetail;

const style: { [key: string]: CSSProperties } = {
  container: {
    padding: "10px 15px 40px 15px",
  },
  card: {
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    height: "100%",
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
  background: "#ccc",        // grey
  color: "#666",
  cursor: "not-allowed",     // 🚫 cursor
  opacity: 0.7,
},
};
