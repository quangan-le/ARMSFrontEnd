import React, { useState } from "react";
import { Container, Row, Col, Table, Form, Button, Pagination } from "react-bootstrap";

const RequestChangeMajorList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Đang xử lý");
    const [currentPage, setCurrentPage] = useState(2);
    const [totalRequests, setTotalRequests] = useState(120);
    const requestsPerPage = 10;

    // Dummy data for the table
    const requests = Array.from({ length: totalRequests }, (_, index) => ({
        id: index + 1,
        studentId: `AnhNDHE${153333 + index}`,
        studentName: "Nguyễn Đức Anh",
        oldMajor: "Ngành học",
        newMajor: "Ngành học",
        requestContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
        requestFile: "Donchuyennganh.docx",
        feedback: "",
        status: "Đang xử lý",
    }));

    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="me-3">
            <h2 className="text-center mb-4">Yêu cầu chuyển ngành</h2>
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Label className="mb-0 me-2">Tìm kiếm:</Form.Label>
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
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: "200px" }}
                    >
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
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
                        <th>Cập nhật trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRequests.map((request, index) => (
                        <tr key={request.id}>
                            <td>{indexOfFirstRequest + index + 1}</td>
                            <td>{request.studentId}</td>
                            <td>{request.studentName}</td>
                            <td>{request.oldMajor}</td>
                            <td>{request.newMajor}</td>
                            <td>{request.requestContent}</td>
                            <td>{request.requestFile}</td>
                            <td>{request.feedback}</td>
                            <td>{request.status}</td>
                            <td>
                                <Button variant="primary" size="sm">Cập nhật</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center">
                <span>
                    Hiển thị {indexOfFirstRequest + 1} đến {Math.min(indexOfLastRequest, totalRequests)} trên tổng số {totalRequests} yêu cầu
                </span>
                <Pagination>
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    {Array.from({ length: Math.ceil(totalRequests / requestsPerPage) }, (_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(totalRequests / requestsPerPage)}
                    />
                </Pagination>
            </div>
        </div>
    );
};

export default RequestChangeMajorList;
