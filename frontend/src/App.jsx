import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/user";

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verify();
  }, [checkAuth]);
  
  if (isChecking) {
    return <Box textAlign="center" py={10}>Đang kiểm tra...</Box>; // hoặc loading spinner
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        {/* Navbar chỉ hiển thị khi login nhé cá doi */}
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearch={setSearchKeyword} />
                  <HomePage searchKeyword={searchKeyword} />
                </>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearch={setSearchKeyword} />
                  <CreatePage />
                </>
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Redirect về login nếu không tìm được route phù hợp nè */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;