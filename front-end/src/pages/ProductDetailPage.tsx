// ===============================
// IMPORT THƯ VIỆN
// ===============================
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Skeleton,
  Paper,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext";
import api from "../api/apiClient";

function ProductDetailPage() {
  // Lấy id từ URL
  const { id } = useParams();
  // Điều hướng trang
  const navigate = useNavigate();

  // Lấy hàm thêm vào giỏ hàng từ CartContext
  const { addToCart } = useCart();

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {" "}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton
              variant="rectangular"
              height={450}
              sx={{ borderRadius: 3 }}
            />{" "}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton height={60} />
            <Skeleton width="40%" height={40} />
            <Skeleton width="30%" height={30} />

            <Skeleton sx={{ mt: 3 }} />
            <Skeleton />
            <Skeleton />
            <Skeleton width="80%" />

            <Skeleton
              variant="rectangular"
              width={180}
              height={50}
              sx={{ mt: 4, borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h3">😕</Typography>

        <Typography variant="h4">Không tìm thấy sản phẩm</Typography>

        <Typography color="text.secondary">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </Typography>

        <Button variant="contained" size="large" onClick={() => navigate("/")}>
          Quay về trang chủ
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Nút quay lại trang trước */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        Quay lại{" "}
      </Button>

      {/* Khung chứa thông tin sản phẩm */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        {/* CỘT ẢNH SẢN PHẨM */}
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: 3,
                p: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 450,
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.title}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Grid>

          {/* Danh mục sản phẩm */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip label={product.category} color="primary" sx={{ mb: 2 }} />
            {/* Tên sản phẩm */}
            <Typography variant="h4" fontWeight="700" gutterBottom>
              {product.title}
            </Typography>

            {/* Đánh giá */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Rating
                value={product.rating?.rate || 0}
                precision={0.5}
                readOnly
              />

              <Typography color="text.secondary">
                ({product.rating?.count || 0} đánh giá)
              </Typography>
            </Box>

            {/* Giá sản phẩm */}
            <Typography
              variant="h4"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              {(product.price * 25000).toLocaleString()} đ
            </Typography>

            {/* Mô tả sản phẩm */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              {product.description}
            </Typography>

            {/* Nút thêm giỏ hàng */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={() => addToCart(product)}
                sx={{
                  flex: 1,
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 600,
                }}
              >
                Thêm vào giỏ hàng
              </Button>
              {/* Nút Mua ngay */}
              <Button
                variant="outlined"
                onClick={() => {
                  addToCart(product);
                  navigate("/checkout");
                }}
                sx={{
                  flex: 1,
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                Mua ngay
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ProductDetailPage;
