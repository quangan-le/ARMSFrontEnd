import React, { useState, useEffect, useCallback } from 'react';
import { Container, Breadcrumb, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import api from "../../apiService.js";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadImage from '../../firebase/uploadImage.js';
import { Download } from 'react-bootstrap-icons';

const RequestForTransfer = () => {
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

    // Lấy ngành học
    const [vocationalMajors, setVocationalMajors] = useState([]);
    const [collegeMajors, setCollegeMajors] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (studentData && studentData.campusId) {
                try {
                    // Gọi API với campusId lấy được
                    const [vocationalResponse, collegeResponse] = await Promise.all([
                        api.get(`/Major/get-majors-vocational-school?campus=${studentData.campusId}`),
                        api.get(`/Major/get-majors-college?campus=${studentData.campusId}`),
                    ]);

                    // Cập nhật state
                    setVocationalMajors(vocationalResponse.data);
                    setCollegeMajors(collegeResponse.data);
                } catch (error) {
                    console.error("Có lỗi khi lấy dữ liệu:", error);
                }
            } else {
                console.warn("Không tìm thấy campusId trong localStorage");
            }
        };
        fetchData();
    }, [studentData]);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/Student/RequestChangeMajor/get-request-change-major");
            setRequests(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách yêu cầu chuyển ngành:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Dùng useEffect để gọi khi component load lần đầu
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

    const [show, setShow] = useState(false); // Quản lý trạng thái hiển thị modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [formData, setFormData] = useState({
        majorNew: "",
        description: "",
        fileReasonRequestChangeMajor: null,
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
        if (formData.majorNew === studentData.majorID) {
            toast.error("Ngành học mới không được trùng với ngành hiện tại!");
            return;
        }
        try {
            const uploadedFileUrl = await uploadImage(formData.fileReasonRequestChangeMajor, "RequestChangeMajor");
            const payload = {
                majorNew: formData.majorNew,
                description: formData.description,
                fileReasonRequestChangeMajor: uploadedFileUrl,
            };
            console.log(payload);
            const response = await api.post("/Student/RequestChangeMajor/add-request-change-major", payload);
            if (response.status === 200) {
                toast.success("Đã gửi đơn chuyển ngành thành công!");
                await fetchRequests();
                handleClose();
            }
        } catch (error) {
            console.error("Lỗi khi gửi đơn chuyển ngành:", error);
            toast.error("Đã xảy ra lỗi khi gửi đơn. Vui lòng thử lại.");
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
        <Container className='my-5'>
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Yêu cầu chuyển ngành</h1>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Yêu cầu chuyển ngành</Breadcrumb.Item>
            </Breadcrumb>
            <div className="text-end mb-3">
                <Button variant="warning" onClick={handleShow}>
                    Tạo đơn
                </Button>
            </div>
            {loading ? (
                <div>Đang tải dữ liệu...</div>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Ngành cũ</th>
                            <th>Ngành mới</th>
                            <th>Thời gian tạo đơn</th>
                            <th>File</th>
                            <th>Trạng thái đơn</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={request.requestID}>
                                <td>{index + 1}</td>
                                <td>{request.majorO.majorName}</td>
                                <td>{request.majorN.majorName}</td>
                                <td>{new Date(request.dateRequest).toLocaleDateString()}</td>
                                <td>
                                    <a href={request.fileReasonRequestChangeMajor} target="_blank" rel="noopener noreferrer">
                                        Tải file
                                    </a>
                                </td>
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
                        Chi tiết yêu cầu chuyển ngành
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest ? (
                        <div>
                            <Row className="mb-3">
                                <Col md={4}><strong>Ngành cũ</strong></Col>
                                <Col md={8}>{selectedRequest.majorO.majorName}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Ngành mới</strong></Col>
                                <Col md={8}>{selectedRequest.majorN.majorName}</Col>
                            </Row>
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
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center" style={{ color: 'orange' }}>
                        Tạo đơn chuyển ngành
                    </Modal.Title>
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
                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Label>Ngành học mới</Form.Label>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Select
                                                name="majorNew"
                                                value={formData.majorNew}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Chọn ngành mới</option>
                                                {collegeMajors.length > 0 && (
                                                    <optgroup label="Ngành học Cao đẳng">
                                                        {collegeMajors.map((major) => (
                                                            <option key={major.majorID} value={major.majorID}>
                                                                {major.majorName}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}

                                                {vocationalMajors.length > 0 && (
                                                    <optgroup label="Ngành học Trung cấp">
                                                        {vocationalMajors.map((major) => (
                                                            <option key={major.majorID} value={major.majorID}>
                                                                {major.majorName}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col md={3}>
                                        <Form.Label>Đơn xin chuyển ngành</Form.Label>
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
                                        <a href="/ChangeMajorForm.docx" download className="d-flex align-items-center text-primary">
                                            Mẫu đơn chuyển ngành
                                            <Download className="ms-2" />
                                        </a>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Label>Lý do</Form.Label>
                                    </Col>
                                    <Col md={9}>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                <Form.Group as={Row} className="mb-2 text-center">
                                    <Col md={12}>
                                        <Button variant="warning" type="submit" >
                                            Gửi đơn
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </>
                    ) : (
                        <div>Không có dữ liệu sinh viên.</div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default RequestForTransfer;