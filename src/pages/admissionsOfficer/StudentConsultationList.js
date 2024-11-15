import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Pagination, Row, Table, Modal } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentConsultationList = () => {
    const [studentConsultation, setStudentConsultation] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const [selectedType, setSelectedType] = useState("");
    const { selectedCampus } = useOutletContext();
    const campusId = selectedCampus.id;

    // Major data
    const [vocationalMajors, setVocationalMajors] = useState([]);
    const [collegeMajors, setCollegeMajors] = useState([]);

    // Modal state
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [consultationDetails, setConsultationDetails] = useState({});

    const fetchStudentConsultations = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/admin-officer/StudentConsultation/get-list-student-consultation`, {
                    params: {
                        CampusId: campusId,
                        Search: searchTerm,
                        CurrentPage: currentPage,
                        Status: selectedType || null,
                    },
                });
                setStudentConsultation(response.data.item);
                setTotalPages(response.data.pageCount);
                setTotalItems(response.data.totalItems);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách tư vấn tuyển sinh:", error);
        }
    };

    // Fetch vocational and college majors on campus selection
    useEffect(() => {
        const fetchData = async () => {
            if (campusId) {
                try {
                    const [vocationalResponse, collegeResponse] = await Promise.all([
                        api.get(`/Major/get-majors-vocational-school?campus=${campusId}`),
                        api.get(`/Major/get-majors-college?campus=${campusId}`),
                    ]);

                    setVocationalMajors(vocationalResponse.data);
                    setCollegeMajors(collegeResponse.data);
                } catch (error) {
                    console.error("Có lỗi khi lấy dữ liệu ngành:", error);
                }
            }
        };
        fetchData();
    }, [campusId]);

    useEffect(() => {
        fetchStudentConsultations();
    }, [currentPage, campusId, selectedType, searchTerm]);

    const handleShowDetailModal = (consultation) => {
        setSelectedConsultation(consultation);
        setConsultationDetails({
            ...consultation,
            dateReceive: consultation.dateReceive ? new Date(consultation.dateReceive).toISOString().split("T")[0] : ""
        });
        setShowDetailModal(true);
    };

    const handleShowEditModal = () => {
        setShowDetailModal(false);
        setShowEditModal(true);
    };

    const handleCloseModals = () => {
        setShowDetailModal(false);
        setShowEditModal(false);
        setSelectedConsultation(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConsultationDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await api.put(`/admin-officer/StudentConsultation/update-student-consultation`, {
                ...consultationDetails,
                studentConsultationId: selectedConsultation.studentConsultationId,
                campusId: campusId
            });
            toast.success("Thông tin tư vấn tuyển sinh đã được cập nhật thành công!");
            fetchStudentConsultations();
            handleCloseModals();
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật thông tin:", error);
            toast.error("Cập nhật không thành công, vui lòng thử lại.");
        }
    };

    return (
        <div className="me-3">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center mb-4">Danh sách đăng ký tư vấn tuyển sinh</h2>
            {/* Search and Filter */}
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Form.Group className="me-2 d-flex align-items-center">
                        <Form.Label className="mb-0 me-2">Tìm kiếm:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập nội dung tìm kiếm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                    <Form.Select
                        aria-label="Chọn loại"
                        value={selectedType !== null ? selectedType : ''}
                        onChange={({ target: { value } }) => {
                            setSelectedType(value === "" ? null : value);
                            setCurrentPage(1);
                        }}
                        className="me-2"
                        style={{ width: '200px' }}
                    >
                        <option value="">Tất cả</option>
                        <option value={true}>Trung cấp</option>
                        <option value={false}>Cao đẳng</option>
                    </Form.Select>
                </Col>
            </Row>
            {/* Table of Consultations */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Ngành học</th>
                        <th>Loại xét tuyển</th>
                        <th>Xử lý yêu cầu</th>
                    </tr>
                </thead>
                <tbody>
                    {studentConsultation.length > 0 ? (
                        studentConsultation.map((consultation, index) => (
                            <tr key={consultation.studentConsultationId}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td
                                    className="text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleShowDetailModal(consultation)}
                                >
                                    {consultation.fullName}
                                </td>
                                <td>{consultation.phoneNumber}</td>
                                <td>{consultation.email}</td>
                                <td>{consultation.majorName}</td>
                                <td style={{ color: consultation.type ? 'green' : 'black' }}>
                                    {consultation.type ? "Trung cấp" : "Cao đẳng"}
                                </td>
                                <td>
                                    <Button
                                        variant="orange"
                                        className="text-white"
                                        onClick={() => handleShowDetailModal(consultation)}
                                    >
                                        Chi tiết
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
            {/* Pagination */}
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} yêu cầu
                </span>
                {totalPages > 1 && (
                    <Pagination>
                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    </Pagination>
                )}
            </div>

            {/* Detail Modal */}
            <Modal show={showDetailModal} onHide={handleCloseModals} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin chi tiết tư vấn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Họ và tên:</strong> {consultationDetails.fullName}</p>
                    <p><strong>Email:</strong> {consultationDetails.email}</p>
                    <p><strong>Số điện thoại:</strong> {consultationDetails.phoneNumber}</p>
                    <p><strong>Facebook:</strong> {consultationDetails.linkFB}</p>
                    <p><strong>Ngày nhận:</strong> {consultationDetails.dateReceive}</p>
                    <p><strong>Ngành học:</strong> {consultationDetails.majorName}</p>
                    <p><strong>Ghi chú:</strong> {consultationDetails.notes}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleShowEditModal}>
                        Chỉnh sửa
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={handleCloseModals} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin tư vấn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFullName">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={consultationDetails.fullName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={consultationDetails.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={consultationDetails.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLinkFB">
                            <Form.Label>Link Facebook</Form.Label>
                            <Form.Control
                                type="text"
                                name="linkFB"
                                value={consultationDetails.linkFB}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateReceive">
                            <Form.Label>Ngày nhận</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateReceive"
                                value={consultationDetails.dateReceive}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formMajorID">
                            <Form.Label>Ngành học</Form.Label>
                            <Form.Select
                                name="majorID"
                                value={consultationDetails.majorID}
                                onChange={handleInputChange}
                            >
                                <option value="">Chọn ngành</option>
                                {selectedConsultation.type ? (
                                    vocationalMajors.map((major) => (
                                        <option key={major.id} value={major.id}>
                                            {major.name}
                                        </option>
                                    ))
                                ) : (
                                    collegeMajors.map((major) => (
                                        <option key={major.id} value={major.id}>
                                            {major.name}
                                        </option>
                                    ))
                                )}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                name="status"
                                value={consultationDetails.status}
                                onChange={handleInputChange}
                            >
                                <option value="0">Pending</option>
                                <option value="1">Completed</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formNotes">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="notes"
                                rows={3}
                                value={consultationDetails.notes}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StudentConsultationList;
