import { useCart } from "../context/CartContext";
import { CSSProperties, useState } from "react";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [removingItems, setRemovingItems] = useState<number[]>([]);

  const totalItems: number = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice: number = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    setIsProcessing(true); // ⏳ start loading

    setTimeout(() => {
      setIsProcessing(false);
      setShowToast(true);
      clearCart();

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }, 2000);
  };

  const handleRemove = (id: number) => {
    setRemovingItems((prev) => [...prev, id]);

    setTimeout(() => {
      removeFromCart(id);
      setRemovingItems((prev) => prev.filter((itemId) => itemId !== id));
    }, 300); // match the CSS transition duration
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p style={styles.empty}>Your cart is empty</p>
      ) : (
        <div style={styles.grid}>
          <div style={styles.items}>
            {cart.map((item) => {
              const isRemoving = removingItems.includes(item.id);
              return (
                <div key={item.id} style={cardStyle(isRemoving)}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={styles.image}
                    loading="lazy"
                  />
                  <div style={styles.info}>
                    <h4>{item.title}</h4>
                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <div style={styles.quantityContainer}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1 || isProcessing}
                    >
                      −
                    </button>
                    <span style={styles.qtyText}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isProcessing}
                    >
                      +
                    </button>
                  </div>
                  <button
                    aria-label="Remove item from cart"
                    style={styles.removeBtn}
                    onClick={() => handleRemove(item.id)}
                    disabled={isProcessing}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT */}
          <div style={styles.summary}>
            <h3>Order Summary</h3>
            <p>
              Total Items: <strong>{totalItems}</strong>
            </p>
            <p>
              Total Price: <strong>₹{totalPrice.toFixed(2)}</strong>
            </p>

            <button
              style={{
                ...styles.checkoutBtn,
                opacity: isProcessing ? 0.7 : 1,
                cursor: isProcessing ? "not-allowed" : "pointer",
              }}
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? <span>⏳ Processing...</span> : "Checkout"}
            </button>
          </div>
        </div>
      )}

      {/* ✅ Toast */}
      {showToast && (
        <div style={styles.toast}>
          ✅ Payment Successful! Order Confirmed 🎉
        </div>
      )}
    </div>
  );
};

export default Cart;

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
  },
  heading: {
    marginBottom: "20px",
  },
  empty: {
    textAlign: "center",
    fontSize: "18px",
  },
  grid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  items: {
    flex: "2",
    minWidth: "300px",
  },
  // card: {
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   padding: "10px",
  //   border: "1px solid #ddd",
  //   borderRadius: "10px",
  //   marginBottom: "10px",
  //   background: "#fff",
  //   position:"relative",
  // },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
  },
  info: {
    flex: "1",
    marginLeft: "10px",
  },
  removeBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    position: "absolute",
    top: 10,
    right: 10,
  },
  summary: {
    flex: "1",
    minWidth: "250px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fafafa",
    height: "fit-content",
  },
  checkoutBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#333",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
  },
  quantityContainer: {
    display: "flex",
    alignItems: "end",
    gap: "6px",
    marginTop: "5px",

  },
  qtyBtn: {
    padding: "2px 6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
    minWidth: "28px",
  },
  qtyText: {
    minWidth: "20px",
    textAlign: "center",
    display: "inline-block",
  },
};

const cardStyle = (isRemoving: boolean): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginBottom: "10px",
  background: "#fff",
  transition: "all 0.3s ease",
  transform: isRemoving ? "scale(0.9)" : "scale(1)",
  opacity: isRemoving ? 0 : 1,
  position: "relative", // ✅ cast ensures TypeScript accepts it
});
