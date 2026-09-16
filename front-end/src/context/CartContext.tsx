// createContext: tạo vùng dữ liệu dùng chung
// useContext: lấy dữ liệu từ Context
// useState: quản lý state
// useEffect: xử lý side effect (lưu LocalStorage)
import { createContext, useContext, useState, useEffect } from "react";

// =====================================
// TẠO CART CONTEXT
// =====================================

const CartContext = createContext();

// =====================================
// CART PROVIDER
// Bao bọc toàn bộ ứng dụng để mọi component
// đều có thể truy cập dữ liệu giỏ hàng
// =====================================

export function CartProvider({ children }) {
  // =====================================
  // KHỞI TẠO GIỎ HÀNG TỪ LOCAL STORAGE
  // =====================================

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // =====================================
  // TỰ ĐỘNG LƯU GIỎ HÀNG MỖI KHI THAY ĐỔI
  // =====================================

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // =====================================
  // THÊM SẢN PHẨM VÀO GIỎ HÀNG
  // Nếu sản phẩm đã tồn tại:
  // -> tăng số lượng lên 1
  // Nếu chưa tồn tại:
  // -> thêm mới vào giỏ hàng
  // =====================================

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);

      // Sản phẩm đã có trong giỏ
      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      // Sản phẩm chưa có trong giỏ
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =====================================
  // XÓA SẢN PHẨM KHỎI GIỎ HÀNG
  // =====================================

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // =====================================
  // CẬP NHẬT SỐ LƯỢNG SẢN PHẨM
  // =====================================

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  // =====================================
  // XÓA TOÀN BỘ GIỎ HÀNG
  // =====================================

  const clearCart = () => {
    setCartItems([]);
  };

  // =====================================
  // GIÁ TRỊ ĐƯỢC CHIA SẺ CHO TOÀN APP
  // =====================================

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// =====================================
// CUSTOM HOOK
// Giúp gọi useCart() thay vì:
// useContext(CartContext)
// =====================================

export function useCart() {
  return useContext(CartContext);
}
