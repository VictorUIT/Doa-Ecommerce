import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  IconButton,
  Rating,
  Box,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, isFavorite, onToggleFavorite, onView }) {
  // Hook điều hướng sang trang chi tiết sản phẩm
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: "100%", // Giúp tất cả card có chiều cao bằng nhau
        height: "100%", // Chiếm trọn chiều cao của ô lưới Grid
        display: "flex",
        flexDirection: "column", // Sắp xếp các thành phần bên trong theo chiều dọc
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: 10 },
        minWidth: 0,
        overflow: "hidden", // 🌟 Ẩn mọi nội dung cố tình tràn ra ngoài và giúp bo góc tròn trịa hơn
      }}
    >
      {/* 1. ẢNH SẢN PHẨM */}
      <CardMedia
        component="img"
        height="200" // 🌟 Ép tất cả ảnh sản phẩm cao đúng 200px
        image={product.image}
        alt={product.name}
        sx={{
          objectFit: "contain",
          p: 2,
          backgroundColor: "#ffffff",
          boxSizing: "border-box",
        }}
      />

      {/* 2. THÔNG TIN SẢN PHẨM */}
      <CardContent
        sx={{
          flexGrow: 1, // Tự động chiếm phần không gian còn lại
          display: "flex",
          flexDirection: "column",
          gap: 1,
          justifyContent: "space-between",
          minWidth: 0,
          width: "100%",
        }}
      >
        {/* Tên sản phẩm (giới hạn tối đa 2 dòng) */}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          component="h2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2, // Tối đa 2 dòng, dài hơn tự động hiện dấu ...
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis", // 🌟 Tự động thêm dấu ba chấm (...) ở cuối
            whiteSpace: "normal", // 🌟 BẮT BUỘC: Ép chữ phải xuống dòng tự nhiên, không cho chạy 1 dòng
            wordBreak: "break-word",
            height: "3em", // Cố định chiều cao cho phần text tiêu đề
            lineHeight: "1.5em",
            mb: 1,
          }}
        >
          {product.name}
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
          <Rating value={product.rating?.rate || 0} precision={0.5} readOnly />

          <Typography color="text.secondary">
            ({product.rating?.count || 0} đánh giá)
          </Typography>
        </Box>

        {/* Giá sản phẩm và nút yêu thích */}
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Giá tiền */}
          <Typography variant="h6" color="primary" fontWeight="700">
            {product.price?.toLocaleString()} đ
          </Typography>

          {/* Nút yêu thích */}
          <IconButton onClick={onToggleFavorite} color="error" size="small">
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </CardContent>

      {/* 3. ACTION BUTTON */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button variant="outlined" fullWidth onClick={onView}>
          Xem nhanh
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate(`/product/${product.id}`)}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: "600" }}
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
