import React, { CSSProperties, lazy } from "react";
import { Link } from "react-router-dom";

const StarRating = lazy(() => import("./StarRating"));

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

    const cardImageSrc = image?.startsWith("http")
      ? image
      : `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_300/${image}`;

    const fallbackImageSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="22">No Image</text></svg>`,
    )}`;

    const reviewText =
      rating.count < 2 ? `${rating.count} Review` : `${rating.count} Reviews`;
    return (
      <article style={style.card}>
        <Link to={`/product/${id}`} style={style.link}>
          <img
            src={cardImageSrc}
            alt={title}
            loading="lazy"
            decoding="async"
            width="200"
            height="150"
            onError={(e) => {
              // Avoid re-requesting the same broken URL endlessly.
              (e.currentTarget as HTMLImageElement).src = fallbackImageSrc;
            }}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "contain",
              display: "block",
            }}
          />
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
