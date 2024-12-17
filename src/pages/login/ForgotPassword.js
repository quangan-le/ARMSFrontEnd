import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import api from "../../apiService";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState(""); // Mới
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [showResendOtp, setShowResendOtp] = useState(false);
    const [timer, setTimer] = useState(10);
    const navigate = useNavigate();

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setShowResendOtp(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await api.post("/Authentication/send-OTP", { email });
            toast.success(response.data.message || "OTP đã được gửi tới email của bạn!");
            setStep(2);
            setTimer(60);
            setShowResendOtp(false);
        } catch (error) {
            toast.error("Không thể gửi OTP. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        try {
            const response = await api.post(
                `/Authentication/verify-OTP?email=${email}&otp=${otp}`
            );
            const token = response.data.token;
            localStorage.setItem("resetToken", token);
            toast.success("OTP xác thực thành công!");
            setStep(3);
        } catch (error) {
            toast.error("OTP không hợp lệ hoặc đã hết hạn!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (newPassword !== confirmNewPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("resetToken");
            if (!token) {
                toast.error("Không tìm thấy token xác thực. Vui lòng thử lại từ đầu!");
                return;
            }

            const response = await api.post(
                "/Authentication/forgot-password",
                { email, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status) {
                toast.success(response.data.message || "Đặt lại mật khẩu thành công!");
                setTimeout(() => navigate("/dang-nhap"), 2000); // Quay về Login sau 2 giây
            } else {
                toast.error(response.data.message || "Đặt lại mật khẩu không thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
    
            // Kiểm tra lỗi có từ API không
            if (error.response) {
                if (error.response.status === 400 && Array.isArray(error.response.data)) {
                    error.response.data.forEach((err) => {
                        if (err.description) {
                            toast.error(err.description); // Hiển thị lỗi cụ thể từ API
                        } else {
                            toast.error("Đặt lại mật khẩu thất bại!");
                        }
                    });
                } else {
                    // Lỗi khác từ server
                    toast.error("Đặt lại mật khẩu thất bại! Vui lòng thử lại.");
                }
            } else {
                // Lỗi kết nối hoặc lỗi khác không phải từ API
                toast.error("Có lỗi xảy ra. Vui lòng kiểm tra kết nối và thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold mb-4">Quên mật khẩu</h2>
            {step === 1 && (
                <Form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button
                        variant="orange"
                        type="submit"
                        className="w-100 bg-orange text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang gửi..." : "Gửi OTP"}
                    </Button>
                </Form>
            )}

            {step === 2 && (
                <Form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nhập OTP</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button
                        variant="orange"
                        type="submit"
                        className="w-100 bg-orange text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xác thực..." : "Xác nhận OTP"}
                    </Button>

                    {showResendOtp ? (
                        <Button
                            variant="link"
                            className="mt-3"
                            onClick={handleSendOtp}
                        >
                            Gửi lại OTP
                        </Button>
                    ) : (
                        <p className="text-center mt-3 text-muted">
                            Gửi lại OTP sau {timer} giây
                        </p>
                    )}
                </Form>
            )}

            {step === 3 && (
                <Form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                    <Form.Group className="mb-3 position-relative">
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

                    <Form.Group className="mb-3 position-relative">
                        <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                        <Form.Control
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            style={{
                                position: "absolute",
                                top: "70%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                            }}
                        >
                            {showConfirmNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </span>
                    </Form.Group>

                    <Button
                        variant="orange"
                        type="submit"
                        className="w-100 bg-orange text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default ForgotPassword;
