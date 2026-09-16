import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { toast } from "react-toastify";
import { checkoutSchema } from "./CheckoutSchema";
import { useCart } from "../../context/CartContext";

function CheckoutPage() {
  const navigate = useNavigate();

  const { cartItems, clearCart } = useCart();

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Load danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/v2/p");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProvinces();
  }, []);

  // Chọn tỉnh => tải phường/xã
  const handleProvinceChange = async (event) => {
    const provinceCode = event.target.value;
    setSelectedProvince(provinceCode);
    setSelectedWard("");
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`,
      );
      const data = await response.json();
      setWards(data.wards || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Tổng tiền
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    mode: "onBlur",
  });

  // Submit đơn hàng
  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const provinceName =
      provinces.find((item) => item.code === Number(selectedProvince))?.name ||
      "";
    const wardName =
      wards.find((item) => item.code === Number(selectedWard))?.name || "";
    const fullAddress = `${data.address}, ${wardName}, ${provinceName}`;
    console.log({
      customer: { ...data, fullAddress },
      products: cartItems,
      total: totalPrice,
    });
    clearCart();
    toast.success("🎉 Đặt hàng thành công!");
    navigate("/");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {" "}
      {/* Header */}{" "}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
        {" "}
        <LocalShippingIcon color="primary" fontSize="large" />{" "}
        <Typography variant="h4" fontWeight="700">
          {" "}
          Thanh toán{" "}
        </Typography>{" "}
      </Box>{" "}
      <Grid container spacing={4}>
        {" "}
        {/* FORM */}{" "}
        <Grid size={{ xs: 12, md: 8 }}>
          {" "}
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            {" "}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {" "}
              Thông tin giao hàng{" "}
            </Typography>{" "}
            <form onSubmit={handleSubmit(onSubmit)}>
              {" "}
              <Grid container spacing={3}>
                {" "}
                {/* Họ tên */}{" "}
                <Grid size={{ xs: 12 }}>
                  {" "}
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />{" "}
                </Grid>{" "}
                {/* Email */}{" "}
                <Grid size={{ xs: 12, md: 6 }}>
                  {" "}
                  <TextField
                    fullWidth
                    label="Email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />{" "}
                </Grid>{" "}
                {/* SĐT */}{" "}
                <Grid size={{ xs: 12, md: 6 }}>
                  {" "}
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    {...register("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />{" "}
                </Grid>{" "}
                {/* Tỉnh */}{" "}
                <Grid size={{ xs: 12, md: 6 }}>
                  {" "}
                  <TextField
                    select
                    fullWidth
                    label="Tỉnh / Thành phố"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                  >
                    {" "}
                    {provinces.map((province) => (
                      <MenuItem key={province.code} value={province.code}>
                        {" "}
                        {province.name}{" "}
                      </MenuItem>
                    ))}{" "}
                  </TextField>{" "}
                </Grid>{" "}
                {/* Phường */}{" "}
                <Grid size={{ xs: 12, md: 6 }}>
                  {" "}
                  <TextField
                    select
                    fullWidth
                    label="Phường / Xã"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    {" "}
                    {wards.map((ward) => (
                      <MenuItem key={ward.code} value={ward.code}>
                        {" "}
                        {ward.name}{" "}
                      </MenuItem>
                    ))}{" "}
                  </TextField>{" "}
                </Grid>{" "}
                {/* Địa chỉ */}{" "}
                <Grid size={{ xs: 12 }}>
                  {" "}
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Số nhà, tên đường"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />{" "}
                </Grid>{" "}
                {/* Submit */}{" "}
                <Grid size={{ xs: 12 }}>
                  {" "}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ py: 1.8, borderRadius: 3, fontWeight: "bold" }}
                  >
                    {" "}
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Đặt hàng"
                    )}{" "}
                  </Button>{" "}
                </Grid>{" "}
              </Grid>{" "}
            </form>{" "}
          </Paper>{" "}
        </Grid>{" "}
        {/* ORDER SUMMARY */}{" "}
        <Grid size={{ xs: 12, md: 4 }}>
          {" "}
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 4, position: "sticky", top: 100 }}
          >
            {" "}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {" "}
              Đơn hàng của bạn{" "}
            </Typography>{" "}
            <Divider sx={{ mb: 2 }} />{" "}
            {cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  position: "relative",
                }}
              >
                {/* Ảnh sản phẩm */}
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: 70,
                    height: 70,
                    objectFit: "contain",
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    p: 1,
                  }}
                />

                {/* Thông tin */}
                <Box
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.4,
                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    x{item.quantity}
                  </Typography>
                </Box>

                {/* Giá */}
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {(item.price * item.quantity * 25000).toLocaleString()}đ
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />{" "}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {" "}
              <Typography variant="h6" fontWeight="bold">
                {" "}
                Tổng cộng{" "}
              </Typography>{" "}
              <Typography variant="h6" fontWeight="bold" color="primary">
                {" "}
                {(totalPrice * 25000).toLocaleString()} đ{" "}
              </Typography>{" "}
            </Box>{" "}
          </Paper>{" "}
        </Grid>{" "}
      </Grid>{" "}
    </Container>
  );
}
export default CheckoutPage;
