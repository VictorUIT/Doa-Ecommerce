import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";

function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h1"
          fontWeight="bold"
          color="primary"
          sx={{ fontSize: { xs: "5rem", md: "8rem" } }}
        >
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Oops! Trang bạn yêu cầu không tồn tại.
        </Typography>
        <Typography variant="body1" color="text.disabled" sx={{ mb: 4 }}>
          Có vẻ như đường dẫn đã bị hỏng hoặc trang đã bị gỡ bỏ.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          sx={{ borderRadius: 2, px: 4 }}
        >
          Quay lại trang chủ
        </Button>
      </Box>
    </Container>
  );
}

export default NotFoundPage;
