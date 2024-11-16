import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/dang-nhap"); 
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>403 - Không có quyền truy cập</h1>
      <p style={styles.message}>Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên hoặc đăng nhập lại.</p>
      <button onClick={handleRedirect} style={styles.button}>Quay lại trang đăng nhập</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#f8f9fa",
    height: "100vh",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#dc3545",
  },
  message: {
    fontSize: "18px",
    color: "#6c757d",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default UnauthorizedPage;
