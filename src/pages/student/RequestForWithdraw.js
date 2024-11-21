import React, { useState, useEffect, useCallback } from 'react';
import { Container, Breadcrumb, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import api from "../../apiService.js";
import uploadImage from '../../firebase/uploadImage.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Download } from 'react-bootstrap-icons';

const RequestForWithdraw = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [studentData, setStudentData] = useState(null);
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await api.get("/Profile/get-profile");
                const data = response.data;
                setStudentData(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sinh viên: ", error);
            }
        };

        fetchStudentData();
    }, []);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/RequestWithDrawal/get-request-with-drawal");
            setRequests(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách yêu cầu rút hồ sơ:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Hàm xử lý trạng thái hiển thị
    const renderStatus = (status) => {
        switch (status) {
            case 0:
                return <span style={{ color: "green" }}>Đã chấp nhận</span>;
            case 1:
                return <span style={{ color: "red" }}>Đã từ chối</span>;
            case 2:
                return <span style={{ color: "orange" }}>Đang xử lý</span>;
            default:
                return <span style={{ color: "gray" }}>Không xác định</span>;
        }
    };

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const [formData, setFormData] = useState({
        description: '',
        fileReasonRequestChangeMajor: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, fileReasonRequestChangeMajor: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const uploadedFileUrl = await uploadImage(formData.fileReasonRequestChangeMajor, "RequestChangeMajor");
            const data = {
                description: formData.description,
                fileReasonRequestChangeMajor: uploadedFileUrl,
            };
            const response = await api.post("/RequestWithDrawal/add-request-change-major", data);
            if (response.status === 200) {
                toast.success("Đã gửi đơn rút hồ sơ nhập học thành công!");
                await fetchRequests();
                handleClose();
            }
        } catch (error) {
            console.error("Lỗi khi gửi đơn rút hồ sơ:", error);
            alert("Đã xảy ra lỗi khi gửi đơn. Vui lòng thử lại.");
        }
    };

    // Chi tiết
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handleShowDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailModal(false);
        setSelectedRequest(null);
    };

    return (
        <Container className='mt-5'>
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="page-title text-center" style={{ color: 'orange' }}>Yêu cầu rút hồ sơ nhập học</h1>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Yêu cầu rút hồ sơ</Breadcrumb.Item>
            </Breadcrumb>
            <div className="text-end mb-3">
                <Button variant="warning" onClick={handleShow}>
                    Tạo đơn
                </Button>
            </div>
            {loading ? (
                <div>Đang tải dữ liệu...</div>
            ) : (
                <Table striped bordered hover className='mb-5'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Lý do</th>
                            <th>Đơn rút hồ sơ</th>
                            <th>Thời gian tạo đơn</th>
                            <th>Trạng thái đơn</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={request.requestID}>
                                <td>{index + 1}</td>
                                <td>{request.description}</td>
                                <td>
                                    <a href={request.fileReasonRequestChangeMajor} target="_blank" rel="noopener noreferrer">
                                        Tải file
                                    </a>
                                </td>
                                <td>{new Date(request.dateRequest).toLocaleDateString()}</td>
                                <td>{renderStatus(request.status)}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleShowDetails(request)}>
                                        Chi tiết
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
             <Modal show={showDetailModal} onHide={handleCloseDetails} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center" style={{ color: 'orange' }}>
                        Chi tiết yêu cầu rút hồ sơ nhập học
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest ? (
                        <div>
                            <Row className="mb-3">
                                <Col md={4}><strong>Ngày yêu cầu</strong></Col>
                                <Col md={8}>{new Date(selectedRequest.dateRequest).toLocaleDateString()}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>File</strong></Col>
                                <Col md={8}>
                                    <a href={selectedRequest.fileReasonRequestChangeMajor} target="_blank" rel="noopener noreferrer">
                                        Xem file
                                    </a>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Trạng thái</strong></Col>
                                <Col md={8}>{renderStatus(selectedRequest.status)}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Lý do</strong></Col>
                                <Col md={8}>{selectedRequest.description}</Col>
                            </Row>
                            {selectedRequest.reply && (
                                <Row className="mb-3">
                                    <Col md={4}><strong>Phản hồi</strong></Col>
                                    <Col md={8}>{selectedRequest.reply}</Col>
                                </Row>
                            )}
                        </div>
                    ) : (
                        <div>Không tìm thấy thông tin chi tiết.</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetails}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center" style={{ color: 'orange' }}>Tạo đơn rút hồ sơ nhập học</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {studentData ? (
                        <>
                            <Row className="mb-3">
                                <Col md={3}>
                                    <Form.Label>Họ và tên</Form.Label>
                                </Col>
                                <Col md={9}>
                                    <div>{studentData.fullname}</div>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3}>
                                    <Form.Label>Ngành học</Form.Label>
                                </Col>
                                <Col md={9}>
                                    <div>{studentData.majorName}</div>
                                </Col>
                            </Row>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-2">
                                    <Col md={3}>
                                        <Form.Label>Đơn xin rút hồ sơ</Form.Label>
                                    </Col>
                                    <Col md={9}>
                                        <Form.Control
                                            type="file"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={{ span: 9, offset: 3 }} className='d-flex'>
                                        <a href="/RequestWithDrawal.docx" download className="d-flex align-items-center text-primary">
                                            Mẫu đơn rút hồ sơ
                                            <Download className="ms-2" />
                                        </a>
                                    </Col>
                                </Row>
                                <Row className="mb-1">
                                    <Col md={3}>
                                        <Form.Label>Lý do rút hồ sơ</Form.Label>
                                    </Col>
                                    <Col md={9}>
                                        <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} placeholder="Nhập lý do" required />
                                    </Col>
                                </Row>
                                <Form.Group as={Row} className="mb-3 text-center">
                                    <Col md={12}>
                                        <Button variant="warning" type="submit" className="mt-3">
                                            Gửi đơn
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Form> </>
                    ) : (
                        <div>Không có dữ liệu sinh viên.</div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};
export default RequestForWithdraw;

