import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
const UserList = () => {
    //const [searchTerm, setSearchTerm] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [totalMajors, setTotalMajors] = useState(120);
    const majorsPerPage = 10;
    const [show, setShow] = useState(false);

    const [search, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const { campusId } = useOutletContext();
    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Cán bộ tuyển sinh",
        cccd: "",
        dob: "",
        status: "Active"
    });
// Gọi API để lấy danh sách các accounts theo điều kiện tìm kiếm
const fetchAccounts = async () => {
    try {
        if (campusId) {
            const response = await api.get(`/Account/get-accounts`, {
                params: {
                    CampusId: campusId,
                     Search: search,
                     CurrentPage: currentPage,
                    role: selectedRole
                },
            });
            setAccounts(response.data.item);
            setTotalPages(response.data.pageCount);
            setTotalItems(response.data.totalItems);
        }
    } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách ngành học:", error);
    }
};
useEffect(() => {
    fetchAccounts();
}, [search, currentPage,campusId, selectedRole]);

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
            <h2 className="text-center text-orange">Danh sách người dùng</h2>
            <p className="text-center  text-orange mb-4 fw-bold">Quản lý danh sách người dùng thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên người dùng"
                            value={search}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                    <Form.Select
                        value={selectedRole}
                        onChange={({ target: { value } }) => {
                            setSelectedRole(value);
                            setCurrentPage(1);
                        }}
                        className="me-2"
                        style={{ width: '200px' }}
                    >
                        <option value="">Vai trò</option>
                        <option value="Student">Học sinh</option>
                        <option value="AdmissionOfficer">Cán bộ tuyển sinh</option>
                        <option value="SchoolService">Dịch vụ sinh viên</option>
                        <option value="AdmissionCouncil">Hội đồng tuyển sinh</option>
                        <option value="Admin">Quản trị campus</option>
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
                        <th>Vai trò</th>
                        <th>Chuyên ngành</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            <td className="text-center fw-bold">{index+1}</td>
                            <td>{account.fullname}</td>
                            <td>{account.email}</td>
                            <td>{account.phone}</td>
                            <td>{account.roleName=="Student"?"Học sinh":
                            (account.roleName=="SchoolService"?"Dịch Vụ Sinh Viên":
                            (account.roleName=="AdmissionCouncil"?"Hội đồng tuyển sinh":
                            (account.roleName=="Admin"?"Quản trị campus":
                            (account.roleName=="AdmissionOfficer"?"Cán bộ tuyển sinh":"N/A")
                            )
                            ))}</td>
                            <td>{account.majorName}</td>
                            <td style={{ color: account.isAccountActive ? 'green' : 'red' }}>
                            {account.isAccountActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                            </td>

                            <td>
                            {account.roleName !== "Admin" && (
                                <Button variant="warning" className="me-2">
                                Chỉnh sửa
                                </Button>
                            )}
                            </td>

                        </tr>
                    ))}
                    
                </tbody>
            </Table>
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} người dùng
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

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tạo người dùng mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Tên người dùng */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Tên người dùng</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên người dùng"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Địa chỉ email */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Địa chỉ email</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="email"
                                    placeholder="Nhập email (Example@gmail.com)"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Số điện thoại */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Số điện thoại</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    name="phone"
                                    value={newUser.phone}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Vai trò */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Vai trò</Form.Label>
                            <Col sm={8}>
                                <Form.Select
                                    name="role"
                                    value={newUser.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="Cán bộ tuyển sinh">Cán bộ tuyển sinh</option>
                                    <option value="Học sinh">Học sinh</option>
                                    <option value="Sinh viên">Sinh viên</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        {/* Số CCCD */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Số CCCD</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập căn cước công dân"
                                    name="cccd"
                                    value={newUser.cccd}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Ngày sinh */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Ngày sinh</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="dd/MM/yyyy"
                                    name="dob"
                                    value={newUser.dob}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={4}>Trạng thái</Form.Label>
                            <Col sm={8}>
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
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button className="btn-orange" onClick={handleSubmit}>
                        Tạo mới
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserList;
