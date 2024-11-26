import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Table, Button, Pagination, Modal } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");
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
                const response = await api.get(`/Account/get-accounts-student`, {
                    params: {
                        CampusId: campusId,
                        Search: searchTerm || "",
                        CurrentPage: currentPage,
                        TypeAccount: selectedType || "",
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
    }, [campusId, searchTerm, currentPage, selectedType]);

    // Xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    // Mở modal chi tiết
    const handleShowDetailModal = (account) => {
        setSelectedAccount(account);
        setShowDetailModal(true);
    };

    // Đóng modal chi tiết
    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedAccount(null);
    };

    // Hàm phê duyệt tài khoản
    const handleApprove = async (accountId) => {
        try {
            const response = await api.put(`/Account/update-account/${accountId}`, {
                typeAccount: 2, // Phê duyệt
                isAccountActive: true,
            });
            toast.success("Tài khoản đã được phê duyệt!");
            fetchAccounts(); // Cập nhật lại danh sách tài khoản
            handleCloseDetailModal();
        } catch (error) {
            toast.error("Lỗi khi phê duyệt tài khoản!");
        }
    };

    // Hàm từ chối tài khoản
    const handleReject = async (accountId) => {
        try {
            const response = await api.put(`/Account/update-account/${accountId}`, {
                typeAccount: 3, // Từ chối
                isAccountActive: false,
            });
            toast.success("Tài khoản đã bị từ chối!");
            fetchAccounts(); // Cập nhật lại danh sách tài khoản
            handleCloseDetailModal();
        } catch (error) {
            toast.error("Lỗi khi từ chối tài khoản!");
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách tài khoản</h2>
            <p className="text-center text-orange mb-4 fw-bold">Quản lý danh sách tài khoản thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={9} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1 }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên người dùng"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group className="d-flex align-items-center">
                        <Form.Select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">Trạng thái</option>
                            <option value="1">Chờ phê duyệt</option>
                            <option value="3">Đã bị từ chối</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Giới tính</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Mã số sinh viên</th>
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
                                <td>{account.fullname || "N/A"}</td>
                                <td>{account.gender ? "Nam" : "Nữ"}</td>
                                <td>{account.email || "N/A"}</td>
                                <td>{account.phone || "N/A"}</td>
                                <td>{account.studentCode || "N/A"}</td>
                                <td>{account.majorName || "N/A"}</td>
                                <td className={account.typeAccount === 1 ? "text-success" : account.typeAccount === 3 ? "text-danger" : ""}>
                                    {account.typeAccount === 1 ? "Chờ phê duyệt" : account.typeAccount === 3 ? "Đã bị từ chối" : ""}
                                </td>
                                <td>
                                    <Button
                                        className="me-2"
                                        variant="info"
                                        onClick={() => handleShowDetailModal(account)}
                                    >
                                        Chi tiết
                                    </Button>
                                    <Button
                                        className="btn-orange me-2"
                                        onClick={() => handleApprove(account.id)}
                                    >
                                        {account.typeAccount === 3 ? "Phê duyệt lại" : "Phê duyệt"}
                                    </Button>
                                    {account.typeAccount !== 3 && ( // Ẩn nút Từ chối nếu đã bị từ chối
                                        <Button
                                            className="btn-danger"
                                            onClick={() => handleReject(account.id)}
                                            disabled={account.typeAccount === 3} // Disable nếu đã bị từ chối
                                        >
                                            Từ chối
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">Không có tài khoản nào</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center">
                <span>
                    Hiển thị từ {(currentPage - 1) * accountsPerPage + 1} đến{" "}
                    {Math.min(currentPage * accountsPerPage, totalItems)} trên tổng số {totalItems} tài khoản
                </span>
                <Pagination>
                    <Pagination.Prev
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>

            {selectedAccount && (
                <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết tài khoản</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col sm={4}><strong>Họ tên:</strong></Col>
                            <Col sm={8}>{selectedAccount.fullname || "Chưa cập nhật"}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={4}><strong>Email:</strong></Col>
                            <Col sm={8}>{selectedAccount.email || "Chưa cập nhật"}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={4}><strong>Số điện thoại:</strong></Col>
                            <Col sm={8}>{selectedAccount.phone || "Chưa cập nhật"}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={4}><strong>Giới tính:</strong></Col>
                            <Col sm={8}>{selectedAccount.gender ? "Nam" : "Nữ"}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={4}><strong>Ngày sinh:</strong></Col>
                            <Col sm={8}>{new Date(selectedAccount.dob).toLocaleDateString()}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={4}><strong>Mã sinh viên:</strong></Col>
                            <Col sm={8}>{selectedAccount.studentCode || "Chưa cập nhật"}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={4}><strong>Chuyên ngành:</strong></Col>
                            <Col sm={8}>{selectedAccount.majorName || "Chưa cập nhật"}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={4}><strong>Trạng thái:</strong></Col>
                            <Col sm={8}>
                                {selectedAccount.typeAccount === 1
                                    ? "Chờ phê duyệt"
                                    : selectedAccount.typeAccount === 3
                                        ? "Đã bị từ chối"
                                        : ""}
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDetailModal}>
                            Đóng
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => handleApprove(selectedAccount.id)}
                        >
                            {selectedAccount.typeAccount === 3 ? "Phê duyệt lại" : "Phê duyệt"}
                        </Button>
                        {selectedAccount.typeAccount !== 3 && ( // Ẩn nút Từ chối nếu đã bị từ chối
                            <Button
                                variant="danger"
                                onClick={() => handleReject(selectedAccount.id)}
                                disabled={selectedAccount.typeAccount === 3} // Disable nếu đã bị từ chối
                            >
                                Từ chối
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default AccountList;
