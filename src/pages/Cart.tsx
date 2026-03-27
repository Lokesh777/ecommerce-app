import { useCart } from "../context/CartContext";
import { useState } from "react";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 

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

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p style={styles.empty}>Your cart is empty</p>
      ) : (
        <div style={styles.grid}>
          {/* LEFT */}
          <div style={styles.items}>
            {cart.map((item) => (
              <div key={item.id} style={styles.card}>
                <img src={item.image} alt={item.title} style={styles.image} loading="lazy" />

                <div style={styles.info}>
                  <h4>{item.title}</h4>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <button
                  style={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                  disabled={isProcessing}
                >
                  ✕
                </button>
              </div>
            ))}
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

const styles: any = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
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
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "#fff",
  },
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
};
