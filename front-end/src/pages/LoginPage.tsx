import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🌟 Gọi API đăng nhập của Fake Store API
      const { data } = await api.post("/auth/login", {
        username,
        password,
      });

      // 🌟 Đăng nhập thành công: Lưu token vào localStorage
      localStorage.setItem("userToken", data.token);

      // Chuyển hướng người dùng về trang chủ
      navigate("/");
      // F5 nhẹ để cập nhật lại trạng thái Navbar (nếu cần)
      window.location.reload();
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Card
        raised
        sx={{
          borderRadius: 4,
          p: 2,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              ĐĂNG NHẬP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng đăng nhập để trải nghiệm mua sắm
            </Typography>
          </Box>

          {/* Hiển thị thông báo lỗi nếu có */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Tên đăng nhập (Username)"
              name="username"
              autoComplete="username"
              autoFocus
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: 50,
                fontWeight: "bold",
                py: 1.2,
                boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
            </Button>
          </Box>

          {/* Khung gợi ý tài khoản test để bạn dễ bấm */}
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: "grey.100",
              borderRadius: 2,
              border: "1px dashed #ccc",
            }}
          >
            <Typography
              variant="caption"
              display="block"
              fontWeight="bold"
              color="text.secondary"
              gutterBottom
            >
              💡 Tài khoản test:
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              • <b>Username:</b> mor_2314
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              • <b>Password:</b> 83r5^_
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginPage;
