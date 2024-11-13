import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Pagination, Row, Table, Modal } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestChangeMajorList = () => {
    const [requestMajors, setRequestMajors] = useState([]);
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

    // Gọi API để lấy danh sách các majors theo điều kiện tìm kiếm
    const fetchRequestChangeMajors = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/SchoolService/RequestChangeMajor/get-request-change-major`, {
                    params: {
                        CampusId: campusId,
                        Search: searchTerm,
                        CurrentPage: currentPage,
                        Status: selectedStatus || null,
                    },
                });
                setRequestMajors(response.data.item);
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
                `/SchoolService/RequestChangeMajor/accept-request-change-major`,
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
            console.error("Lỗi khi chấp nhận yêu cầu chuyển ngành:", error);
            toast.error("Có lỗi xảy ra khi xử lý yêu cầu.");
        } finally {
            handleCloseModal();
        }
    };


    const handleReject = async () => {
        if (!selectedRequest) return;
        try {
            const response = await api.post(
                `/SchoolService/RequestChangeMajor/accept-request-change-major`,
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
            console.error("Lỗi khi từ chối yêu cầu chuyển ngành:", error);
            toast.error("Có lỗi xảy ra khi xử lý yêu cầu.");
        } finally {
            handleCloseModal();
        }
    };

    return (
        <div className="me-3">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center mb-4">Yêu cầu chuyển ngành</h2>
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
                            setCurrentPage(1); // Reset to first page when filter changes
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
                        <th>Mã sinh viên</th>
                        <th>Họ tên</th>
                        <th>Tên ngành cũ</th>
                        <th>Tên ngành mới</th>
                        <th>Nội dung yêu cầu</th>
                        <th>Đơn yêu cầu</th>
                        <th>Phản hồi</th>
                        <th>Trạng thái</th>
                        <th>Xử lý yêu cầu</th>
                    </tr>
                </thead>
                <tbody>
                    {requestMajors && requestMajors.length > 0 ? (
                        requestMajors.map((requestMajor, index) => (
                            <tr key={requestMajor.requestID}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>
                                    <div className="d-flex align-items-center">

                                        <div className="ms-3">
                                            <span
                                                className="text-orange"
                                                style={{ cursor: "pointer" }}
                                            >
                                                {requestMajor.account.studentCode}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>{requestMajor.account.fullname}</td>
                                <td>{requestMajor.majorN.majorName}</td>
                                <td>{requestMajor.majorO.majorName}</td>
                                <td>{requestMajor.description}</td>
                                <td>{requestMajor.fileReasonRequestChangeMajor}</td>
                                <td></td>
                                <td style={{ color: requestMajor.status === 0 ? 'green' : requestMajor.status === 1 ? 'red' : requestMajor.status === 2 ? 'lightblue' : 'black' }}>
                                    {
                                        requestMajor.status === 0 ? "Chấp Nhận" :
                                            requestMajor.status === 1 ? "Reject" :
                                                requestMajor.status === 2 ? "Đang Xử lý" : ""
                                    }
                                </td>
                                <td>
                                    <Button
                                        variant="orange"
                                        className="text-white"
                                        style={{ whiteSpace: 'nowrap' }}
                                        onClick={() => handleShowModal(requestMajor)}
                                    >
                                        Xử lý đơn
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                Không có yêu cầu nào
                            </td>
                        </tr>
                    )}
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
                    <Modal.Title>Xử lý yêu cầu chuyển ngành</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <>
                            <p><strong>Họ tên:</strong> {selectedRequest.account.fullname}</p>
                            <p><strong>Mã sinh viên:</strong> {selectedRequest.account.studentCode}</p>
                            <p><strong>Ngành cũ:</strong> {selectedRequest.majorO.majorName}</p>
                            <p><strong>Ngành mới:</strong> {selectedRequest.majorN.majorName}</p>
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

export default RequestChangeMajorList;
