import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../apiService.js";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    // Kiểm tra mật khẩu mới và mật khẩu cũ giống nhau
    if (oldPassword === newPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu cũ!");
      return;
    }
  
    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
  
    // Kiểm tra mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await api.post("/Authentication/change-password", {
        oldPassword,
        newPassword,
      });
  
      // Kiểm tra `status` từ API
      if (response.data.status) {
        // Hiển thị thông báo thành công
        toast.success(response.data.message || "Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Hiển thị thông báo thất bại nếu `status` là false
        toast.error(response.data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
  
      if (error.response && error.response.status === 400 && Array.isArray(error.response.data)) {
        // Hiển thị lỗi cụ thể từ API
        error.response.data.forEach((err) => {
          if (err.description) {
            toast.error(err.description);
          } else {
            toast.error("Đổi mật khẩu thất bại!");
          }
        });
      } else {
        // Hiển thị lỗi chung nếu không có thông tin từ API
        toast.error("Đổi mật khẩu thất bại! Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-orange fw-bold mb-4">Đổi mật khẩu</h2>
      <Form onSubmit={handleChangePassword} className="mx-auto" style={{ maxWidth: "500px" }}>
        {/* Old Password */}
        <Form.Group controlId="oldPassword" className="mb-3 position-relative">
          <Form.Label>Mật khẩu cũ</Form.Label>
          <Form.Control
            type={showOldPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowOldPassword(!showOldPassword)}
            style={{
              position: "absolute",
              top: "70%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showOldPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </span>
        </Form.Group>

        {/* New Password */}
        <Form.Group controlId="newPassword" className="mb-3 position-relative">
          <Form.Label>Mật khẩu mới</Form.Label>
          <Form.Control
            type={showNewPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            style={{
              position: "absolute",
              top: "70%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </span>
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group controlId="confirmPassword" className="mb-4 position-relative">
          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              top: "70%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </span>
        </Form.Group>

        <Button
          variant="orange"
          type="submit"
          className="w-100 bg-orange text-white"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePassword;
