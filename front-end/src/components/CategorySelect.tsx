import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// 🌟 Component nhận vào 2 props: value (giá trị hiện tại) và onChange (hàm cập nhật)
function CategorySelect({ value, onChange }) {
  return (
    <FormControl sx={{ minWidth: 150 }} size="medium">
      <InputLabel id="category-select-label">Danh mục</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={value}
        label="Danh mục"
        onChange={onChange} // Kích hoạt hàm thay đổi khi người dùng chọn item
      >
        <MenuItem value="all">Tất cả danh mục</MenuItem>
        <MenuItem value="electronics">Điện tử</MenuItem>
        <MenuItem value="jewelery">Trang sức</MenuItem>
        <MenuItem value="men's clothing">Thời trang nam</MenuItem>
        <MenuItem value="women's clothing">Thời trang nữ</MenuItem>
        <MenuItem value="laptops">Laptop</MenuItem>
        <MenuItem value="smartphones">Điện thoại</MenuItem>
        <MenuItem value="audio">Âm thanh</MenuItem>
        <MenuItem value="computer accessories">Phụ kiện máy tính</MenuItem>
        <MenuItem value="cameras">Máy ảnh</MenuItem>
        <MenuItem value="smart home">Nhà thông minh</MenuItem>
        <MenuItem value="wearables">Thiết bị đeo</MenuItem>
        <MenuItem value="networking">Thiết bị mạng</MenuItem>
        <MenuItem value="gaming">Gaming</MenuItem>
        <MenuItem value="power and charging">Sạc và nguồn</MenuItem>
      </Select>
    </FormControl>
  );
}

export default CategorySelect;
