import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import { Link, useParams } from 'react-router-dom';
import api from "../../apiService.js";

const AdmissionRegistrationListACInPlan = () => {
    const { AI,ATId } = useParams();
    const [search, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTypeofStatus, setSelectedTypeofStatus] = useState('');

    const [registerAdmissions, setRegisterAdmissions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const registerAdmissionsPerPage = 10;
    
    const fetchRegisterAdmissions = async () => {
        try {
            const response = await api.get(`/admin-council/RegisterAdmission/list-register-admission/${ATId}`, {
                params: {
                    search: search,
                    currentPage: currentPage,
                    typeofStatus: selectedTypeofStatus
                },
            });
            setRegisterAdmissions(response.data.item);
            setTotalPages(response.data.pageCount);
            setTotalItems(response.data.totalItems);
        } catch (error) {
            console.error("Có lỗi khi lấy danh sách hồ sơ đăng ký:", error);
        }
    };

    useEffect(() => {
        fetchRegisterAdmissions();
    }, [ATId, search, currentPage, selectedTypeofStatus]);
    const startItem = (currentPage - 1) * registerAdmissionsPerPage + 1;
    const endItem = Math.min(currentPage * registerAdmissionsPerPage, totalItems);
    return (
        <Container className="my-3">
            <h2 className="text-center text-orange fw-bold">Danh sách hồ sơ đăng ký</h2>
            <p className="text-center mb-4 text-orange fw-bold">Danh sách hồ sơ đăng ký theo đợt</p>
            <Row className="mb-3">
                <Col xs={12} md={8} className='d-flex'>
                    <Link to={`/admissions-council/chi-tiet-ke-hoach-tuyen-sinh/${AI}`}>
                        <button className="btn btn-orange">Quay lại thông tin tuyển sinh</button>
                    </Link>

                    <Form.Group className='mx-3' style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm"
                            value={search}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                    <Form.Group controlId="typeOfStatusSelect" className="d-flex align-items-center">
                        <Form.Control
                            as="select"
                            value={selectedTypeofStatus}
                            onChange={(e) => setSelectedTypeofStatus(e.target.value)}
                        >
                            <option value="">Trạng thái hồ sơ</option>
                            <option value="0">Đăng ký hồ sơ thành công</option>
                            <option value="1">Xác nhận hồ sơ đăng ký thành công</option>
                            <option value="2">Hồ sơ nhập học thành công</option>
                            <option value="3">Xác nhận hồ sơ nhập học thành công</option>
                            <option value="4">Chờ thanh toán phí nhập học</option>
                            <option value="5">Đang xử lý nhập học</option>
                            <option value="6">Hoàn thành</option>
                        </Form.Control>
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
                        <th>Thời gian gửi</th>
                        <th>Loại xét tuyển</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
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
                                <td>{new Date(item.timeRegister).toLocaleDateString()}</td>
                                <td>
                                    {(item.typeOfDiplomaMajor1 === 4 || item.typeOfDiplomaMajor2 === 4) ? "Liên thông" : ""}
                                </td>
                                <td> {item.typeofStatusProfile === null
                                    ? "Chờ xét duyệt"
                                    : item.typeofStatusProfile === 0
                                        ? "Đăng ký hồ sơ thành công"
                                        : item.typeofStatusProfile === 1
                                            ? "Xác nhận đăng ký hồ sơ thành công"
                                            : item.typeofStatusProfile === 2
                                                ? "Hồ sơ nhập học thành công"
                                                : item.typeofStatusProfile === 3
                                                    ? "Xác nhận hồ sơ nhập học thành công"
                                                    : item.typeofStatusProfile === 4
                                                        ? "Chờ thanh toán phí nhập học"
                                                        : item.typeofStatusProfile === 5
                                                            ? "Đang xử lý nhập học"
                                                            : item.typeofStatusProfile === 6
                                                                ? "Hoàn thành"
                                                                : ""}
                                </td>
                                <td className="text-center">
                                    <Link to={`/admissions-council/chi-tiet-dang-ky-tuyen-sinh/${item.spId}`}>
                                        <Button variant="orange" className="text-white">
                                            Chi tiết
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">
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

export default AdmissionRegistrationListACInPlan;
