import { CSSProperties } from "react";
interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const maxStars = 5;
  const safeRating = Math.min(rating, maxStars);

  const percentage = (safeRating / maxStars) * 100;

  return (
    <div style={styles.wrapper}>
      <div style={styles.back}>★★★★★</div>
      <div style={{ ...styles.front, width: `${percentage}%` }}>
        ★★★★★
      </div>
    </div>
  );
};

export default StarRating;

const styles: { [key: string]: CSSProperties } = {
  wrapper: {
    position: "relative",
    display: "inline-block",
    fontSize: "20px",
    lineHeight: "1",
  },
  back: {
    color: "#ccc", // empty stars
  },
  front: {
    color: "#f5a623", // filled stars 
    position: "absolute",
    top: 0,
    left: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
};