import React, { useState } from "react";
import { Container, Row, Col, Table, Form, Button, Pagination, Modal } from "react-bootstrap";

const UserList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMajors, setTotalMajors] = useState(120);
    const majorsPerPage = 10;
    const [show, setShow] = useState(false);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Cán bộ tuyển sinh",
        cccd: "",
        dob: "",
        status: "Active"
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = () => {
        console.log("New user data:", newUser);
        handleClose();
    };

    return (
        <Container>
            <h2 className="text-center">Danh sách người dùng</h2>
            <p className="text-center mb-4 fw-bold">Quản lý danh sách người dùng thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Label className="mb-0 me-2">Tìm kiếm:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên người dùng"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                    <Form.Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="me-2"
                        style={{ width: '200px' }} 
                    >
                        <option value="">Vai trò</option>
                        <option value="major1">Học sinh</option>
                        <option value="major2">Sinh viên</option>
                    </Form.Select>
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
                    <Button className="btn-orange" onClick={handleShow}>Tạo mới</Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Cơ sở</th>
                        <th>Vai trò</th>
                        <th>Chuyên ngành</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMajors.map((major) => (
                        <tr key={major.id}>
                            <td>{major.id}</td>
                            <td>{major.code}</td>
                            <td>{major.name}</td>
                            <td>{major.name}</td>
                            <td>{major.name}</td>
                            <td>{major.name}</td>
                            <td>{major.name}</td>
                            <td>{major.name}</td>
                            <td>
                                <Button variant="warning" className="me-2">Chỉnh sửa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center">
                <span>
                    Hiển thị từ {indexOfFirstMajor + 1} đến {Math.min(indexOfLastMajor, totalMajors)} trên tổng số {totalMajors} người dùng
                </span>
                <Pagination>
                    {Array.from({ length: Math.ceil(totalMajors / majorsPerPage) }, (_, index) => (
                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>

            {/* Modal for creating a new user */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo người dùng mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên người dùng</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên người dùng"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email (Example@gmail.com)"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập số điện thoại"
                                name="phone"
                                value={newUser.phone}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vai trò</Form.Label>
                            <Form.Select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                            >
                                <option value="Cán bộ tuyển sinh">Cán bộ tuyển sinh</option>
                                <option value="Học sinh">Học sinh</option>
                                <option value="Sinh viên">Sinh viên</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số CCCD</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập căn cước công dân"
                                name="cccd"
                                value={newUser.cccd}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="dd/MM/yyyy"
                                name="dob"
                                value={newUser.dob}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <div>
                                <Form.Check
                                    type="radio"
                                    label="Inactive"
                                    name="status"
                                    value="Inactive"
                                    checked={newUser.status === "Inactive"}
                                    onChange={handleInputChange}
                                    inline
                                />
                                <Form.Check
                                    type="radio"
                                    label="Active"
                                    name="status"
                                    value="Active"
                                    checked={newUser.status === "Active"}
                                    onChange={handleInputChange}
                                    inline
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Tạo mới
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserList;
