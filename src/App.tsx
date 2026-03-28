import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CSSProperties, lazy, Suspense } from "react";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />

        <main style={style.main}>
          <Suspense fallback={<div className="loader"></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

const style: { [key: string]: CSSProperties } = {
  main: {
    marginTop: "60px",
  },
};
