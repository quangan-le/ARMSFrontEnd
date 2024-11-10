import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";

const AdmissionRegistrationList = () => {
    const { selectedCampus } = useOutletContext();
    const campusId = selectedCampus.id;

    const [search, setSearchTerm] = useState('');
    const [registerAdmissions, setRegisterAdmissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const registerAdmissionsPerPage = 10;

    const fetchRegisterAdmissions = async () => {
        try {
            const response = await api.get(`/admin-officer/RegisterAdmission/list-register-admission`, {
                params: {
                    campusId: campusId,
                    search: search,
                    currentPage: currentPage,
                },
            });
            console.log(response.data);
            setRegisterAdmissions(response.data.item);
            setTotalPages(response.data.pageCount);
            setTotalItems(response.data.totalItems);
        } catch (error) {
            console.error("Có lỗi khi lấy danh sách hồ sơ đăng ký:", error);
        }
    };

    useEffect(() => {
        if (selectedCampus && selectedCampus.id) {
            const campusId = selectedCampus.id;
            fetchRegisterAdmissions(campusId);
        }
    }, [selectedCampus, search, currentPage]);

    const startItem = (currentPage - 1) * registerAdmissionsPerPage + 1;
    const endItem = Math.min(currentPage * registerAdmissionsPerPage, totalItems);

    return (
        <Container>
            <h2 className="text-center text-orange fw-bold">Danh sách hồ sơ đăng ký</h2>
            <p className="text-center mb-4 text-orange fw-bold">Quản lý hồ sơ đăng ký thuộc campus</p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Label className="mb-0 me-2">Tìm kiếm:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên sinh viên"
                            value={search}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                    </tr>
                </thead>
                <tbody>
                    {registerAdmissions && registerAdmissions.length > 0 ? (
                        registerAdmissions.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>{item.fullname}</td>
                                <td>{new Date(item.dob).toLocaleDateString()}</td>
                                <td>{item.gender ? "Nam" : "Nữ"}</td>
                                <td>{item.emailStudent}</td>
                                <td>{item.phoneStudent}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Không có hồ sơ đăng ký nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} hồ sơ
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
        </Container>
    );
};

export default AdmissionRegistrationList;
