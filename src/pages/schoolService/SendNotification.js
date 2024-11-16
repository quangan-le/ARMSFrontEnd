import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextEditor from '../../firebase/TextEditor.js';
import { useAuthStore } from "../../stores/useAuthStore.js";
import { format } from 'date-fns';

const SendNotification = () => {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState([]); // Lưu danh sách thông báo
    const [showModal, setShowModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Gọi API lấy danh sách thông báo
    const fetchNotifications = async () => {
        try {
            const response = await api.get(`/SchoolService/SendEmail/get-request-notification`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách thông báo:", error);
        }
    };

    const formattedTime = (time) => {
        try {
            return format(new Date(time), 'HH:mm dd/MM/yyyy');
        } catch {
            return 'Không xác định';
        }
    };

    // Hiển thị chi tiết thông báo trong modal
    const handleViewNotification = async (notification) => {
        try {
            setSelectedNotification(notification); // Lưu thông báo được chọn
            setShowModal(true); // Mở modal
        } catch (error) {
            console.error("Lỗi khi hiển thị thông báo:", error);
        }
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false); // Đóng modal
        setSelectedNotification(null); // Reset thông báo được chọn
    };
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Tạo mới
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState({
        campusId: user.campusId,
        subject: '',
        content: '',
    });

    const handleClose = () => {
        setNotification({ campusId: user.campusId, content: '' });
        setShow(false);
    };
    const handleShow = () => setShow(true);

    const handleSubjectChange = (e) => {
        setNotification((prev) => ({ ...prev, subject: e.target.value }));
    };
    const handleContentChange = (content) => {
        setNotification((prev) => ({
            ...prev,
            content,
        }));
    };

    const handleSendNotification = async () => {
        if (!notification.content.trim()) {
            toast.error("Nội dung không được để trống!");
            return;
        }
        console.log(notification);
        try {
            const response = await api.post("/SchoolService/SendEmail/send-notification-to-student", notification);
            toast.success(response.data);
            fetchNotifications();
            handleClose();
        } catch (error) {
            console.error("Lỗi khi gửi thông báo:", error);
            toast.error("Gửi thông báo thất bại.");
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách thông báo</h2>
            <p className="text-center mb-4 text-orange fw-bold">Quản lý danh sách thông báo đã gửi qua email của campus</p>
            <div className="text-end mb-3">
                <Button
                    variant="orange"
                    className="text-white"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={handleShow}
                >
                    Tạo thông báo
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Thời gian gửi</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications && notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <tr key={notification.requestId}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>
                                    <Button
                                        variant="link"
                                        className="text-decoration-none"
                                        onClick={() => handleViewNotification(notification)}
                                    >
                                        {notification.subject}
                                    </Button>
                                </td>
                                <td>{formattedTime(notification.timeSend)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                Không có dữ liệu thông báo
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {/* Modal xem thông báo */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <ToastContainer position="top-right" autoClose={3000} />
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedNotification ? (
                        <>
                            <h5>Tiêu đề:</h5>
                            <p>{selectedNotification.subject}</p>
                            <h5>Nội dung:</h5>
                            <div
                                style={{
                                    whiteSpace: "pre-wrap",
                                    background: "#f8f9fa",
                                    padding: "15px",
                                    borderRadius: "5px",
                                }}
                            >
                                {selectedNotification.content}
                            </div>
                        </>
                    ) : (
                        <p>Không có dữ liệu để hiển thị.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={handleClose} centered size="xl">
                <ToastContainer position="top-right" autoClose={3000} />
                <Modal.Header closeButton>
                    <Modal.Title>Gửi email thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề email:</Form.Label>
                        <Form.Control
                            type="text"
                            value={notification.subject}
                            onChange={handleSubjectChange}
                            placeholder="Nhập tiêu đề email..."
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nội dung thông báo:</Form.Label>
                        <div style={{ minHeight: "400px", padding: "10px", borderRadius: "5px" }}>
                            <TextEditor value={notification.content} onChange={handleContentChange} />
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        variant="orange"
                        className="text-white"
                        style={{ whiteSpace: 'nowrap' }}
                        onClick={handleSendNotification}
                    >
                        Gửi thông báo
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default SendNotification;
