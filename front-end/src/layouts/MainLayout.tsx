import { useState, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  IconButton,
  useTheme,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Brightness4, Brightness7, ShoppingCart } from "@mui/icons-material";
import { ColorModeContext } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import SearchBar from "../components/SearchBar";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";

function MainLayout() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Kiểm tra xem có đang ở chế độ Light Mode không
  const isLight = theme.palette.mode === "light";

  // 🌟 Kiểm tra xem người dùng đã đăng nhập chưa bằng cách tìm token
  const isLoggedIn = !!localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Xóa token khi bấm đăng xuất
    navigate("/login");
    window.location.reload();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* AppBar với màu xanh #0d75e5 ở Light Mode */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: isLight ? "#0d75e5" : "#1e1e1e",
          backgroundImage: "none",
          borderBottom: (theme) =>
            `1px solid ${isLight ? "transparent" : theme.palette.divider}`,
          boxShadow: isLight ? "0px 2px 4px rgba(0,0,0,0.1)" : "none",
          color: isLight ? "#fff" : "text.primary",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* 1. KHỐI BÊN TRÁI: Logo (Chiếm 1 phần diện tích) */}
            <Box
              sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}
            >
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  whiteSpace: "nowrap", // Không cho chữ nhảy dòng
                }}
              >
                🛒 DOA SHOP
              </Typography>
            </Box>

            {/* 2. KHỐI CHÍNH GIỮA: SearchBar (Chiếm diện tích lớn hơn và căn giữa tuyệt đối) */}
            <Box sx={{ flex: 2, display: "flex", justifyContent: "center" }}>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </Box>

            {/* 3. KHỐI BÊN PHẢI: Actions (Chiếm 1 phần diện tích - đối xứng với Logo) */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              {/* Icon Giỏ hàng */}
              <IconButton onClick={() => navigate("/cart")}>
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* Icon Chế độ trang */}
              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === "dark" ? (
                  <Brightness7 />
                ) : (
                  <Brightness4 />
                )}
              </IconButton>
              {isLoggedIn ? (
                // 🌟 Nếu ĐÃ đăng nhập: Hiện nút Đăng xuất
                <Button
                  color="#ffff"
                  variant="outlined"
                  size="small"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              ) : (
                // 🌟 Nếu CHƯA đăng nhập: Hiện nút Đăng nhập
                <Button
                  color="#ffff"
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* BODY (Nội dung trang web thay đổi bên trong) */}

      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet context={{ searchTerm, setSearchTerm }} />
      </Container>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2026 DOA Tech Shop. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default MainLayout;
