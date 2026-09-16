import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import api from "../api/apiClient";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import CategorySelect from "../components/CategorySelect";
import QuickViewModal from "../components/QuickViewModal";
import ProductSkeleton from "../components/SkeletonCard";
import PromoPopup from "../components/PromoPopup";

function HomePage() {
  const { searchTerm } = useOutletContext();
  const [category, setCategory] = useState("all");

  // 🌟 State quản lý danh sách sản phẩm từ API và trạng thái Loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("default");

  // 🌟 Gọi API lấy dữ liệu khi trang web được nạp
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products");

        // 🌟 KỸ THUẬT CHUYỂN ĐỔI DỮ LIỆU: Ép dữ liệu API
        const mappedProducts = data.map((item) => ({
          id: item.id,
          name: item.title, // API dùng title -> chuyển thành name
          price: item.price * 25000, // API dùng USD -> đổi sang VND để bộ lọc giá chạy đúng
          image: item.image,
          desc: item.description, // API dùng description -> chuyển thành desc
          category: item.category,
          rating: item.rating,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Lỗi khi gọi API sản phẩm:", error);
      } finally {
        setLoading(false); // Tắt hiệu ứng loading dù thành công hay thất bại
      }
    };

    fetchProducts();
  }, []);

  const handleToggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  // 1. Logic lọc theo từ khóa
  let updatedProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 2. Logic lọc theo danh mục
  updatedProducts = updatedProducts.filter((item) => {
    // Nếu chọn "Tất cả danh mục" thì cho qua hết, ngược lại thì phải trùng khớp danh mục
    return category === "all" || item.category === category;
  });

  // 3. Logic lọc theo giá (Giữ nguyên vì đã quy đổi sang VND ở trên)
  updatedProducts = updatedProducts.filter((item) => {
    if (priceRange === "all") return true;
    if (priceRange === "under10") return item.price < 10000000;
    if (priceRange === "10to20")
      return item.price >= 10000000 && item.price <= 20000000;
    if (priceRange === "over20") return item.price > 20000000;
    return true;
  });

  // 4. Logic sắp xếp
  if (sort === "priceAsc") {
    updatedProducts = [...updatedProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "priceDesc") {
    updatedProducts = [...updatedProducts].sort((a, b) => b.price - a.price);
  } else if (sort === "nameAz") {
    updatedProducts = [...updatedProducts].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* BANNER */}
      <Box
        sx={{
          // Tạo dải màu chuyển sắc mượt mà từ Xanh sang Tím giống ảnh mẫu
          background:
            "linear-gradient(90deg, #0d8bf2 0%, #7b4bf7 50%, #9c66ff 100%)",
          borderRadius: "24px", // Bo góc tròn sâu cực kỳ hiện đại
          p: { xs: 3, sm: 4 }, // Padding tự co giãn theo màn hình điện thoại/máy tính
          color: "white",
          mb: 4, // Khoảng cách vừa vặn từ banner xuống thanh bộ lọc bên dưới
          position: "relative",
          overflow: "hidden", // Giữ cho vòng tròn trang trí không bị tràn ra ngoài
          boxShadow: "0px 6px 20px rgba(13, 139, 242, 0.15)", // Đổ bóng nhẹ cho banner nổi bật
        }}
      >
        {/* Tiêu đề chính */}
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.8rem", sm: "2.4rem" } }}
        >
          SIÊU SALE THÁNG 7
        </Typography>

        {/* Phụ đề */}
        <Typography
          variant="body2"
          sx={{ mt: 1, opacity: 0.85, fontSize: { xs: "0.85rem", sm: "1rem" } }}
        >
          Premium gadgets and tech accessories for developers
        </Typography>

        {/* 🌟 Vòng tròn trang trí mờ ở góc phải */}
        <Box
          sx={{
            position: "absolute",
            right: "-30px",
            top: "-30px",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
          }}
        />
      </Box>
      {/* Thanh tiêu đề & bộ lọc */}
      <Grid container spacing={3} sx={{ mb: 4, alignItems: "center" }}>
        <Grid xs={12} md={6}>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{ letterSpacing: "-1px" }}
          >
            Thông tin sản phẩm
          </Typography>
          {searchTerm && (
            <Typography variant="body1" color="text.secondary">
              Kết quả tìm kiếm cho: <strong>"{searchTerm}"</strong> (
              {updatedProducts.length} sản phẩm)
            </Typography>
          )}
        </Grid>
        <Grid
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
          {/* 1. TRƯỜNG DANH MỤC */}
          <CategorySelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Grid>
        <Grid
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
          {/* 2. TRƯỜNG KHOẢNG GIÁ & SẮP XẾP */}
          <FilterBar
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            sort={sort}
            onSortChange={setSort}
          />
        </Grid>
      </Grid>

      {/* 🌟 HIỂN THỊ TRẠNG THÁI LOADING TRONG KHI CHỜ API */}
      {loading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
            gap: 3,
          }}
        >
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </Box>
      ) : (
        /* Lưới danh sách sản phẩm */
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          {updatedProducts.map((productItem) => (
            <Grid
              key={productItem.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(33.333% - 16px)",
                  lg: "calc(25% - 18px)",
                },
                display: "flex",
                minWidth: 0,
              }}
            >
              <ProductCard
                product={productItem}
                isFavorite={favoriteIds.includes(productItem.id)}
                onToggleFavorite={() => handleToggleFavorite(productItem.id)}
                onView={() => setSelectedProduct(productItem)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <PromoPopup />

      {/* Modal xem nhanh */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </Container>
  );
}

export default HomePage;
