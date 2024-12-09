import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Table } from "react-bootstrap";
import { Link, useOutletContext } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import api from "../../apiService.js";

const PlanAdmission = () => {
    const [admissionInformations, setAdmissionInformations] = useState([]);
    const { campusId } = useOutletContext();

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        year: '',
        admissions: '',
        startAdmission: '',
        endAdmission: '',
        feeRegister: '',
        feeAdmission: '',
        admissionProfileDescription: ''
    });

    const fetchAdmissionInformations = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/admission-council/AdmissionInformation/get-admission-information`, {
                    params: { CampusId: campusId },
                });
                setAdmissionInformations(response.data);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách ngành học:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({
            year: '',
            admissions: '',
            startAdmission: '',
            endAdmission: '',
            feeRegister: '',
            feeAdmission: '',
            admissionProfileDescription: ''
        });
    };

    const handleShowModal = () => setShowModal(true);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateAdmission = async () => {
        const startDate = new Date(formData.startAdmission);
        const endDate = new Date(formData.endAdmission);
    
        if (startDate >= endDate) {
            toast.error("Thời gian bắt đầu phải trước thời gian kết thúc.");
            return;
        }
        try {
            const response = await api.post('/admission-council/AdmissionInformation/add-admission-information', {
                ...formData,
                campusId,
            });
            if (response.data.status) {
                toast.success('Tạo mới thành công');
            } else {
                toast.error(response.data.message);
            }
            fetchAdmissionInformations();
            handleCloseModal();
        } catch (error) {
            toast.error("Đã xảy ra lỗi! Vui lòng thử lại sau!");
        }
    };

    const handleEditAdmission = async () => {
        const startDate = new Date(formData.startAdmission);
        const endDate = new Date(formData.endAdmission);
    
        if (startDate >= endDate) {
            toast.error("Thời gian bắt đầu phải trước thời gian kết thúc.");
            return;
        }
        try {
            const response = await api.put(`/admission-council/AdmissionInformation/update-admission-information`, {
                ...formData,
                admissionInformationID: editId,
            });
            if (response.data.status) {
                toast.success('Cập nhật thành công');
            } else {
                toast.error(response.data.message);
            }
            fetchAdmissionInformations();
            handleCloseModal();
        } catch (error) {
            toast.error("Đã xảy ra lỗi! Vui lòng thử lại sau!");
        }
    };

    const handleEditClick = (admissionInformation) => {
        setIsEditing(true);
        setEditId(admissionInformation.admissionInformationID);
        setFormData({
            year: admissionInformation.year,
            admissions: admissionInformation.admissions,
            startAdmission: admissionInformation.startAdmission,
            endAdmission: admissionInformation.endAdmission,
            feeRegister: admissionInformation.feeRegister,
            feeAdmission: admissionInformation.feeAdmission,
            admissionProfileDescription: admissionInformation.admissionProfileDescription || ''
        });
        setShowModal(true);
    };

    useEffect(() => {
        fetchAdmissionInformations();
    }, [campusId]);

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Kế hoạch tuyển sinh các năm</h2>
            <p className="text-center mb-4 text-orange fw-bold">Các kế hoạch tuyển sinh thuộc campus</p>
            <Col className="d-flex justify-content-end">
                <Button
                    variant="orange"
                    className="text-white my-2"
                    onClick={handleShowModal}
                >
                    Thêm mới
                </Button>
            </Col>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Năm</th>
                        <th>Khóa tuyển sinh</th>
                        <th>Bắt đầu tuyển sinh</th>
                        <th>Kết thúc tuyển sinh</th>
                        <th>Lệ phí xét tuyển</th>
                        <th>Lệ phí nhập học</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionInformations && admissionInformations.length > 0 ? (
                        admissionInformations.map((admissionInformation, index) => (
                            <tr key={admissionInformation.admissionInformationID}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>{admissionInformation.year}</td>
                                <td className="text-center">K{admissionInformation.admissions}</td>
                                <td>{new Date(admissionInformation.startAdmission).toLocaleDateString('en-GB')}</td>
                                <td>{new Date(admissionInformation.endAdmission).toLocaleDateString('en-GB')}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(admissionInformation.feeRegister)}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(admissionInformation.feeAdmission)}</td>
                                <td>
                                    <Link to={`/admissions-council/chi-tiet-ke-hoach-tuyen-sinh/${admissionInformation.admissionInformationID}`}>
                                        <Button
                                            variant="orange"
                                            className="text-white"
                                            style={{ whiteSpace: 'nowrap', marginRight: '10px' }}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="orange"
                                        className="text-white"
                                        style={{ whiteSpace: 'nowrap' }}
                                        onClick={() => handleEditClick(admissionInformation)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                Không có kế hoạch tuyển sinh nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal for Creating/Editing Admission Plan */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Chỉnh sửa kế hoạch tuyển sinh' : 'Thêm mới kế hoạch tuyển sinh'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Năm</Form.Label>
                            <Form.Control
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Khóa tuyển sinh</Form.Label>
                            <Form.Control
                                type="number"
                                name="admissions"
                                value={formData.admissions}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bắt đầu tuyển sinh</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startAdmission"
                                value={formData.startAdmission}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Kết thúc tuyển sinh</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endAdmission"
                                value={formData.endAdmission}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Lệ phí xét tuyển</Form.Label>
                            <Form.Control
                                type="number"
                                name="feeRegister"
                                value={formData.feeRegister}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Lệ phí nhập học</Form.Label>
                            <Form.Control
                                type="number"
                                name="feeAdmission"
                                value={formData.feeAdmission}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button variant="orange" onClick={isEditing ? handleEditAdmission : handleCreateAdmission}>
                        {isEditing ? 'Cập nhật' : 'Lưu'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PlanAdmission;
