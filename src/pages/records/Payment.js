import React, { useState, useEffect } from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let isSubmitting = false; 

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Hàm chuyển đổi định dạng ngày của VNPAY thành ISO-8601
    function formatVNPayDate(vnpDate) {
        if (!vnpDate || vnpDate.length !== 14) return null;

        // Chuyển thành định dạng `YYYY-MM-DDTHH:MM:SS`
        const formattedDate = `${vnpDate.slice(0, 4)}-${vnpDate.slice(4, 6)}-${vnpDate.slice(6, 8)}T${vnpDate.slice(8, 10)}:${vnpDate.slice(10, 12)}:${vnpDate.slice(12, 14)}`;
        return formattedDate;
    }
    // Xử lý thanh toán
    useEffect(() => {
        // Lấy dữ liệu từ sessionStorage
        const storedFormData = JSON.parse(sessionStorage.getItem('formData') ?? 'null'); // Thông tin đăng ký
        const storedFormDataDone = JSON.parse(sessionStorage.getItem('data') ?? 'null'); // Hồ sơ nhập học

        if (!storedFormData && !storedFormDataDone) {
            navigate('/');
            return;
        }
        // Lấy dữ liệu trả về từ VNPAY trong query params
        const queryParams = new URLSearchParams(location.search);
        const payFeeAdmission = {
            txnRef: queryParams.get('vnp_TxnRef'),
            amount: queryParams.get('vnp_Amount'),
            bankCode: queryParams.get('vnp_BankCode'),
            bankTranNo: queryParams.get('vnp_BankTranNo'),
            cardType: queryParams.get('vnp_CardType'),
            orderInfo: queryParams.get('vnp_OrderInfo'),
            payDate: formatVNPayDate(queryParams.get('vnp_PayDate')), // Chuyển định dạng
            responseCode: queryParams.get('vnp_ResponseCode'),
            tmnCode: queryParams.get('vnp_TmnCode'),
            transactionNo: queryParams.get('vnp_TransactionNo'),
            transactionStatus: queryParams.get('vnp_TransactionStatus'),
            secureHash: queryParams.get('vnp_SecureHash'),
            isFeeRegister: true,
        };

        const baseFormData = storedFormData || storedFormDataDone;
        // Kết hợp dữ liệu baseFormData và payFeeAdmission
        const updatedFormData = {
            ...baseFormData,
            payFeeAdmission,
        };
        console.log(updatedFormData);
        let isSubmitting = false;

        // Submit
        const submitApplication = async () => {
            if (isSubmitting) return;
            isSubmitting = true;

            // Kiểm tra trạng thái thành công trước đó
            if (sessionStorage.getItem('admissionSuccess') || sessionStorage.getItem('doneSuccess')) {
                console.log("Đã gửi trước đó, không gửi lại.");
                return;
            }
            
            try {
                if (storedFormData) {
                    const response = await api.post('/RegisterAdmission/add-register-admission', updatedFormData);
                    // Lưu cờ vào sessionStorage để báo rằng đơn đã được nộp thành công
                    sessionStorage.setItem('admissionSuccess', 'true');
                    sessionStorage.removeItem('formData');

                } else if (storedFormDataDone) {
                    const response = await api.put('/RegisterAdmission/done-profile-admission', updatedFormData);
                    // Lưu cờ vào sessionStorage để báo rằng đơn đã được nộp thành công
                    sessionStorage.setItem('doneSuccess', 'true');
                    sessionStorage.removeItem('data');
                }
                navigate('/tra-cuu-ho-so');
            } catch (error) {
                console.error('Lỗi khi gửi đơn:', error);
                //toast.error('Gửi đơn thất bại, vui lòng thử lại!');
            } finally {
                isSubmitting = false; // Reset trạng thái
            }
        };

        // Chỉ gọi submitApplication nếu thanh toán thành công
        if (queryParams.get('vnp_ResponseCode') === '00') {
            submitApplication();
        } else {
            toast.error('Thanh toán không thành công. Vui lòng thử lại!');
            setTimeout(() => {
                navigate('/nop-ho-so'); 
            }, 3000); 
        }
    }, [location, navigate]);

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row>
                <Col className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <h5>Đang kiểm tra trạng thái thanh toán, vui lòng đợi...</h5>
                </Col>
            </Row>
            <ToastContainer position="top-right" autoClose={3000} />
        </Container>
    );
};

export default Payment;