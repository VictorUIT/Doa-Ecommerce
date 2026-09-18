import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Button,
  Rating,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "../context/CartContext";

function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  // open = true nếu có product, ngược lại là false
  const isOpen = Boolean(product);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md" // Chiều rộng tối đa
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }, // Bo góc khung Modal
      }}
    >
      {/* Nút đóng (X) ở góc trên bên phải */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ mt: 2 }}>
        {product && (
          <Grid container spacing={4}>
            {/* Ảnh bên trái */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  bgcolor: "#fafafa",
                  borderRadius: 3,
                  p: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 420,
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>

            {/* Thông tin bên phải */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ py: 2 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
                >
                  <Rating
                    value={product.rating.rate || 0}
                    precision={0.1}
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({product.rating.rate})
                  </Typography>
                </Box>

                <Typography
                  variant="h5"
                  color="error"
                  fontWeight="700"
                  gutterBottom
                >
                  {product.price.toLocaleString("vi-VN")}đ
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" color="text.secondary" paragraph>
                  {product.description}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 4, color: "text.disabled" }}
                >
                  ID: {product.id}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button variant="outlined" fullWidth onClick={onClose}>
                    Đóng
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default QuickViewModal;
