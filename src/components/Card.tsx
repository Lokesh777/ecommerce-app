import React, { CSSProperties } from "react";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";

export interface ProductDetailsProps {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  rating: {
    count: number;
    rate: number;
  };
}

const MemoStarRating = React.memo(StarRating);

const Product: React.FC<ProductDetailsProps> = React.memo(
  ({ title, image, price, rating, id }) => {
    // { title, category, description, image, price, rating, id }

    const reviewText =
      rating.count < 2 ? `${rating.count} Review` : `${rating.count} Reviews`;

    return (
      <article style={style.card}>
        <Link to={`/product/${id}`} style={style.link}>
          <img style={style.img} src={image} alt={title} loading="lazy" />
          <h3> ₹{price}</h3>

          <div style={style.rating}>
            <MemoStarRating rating={rating.rate} />
            <p style={style.review}>{reviewText}</p>
          </div>

          <h3 style={style.title}>{title}</h3>
        </Link>
      </article>
    );
  },
);

export default Product;

const style: { [key: string]: CSSProperties } = {
  card: {
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    height: "100%",
    boxSizing: "border-box",
  },
  img: {
    width: "100%",
    height: "150px",
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
    fontSize: "14px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
};
