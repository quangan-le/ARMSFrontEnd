import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
const AccountList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMajors, setTotalMajors] = useState(120);
    const majorsPerPage = 10;

    const [accounts, setAccounts] = useState([]);
    const { selectedCampus } = useOutletContext();
    const campusId = selectedCampus.id;
// Gọi API để lấy danh sách các accounts theo điều kiện tìm kiếm
const fetchAccounts = async () => {
    try {
        if (campusId) {
            const response = await api.get(`/Account/get-accounts`, {
                params: {
                    CampusId: campusId,
                    // Search: search,
                    // CurrentPage: currentPage,
                    // College: selectedCollege || null,
                },
            });
            setAccounts(response.data);
            //setTotalPages(response.data.pageCount);
            //setTotalItems(response.data.totalItems);
        }
    } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách ngành học:", error);
    }
};
useEffect(() => {
    fetchAccounts();
}, [campusId]);

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
            <h2 className="text-center">Danh sách yêu cầu phê duyệt tài khoản</h2>
            <p className="text-center mb-4 fw-bold">Quản lý danh sách yêu cầu phê duyệt tài khoản thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
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
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{account.fullname}</td>
                            <td>{account.email}</td>
                            <td>{account.phone}</td>
                            <td>{account.gender}</td>
                            <td>{account.dob}</td>
                            <td>{account.isAccountActive}</td>
                            <td>{account.roleName}</td>
                            <td>Đợi phê duyệt</td>
                            <td>
                                <Button variant="warning" className="me-2">Phê duyệt</Button>
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
        </Container>
    );
};

export default AccountList;
