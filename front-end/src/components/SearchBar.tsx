import React from "react";
// 🌟 Đảm bảo đã import đúng TextField và InputAdornment từ MUI
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Tìm sản phẩm, thương hiệu..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      // 🌟 GIẢI PHÁP: Sử dụng slotProps thay cho InputProps cũ để tránh lỗi React
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
  );
};

export default SearchBar;
