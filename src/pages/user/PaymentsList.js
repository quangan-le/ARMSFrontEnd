import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import api from "../../apiService.js";

const PaymentsList = () => {
    const [search, setSearchTerm] = useState('');
    const [payments, setPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const { campusId } = useOutletContext();

   
    const fetchPayments = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/user/PayFee/get-payments`, {
                    params: {
                        CampusId: campusId,
                        Search: search,
                        CurrentPage: currentPage,
                    },
                });
                setPayments(response.data.item);
                setTotalPages(response.data.pageCount);
                setTotalItems(response.data.totalItems);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách thanh toán:", error);
        }
    };
    useEffect(() => {
        fetchPayments();
    }, [search, currentPage, campusId]);

    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách thanh toán hóa đơn</h2>
            <p className="text-center mb-4 text-orange fw-bold">Danh sách thanh toán hóa đơn tuyển sinh và nhập học</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập nội dung tìm kiếm"
                            value={search}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ tên học sinh</th>
                        <th>Mã hóa đơn</th>
                        <th>Nội dung thanh toán</th>
                        <th>Số tiền thanh toán</th>
                        <th>Hình thức</th>
                        <th>Ngân hàng</th>
                        <th>Ngày thanh toán</th>
                        <th>Trạng thái</th>
                        <th>Phân loại</th>
                    </tr>
                </thead>
                <tbody>
                    {payments && payments.length > 0 ? (
                        payments.map((payment, index) => (
                            <tr key={payment.spId}>
                                <td className="text-center fw-bold"> {index + 1}</td>
                                <td>
                                    <div className="d-flex align-items-center">

                                        <div className="ms-3">
                                            <span
                                                className="text-orange"
                                                style={{ cursor: "pointer" }}
                                            >
                                                {payment.fullname}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>{payment.spId}</td>
                                <td>{payment.orderInfo}</td>
                                <td>{(payment.amount / 100).toLocaleString()} VND</td>
                                <td>{payment.cardType}</td>
                                <td>{payment.bankCode}</td>
                                <td>
                                {new Intl.DateTimeFormat('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                }).format(new Date(payment.payDate))}
                                </td>
                                <td className={payment.transactionStatus==="00" ? 'text-success' : 'text-danger'}>
                                    {payment.transactionStatus ? 'Thành công' : 'Thất bại'}
                                </td>
                                <td>
                                    {payment.isFeeRegister ? 'Xét tuyển' : 'Nhập học'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">
                                Không có hóa đơn nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} hóa đơn
                </span>
                {totalPages > 1 && totalItems > 0 && (
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                )}


            </div>
        </Container>
    );
};

export default PaymentsList;
