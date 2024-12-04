import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../apiService.js";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      toast.error("Đổi mật khẩu thất bại! Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-orange fw-bold mb-4">Đổi mật khẩu</h2>
      <Form onSubmit={handleChangePassword} className="mx-auto" style={{ maxWidth: "500px" }}>
        <Form.Group controlId="oldPassword" className="mb-3">
          <Form.Label>Mật khẩu cũ</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="newPassword" className="mb-3">
          <Form.Label>Mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-4">
          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
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
