import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Table, Button, Pagination } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
const AccountList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const { campusId } = useOutletContext();

    const accountsPerPage = 8;

    // Gọi API để lấy danh sách tài khoản
    const fetchAccounts = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/api/Account/get-accounts`, {
                    params: {
                        CampusId: campusId,
                        Search: searchTerm || "",
                        CurrentPage: currentPage,
                        role: selectedRole || "",
                    },
                });

                setAccounts(response.data.item || []);
                setTotalPages(response.data.pageCount);
                setTotalItems(response.data.totalItems);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách tài khoản:", error);
        }
    };

    // Lấy dữ liệu khi các tham số thay đổi
    useEffect(() => {
        fetchAccounts();
    }, [campusId, searchTerm, currentPage, selectedRole]);

    // Xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Xử lý phê duyệt tài khoản
    const handleApprove = (accountId) => {
        console.log("Phê duyệt tài khoản:", accountId);
        // Thực hiện logic phê duyệt tại đây
    };

    return (
        <Container>
            <h2 className="text-center text-orange fw-bold">Danh sách tài khoản</h2>
            <p className="text-center text-orange mb-4 fw-bold">Quản lý danh sách tài khoản thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1 }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên người dùng"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Bảng dữ liệu */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Giới tính</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Chuyên ngành</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts && accounts.length > 0 ? (
                        accounts.map((account, index) => (
                            <tr key={account.id}>
                                <td>{(currentPage - 1) * accountsPerPage + index + 1}</td>
                                <td>{account.fullname}</td>
                                <td>{account.gender}</td>
                                <td>{account.email}</td>
                                <td>{account.phone || "N/A"}</td>
                                <td>{account.majorName || "N/A"}</td>
                                <td className={account.isAccountActive ? "text-success" : "text-danger"}>
                                    {account.isAccountActive ? "Hoạt động" : "Khóa"}
                                </td>
                                <td>
                                    <Button
                                        variant="success"
                                        onClick={() => handleApprove(account.id)}
                                    >
                                        Phê duyệt
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">Không có tài khoản nào</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Phân trang */}
            <div className="d-flex justify-content-between align-items-center">
                <span>
                    Hiển thị từ {(currentPage - 1) * accountsPerPage + 1} đến{" "}
                    {Math.min(currentPage * accountsPerPage, totalItems)} trên tổng số {totalItems} tài khoản
                </span>
                <Pagination>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </Container>
    );
};

export default AccountList;
