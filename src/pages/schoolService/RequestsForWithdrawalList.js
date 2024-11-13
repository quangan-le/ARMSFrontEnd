import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Pagination, Row, Table, Modal } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestsForWithdrawalList = () => {
    const [requestWDs, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const [selectedStatus, setSelectedStatus] = useState("");
    const { selectedCampus } = useOutletContext();
    const campusId = selectedCampus.id;

    // Gọi API để lấy danh sách các request rút hồ sơ theo điều kiện tìm kiếm
    const fetchRequestChangeMajors = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/SchoolService/RequestWithDrawal/get-request-withdrawal`, {
                    params: {
                        CampusId: campusId,
                        Search: searchTerm,
                        CurrentPage: currentPage,
                        Status: selectedStatus || null,
                    },
                });
                setRequests(response.data.item);
                setTotalPages(response.data.pageCount);
                setTotalItems(response.data.totalItems);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách ngành học:", error);
        }
    };
    useEffect(() => {
        fetchRequestChangeMajors();
    }, [currentPage, campusId, selectedStatus, searchTerm]);

    const RequestStatus = {
        Pending: 2,
        Approved: 0,
        Rejected: 1,
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Gửi yêu cầu
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleShowModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedRequest(null);
        setShowModal(false);
        setFeedback("");
    };

    const handleConfirm = async () => {
        if (!selectedRequest) return;
    
        try {
            const response = await api.post(
                `/SchoolService/RequestWithDrawal/accept-request-withdrawal`,
                {
                    reply: feedback,
                    status: 0,
                },
                {
                    params: { RequestID: selectedRequest.requestID }, 
                }
            );
            toast.success(response.data.message);
        } catch (error) {
            console.error("Lỗi khi chấp nhận yêu cầu rút hồ sơ:", error);
            toast.error("Có lỗi xảy ra khi xử lý yêu cầu.");
        } finally {
            handleCloseModal();
        }
    };
    
    const handleReject = async () => {
        if (!selectedRequest) return;
    
        try {
            const response = await api.post(
                `/SchoolService/RequestWithDrawal/accept-request-withdrawal`,
                {
                    reply: feedback,
                    status: 1,
                },
                {
                    params: { RequestID: selectedRequest.requestID }, 
                }
            );
            toast.success(response.data.message);
        } catch (error) {
            console.error("Lỗi khi từ chối yêu cầu rút hồ sơ:", error);
            toast.error("Có lỗi xảy ra khi xử lý yêu cầu.");
        } finally {
            handleCloseModal();
        }
    };

    return (
        <div className="me-3">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center mb-4">Yêu cầu rút hồ sơ</h2>
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập nội dung tìm kiếm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="me-2"
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                    <Form.Select
                        aria-label="Chọn trạng thái"
                        value={selectedStatus !== null ? selectedStatus : ''}
                        onChange={({ target: { value } }) => {
                            setSelectedStatus(value === "" ? null : value);
                            setCurrentPage(1);
                        }}
                        className="me-2"
                        style={{ width: '200px' }}
                    >
                        <option value="">Tất cả</option>
                        <option value={RequestStatus.Approved}>Chấp nhận</option>
                        <option value={RequestStatus.Rejected}>Từ chối</option>
                        <option value={RequestStatus.Pending}>Đang xử lý</option>
                    </Form.Select>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã Sinh viên</th>
                        <th>Họ tên</th>
                        <th>Nội dung yêu cầu</th>
                        <th>Đơn yêu cầu</th>
                        <th>Phản hồi</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {requestWDs.map((request, index) => (
                        <tr key={request.id}>
                            <td>{index + 1}</td>
                            <td>{request.account.studentCode}</td>
                            <td>{request.account.fullname}</td>
                            <td>{request.description}</td>
                            <td>{request.fileReasonRequestChangeMajor}</td>
                            <td>{request.reply}</td>
                            <td style={{ color: request.status === 0 ? 'green' : request.status === 1 ? 'red' : request.status === 2 ? 'lightblue' : 'black' }}>
                                {
                                    request.status === 0 ? "Chấp Nhận" :
                                        request.status === 1 ? "Reject" :
                                            request.status === 2 ? "Đang Xử lý" : ""
                                }
                            </td>
                            <td >
                                <Button
                                    variant="orange"
                                    className="text-white"
                                    style={{ whiteSpace: 'nowrap' }}
                                    onClick={() => handleShowModal(request)}
                                >
                                    Xử lý đơn
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} yêu cầu
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
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Xử lý yêu cầu rút hồ sơ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <>
                            <p><strong>Họ tên:</strong> {selectedRequest.account.fullname}</p>
                            <p><strong>Mã sinh viên:</strong> {selectedRequest.account.studentCode}</p>
                            <p><strong>Nội dung yêu cầu:</strong> {selectedRequest.description}</p>
                            <p><strong>Đơn yêu cầu:</strong> {selectedRequest.fileReasonRequestChangeMajor}</p>

                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung phản hồi</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleReject}>
                        Từ chối
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RequestsForWithdrawalList;
