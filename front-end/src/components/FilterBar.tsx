import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const FilterBar = ({ priceRange, onPriceChange, sort, onSortChange }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {/* Lọc theo giá */}
      <FormControl sx={{ minWidth: 150 }} size="medium">
        <InputLabel id="price-label">Khoảng giá</InputLabel>
        <Select
          labelId="price-label"
          value={priceRange}
          label="Khoảng giá"
          onChange={(e) => onPriceChange(e.target.value)}
        >
          <MenuItem value="all">Tất cả giá</MenuItem>
          <MenuItem value="under10">Dưới 10 triệu</MenuItem>
          <MenuItem value="10to20">10 - 20 triệu</MenuItem>
          <MenuItem value="over20">Trên 20 triệu</MenuItem>
        </Select>
      </FormControl>

      {/* Sắp xếp */}
      <FormControl sx={{ minWidth: 150 }} size="medium">
        <InputLabel id="sort-label">Sắp xếp theo</InputLabel>
        <Select
          labelId="sort-label"
          value={sort}
          label="Sắp xếp theo"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <MenuItem value="default">Mặc định</MenuItem>
          <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
          <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
          <MenuItem value="nameAz">Tên A-Z</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;
