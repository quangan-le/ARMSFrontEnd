import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextEditor from '../../firebase/TextEditor.js';

const SendNotification = () => {
    // const { selectedCampus } = useOutletContext();
    // const campusId = selectedCampus.id;
    const campusId = 'hanoi';
    const [search, setSearchTerm] = useState('');
    const [majors, setMajors] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const majorsPerPage = 10;


    const fetchMajors = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/school-service/Major/get-majors`, {
                    params: {
                        CampusId: campusId,
                        Search: search,
                        CurrentPage: currentPage,
                        College: selectedCollege || null,
                    },
                });
                setMajors(response.data.item);
                setTotalPages(response.data.pageCount);
                setTotalItems(response.data.totalItems);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách thông báo:", error);
        }
    };
    const [showModal, setShowModal] = useState(false);
    const [selectedMajors, setSelectedMajors] = useState(null);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMajors(null);
    };
    const handleShowModal = async (major) => {
        try {

            const response = await api.get(`/school-service/Major/get-major-details?MajorId=${major.majorID}`);
            const majorData = response.data;

            setSelectedMajors(majorData);
            setShowModal(true);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu thông báo:', error);
        }
    };
    // Gọi API lấy danh sách major khi search hoặc currentPage thay đổi
    useEffect(() => {
        fetchMajors();
    }, [search, currentPage, campusId, selectedCollege]);

    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Tạo mới
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState({
        campusId: campusId,
        subject: '',
        content: '',
    });

    const handleClose = () => {
        setNotification({ campusId: campusId, content: '' });
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
                        <th>Nội dung</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {majors && majors.length > 0 ? (
                        majors.map((major, index) => (
                            <tr key={major.majorID}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>{major.majorID}</td>
                                <td>{major.majorID}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                Không có dữ liệu email
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} tin tức
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
