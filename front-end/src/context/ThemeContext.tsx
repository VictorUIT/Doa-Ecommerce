// createContext: tạo vùng dữ liệu dùng chung
// useState: quản lý trạng thái Light/Dark Mode
// useMemo: tối ưu hiệu năng, tránh tạo lại object không cần thiết
import React, { createContext, useState, useEffect, useMemo } from "react";

// =====================================
// IMPORT MATERIAL UI
// =====================================

// ThemeProvider: cung cấp theme cho toàn bộ ứng dụng
// createTheme: tạo theme tùy chỉnh
import { ThemeProvider, createTheme } from "@mui/material/styles";

// CssBaseline: reset CSS mặc định của trình duyệt
import CssBaseline from "@mui/material/CssBaseline";

// =====================================
// TẠO CONTEXT CHO DARK/LIGHT MODE
// =====================================

// Các component khác có thể sử dụng:
// const { toggleColorMode } = useContext(ColorModeContext);
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

// =====================================
// THEME PROVIDER
// Bao bọc toàn bộ ứng dụng
// Quản lý chế độ Light / Dark
// =====================================

export const MyThemeProvider = ({ children }) => {
  // =====================================
  // STATE QUẢN LÝ CHẾ ĐỘ GIAO DIỆN
  // =====================================

  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  // =====================================
  // HÀM CHUYỂN ĐỔI LIGHT ↔ DARK MODE
  // useMemo giúp object không bị tạo lại
  // sau mỗi lần component render
  // =====================================

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );

  // =====================================
  // TẠO MUI THEME DỰA TRÊN MODE HIỆN TẠI
  // =====================================

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // Chuyển giữa light và dark
          mode,

          // Màu chính của ứng dụng
          primary: {
            main: "#3182ce",
          },
        },
      }),
    [mode],
  );

  // =====================================
  // CUNG CẤP:
  // 1. Context để toggle Light/Dark
  // 2. Theme MUI cho toàn bộ ứng dụng
  // =====================================

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {/* Reset CSS mặc định */}
        <CssBaseline />

        {/* Render toàn bộ App */}
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
