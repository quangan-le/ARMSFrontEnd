import React, { useState } from "react";
import { Container, Row, Col, Table, Form, Button, Pagination } from "react-bootstrap";

const MajorsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMajors, setTotalMajors] = useState(120);
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
                    <Button className="btn-orange">Tạo mới</Button>
                    </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã</th>
                        <th>Tên</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMajors.map((major) => (
                        <tr key={major.id}>
                            <td>{major.id}</td>
                            <td>{major.code}</td>
                            <td>{major.name}</td>
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
        </Container>
    );
};

export default MajorsList;
