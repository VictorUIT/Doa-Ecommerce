import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  // Hook điều hướng giữa các trang
  const navigate = useNavigate();

  // Lấy dữ liệu giỏ hàng và hàm xóa sản phẩm từ CartContext
  const { cartItems, removeFromCart } = useCart();

  // Tính tổng tiền của toàn bộ giỏ hàng
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* TIÊU ĐỀ TRANG */}
      <Typography
        variant="h4"
        fontWeight="800"
        gutterBottom
        sx={{
          letterSpacing: "-0.5px",
          mb: 4,
          position: "relative",
          // Thanh gạch trang trí dưới tiêu đề
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 40,
            height: 4,
            borderRadius: 2,
          },
        }}
      >
        Giỏ hàng
      </Typography>

      {/* TRẠNG THÁI GIỎ HÀNG TRỐNG */}
      {cartItems.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 3,
            textAlign: "center",
            borderRadius: 4,
            // Tạo giao diện Empty State thân thiện hơn
            border: "1px dashed",
            borderColor: "divider", // Tạo viền nét đứt sang trọng tinh tế
            backgroundColor: "grey.50",
          }}
        >
          {/* Icon minh họa trạng thái giỏ hàng trống */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "primary.lighter", // Hoặc dùng "#e3f2fd" nếu chưa cấu hình theme
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              animation: "float 3s ease-in-out infinite", // Hiệu ứng nổi nhẹ (nếu có khai báo keyframes)
            }}
          >
            {/* Có thể thêm ShoppingCartIcon ở đây */}
          </Box>

          {/* Thông báo cho người dùng */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 1, color: "text.primary" }}
          >
            Giỏ hàng của bạn đang trống
          </Typography>

          {/* Nút bấm Kêu gọi quay lại mua sắm */}
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")} // Đường dẫn về trang chủ sản phẩm
            sx={{
              borderRadius: 2.5,
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none", // Giữ chữ hoa/thường tự nhiên
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              },
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Paper>
      ) : (
        <>
          {/* DANH SÁCH SẢN PHẨM TRONG GIỎ */}
          {cartItems.map((item) => (
            <Paper
              key={item.id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Ảnh sản phẩm */}
              <img src={item.image} alt={item.title} width="80" />
              {/* Thông tin sản phẩm */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography>{item.title}</Typography>
                {/* Giá sản phẩm */}
                <Typography color="primary">
                  {(item.price * 25000).toLocaleString()}đ
                </Typography>
                {/* Số lượng đã thêm vào giỏ */}
                <Typography>SL: {item.quantity}</Typography>
              </Box>
              {/* Nút xóa sản phẩm khỏi giỏ hàng */}
              <Button color="error" onClick={() => removeFromCart(item.id)}>
                Xóa
              </Button>
            </Paper>
          ))}
          {/* TỔNG TIỀN */}
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>
            Tổng tiền: {(total * 25000).toLocaleString()}đ
          </Typography>
          {/* NÚT THANH TOÁN */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate("/checkout")}
              disabled={cartItems.length === 0}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
              }}
            >
              Tiến hành thanh toán
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default CartPage;
