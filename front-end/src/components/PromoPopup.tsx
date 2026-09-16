import { useState, useEffect } from "react";
import { Dialog, Box, IconButton, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 🌟 Kiểm tra xem trong phiên làm việc này người dùng đã tắt popup chưa
    const hasSeenPopup = sessionStorage.getItem("hasSeenPromoPopup");

    if (!hasSeenPopup) {
      // 🌟 Tạo độ trễ 1.5 giây sau khi trang tải xong thì mới hiện popup
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // 🌟 Lưu vào sessionStorage để lần sau không hiện lại nữa
    sessionStorage.setItem("hasSeenPromoPopup", "true");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      scroll="body"
      slotProps={{
        paper: {
          sx: {
            overflow: "visible",
            borderRadius: 4,
            background: "linear-gradient(135deg, #ff9800 0%, #ff3d00 100%)",
            boxShadow: "0 10px 30px rgba(0,0,0,.3)",
            p: 0,
          },
        },
      }}
    >
      {/* 🌟 Nút Đóng (Dấu X) hình tròn viền trắng sang xịn mịn ở góc trên bên phải */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: -45,
          right: 0,
          color: "#ffffff",
          border: "2px solid #ffffff",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Nội dung thiết kế Banner quảng cáo (Nếu bạn có ảnh thiết kế sẵn thì thay bằng thẻ <img> nhé) */}
      <Box
        sx={{
          p: 4,
          pt: 5,
          textAlign: "center",
          color: "#ffffff",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "rgba(255,255,255,0.2)",
            px: 2,
            py: 0.5,
            borderRadius: 5,
            mb: 2,
          }}
        >
          <LocalFireDepartmentIcon sx={{ color: "#ffeb3b" }} />
          <Typography
            variant="caption"
            fontWeight="bold"
            sx={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            Sale Cuối Tháng
          </Typography>
        </Box>

        <Typography
          variant="h3"
          fontWeight="900"
          sx={{
            lineHeight: 1.1,
            mb: 1,
            textShadow: "2px 4px 0px rgba(0,0,0,0.15)",
            letterSpacing: "-1px",
            color: "#ff0000",
          }}
        >
          XẢ LÁNG <br /> SĂN DEAL
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#ffeb3b", fontWeight: "bold", mb: 4 }}
        >
          ⚡ Flash Sale vào lúc 09:00 mỗi ngày ⚡
        </Typography>

        <Box
          sx={{
            bgcolor: "#ffffff",
            color: "text.primary",
            p: 2,
            borderRadius: 3,
            mb: 4,
            boxShadow: "inset 0px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            Giảm trực tiếp đến{" "}
            <Box
              component="span"
              sx={{ color: "#ff3d00", fontWeight: "bold", fontSize: "1.1rem" }}
            >
              50%
            </Box>{" "}
            + Trả góp{" "}
            <Box component="span" sx={{ color: "#ff3d00", fontWeight: "bold" }}>
              0%
            </Box>
          </Typography>
        </Box>

        {/* 🌟 Nút "MUA NGAY" hình viên thuốc, đổ bóng nổi khối bo tròn */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleClose}
          sx={{
            background: "linear-gradient(90deg, #ffeb3b 0%, #ffc107 100%)",
            color: "#b71c1c",
            fontWeight: "900",
            fontSize: "1.1rem",
            py: 1.5,
            borderRadius: 50,
            boxShadow: "0px 6px 20px rgba(255, 235, 59, 0.4)",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(90deg, #fff176 0%, #ffd54f 100%)",
              boxShadow: "0px 8px 24px rgba(255, 235, 59, 0.6)",
            },
          }}
        >
          MUA NGAY
        </Button>
      </Box>
    </Dialog>
  );
}

export default PromoPopup;
