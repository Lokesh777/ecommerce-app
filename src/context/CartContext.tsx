import React, { useContext, createContext, useState, useEffect } from "react";
import { Product } from "../types/product";
import { cartKey } from "../constant/loaclstorageKey";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity:(id:number, qty:number)=>void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ✅ load from localStorage initially
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(cartKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart]); // ✅ save on every update

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
  const clearCart = () => setCart([]);
  const updateQuantity = (id: number, qty: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
    )
  );
};
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
