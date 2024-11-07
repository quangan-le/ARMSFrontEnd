import React, { useState } from "react";
import { Container, Row, Col, Table, Form, Button, Pagination, Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';

const MajorsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMajors, setTotalMajors] = useState(120);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const majorsPerPage = 10;

    const majors = Array.from({ length: totalMajors }, (_, index) => ({
        id: index + 1,
        code: `M${index + 1}`,
        name: `Ngành học ${index + 1}`,
    }));

    const indexOfLastMajor = currentPage * majorsPerPage;
    const indexOfFirstMajor = indexOfLastMajor - majorsPerPage;
    const currentMajors = majors.slice(indexOfFirstMajor, indexOfLastMajor);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleShowCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    return (
        <Container>
            <h2 className="text-center">Danh sách ngành học</h2>
            <p className="text-center mb-4 fw-bold">Quản lý danh sách chuyên ngành thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Label className="mb-0 me-2">Tìm kiếm:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên ngành học"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                    <Form.Select
                        value={selectedMajor}
                        onChange={(e) => setSelectedMajor(e.target.value)}
                        className="me-2"
                        style={{ width: '200px' }}
                    >
                        <option value="">Chọn ngành</option>
                        <option value="major1">Ngành 1</option>
                        <option value="major2">Ngành 2</option>
                        <option value="major3">Ngành 3</option>
                    </Form.Select>
                    <Button className="btn-orange" onClick={handleShowCreateModal}>Tạo mới</Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã ngành</th>
                        <th>Tên ngành</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMajors.map((major) => (
                        <tr key={major.id}>
                            <td>{major.id}</td>
                            <td>{major.code}</td>
                            <td><Link to={`/chi-tiet-nganh-hoc/${major.id}`}>{major.name}</Link></td>
                            <td>
                                <Button variant="warning" className="me-2">Sửa</Button>
                                <Button variant="danger">Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center">
                <span>
                    Hiển thị từ {indexOfFirstMajor + 1} đến {Math.min(indexOfLastMajor, totalMajors)} trên tổng số {totalMajors} ngành học
                </span>
                <Pagination>
                    {Array.from({ length: Math.ceil(totalMajors / majorsPerPage) }, (_, index) => (
                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>

            {/* Create Major Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tạo mới ngành học</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã ngành:</Form.Label>
                            <Form.Control type="text" placeholder="Nhập mã ngành" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên ngành:</Form.Label>
                            <Form.Control type="text" placeholder="Nhập tên ngành" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả ngành học:</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Nhập mô tả" />
                        </Form.Group>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã môn</th>
                                    <th>Tên môn</th>
                                    <th>Kỳ học</th>
                                    <th>Số tín chỉ</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>GDQP</td>
                                    <td>Giáo dục quốc phòng</td>
                                    <td>0</td>
                                    <td>3</td>
                                    <td><Button variant="link">Chỉnh sửa</Button></td>
                                </tr>
                            </tbody>
                        </Table>
                        <Button variant="link">+ Thêm môn mới</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateModal}>
                        Đóng
                    </Button>
                    <Button variant="primary">Tạo mới</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MajorsList;
