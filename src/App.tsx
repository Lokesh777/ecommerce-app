import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <div style={style.main}>
          <Suspense fallback={<div className="loader"></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

const style = {
  main: {
  },
};
