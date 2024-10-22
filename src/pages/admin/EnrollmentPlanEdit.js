import React, { useState } from "react";
import { Button, Form, Row, Col, Table, Container } from "react-bootstrap";

const EnrollmentPlanEdit = () => {
    // Dummy data for majors
    const majors = [
        { id: 1, majorName: "Công nghệ thông tin", specialization: "Lập trình mobile", code: "5580102", target: "130" },
        { id: 2, majorName: "Công nghệ thông tin", specialization: "Lập trình web", code: "5580102", target: "130" },
        { id: 3, majorName: "Công nghệ thông tin", specialization: "Lập trình game", code: "5580102", target: "130" },
        { id: 4, majorName: "Quản trị kinh doanh", specialization: "Quản trị khách sạn", code: "5580102", target: "130" },
        { id: 5, majorName: "Quản trị kinh doanh", specialization: "Marketing", code: "5580102", target: "130" },
        { id: 6, majorName: "Thẩm mỹ và làm đẹp", specialization: "Phun xăm làm đẹp", code: "5580102", target: "130" },
        { id: 7, majorName: "Thẩm mỹ và làm đẹp", specialization: "Chăm sóc da", code: "5580102", target: "130" },
    ];

    return (
        <Container>
            <h2 className="text-center">Kế hoạch tuyển sinh</h2>
            <p className="text-center mb-4 fw-bold">Kế hoạch tuyển sinh của campus</p>
            <Row>
                <Col md={8}>
                    <h5>I. Chỉ tiêu tuyển sinh</h5>
                    <p>Số lượng tuyển sinh: 2800 chỉ tiêu</p>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên ngành</th>
                                <th>Chuyên ngành</th>
                                <th>Mã ngành</th>
                                <th>Chỉ tiêu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {majors.map((major, index) => (
                                <tr key={major.id}>
                                    <td>{index + 1}</td>
                                    <td>{major.majorName}</td>
                                    <td className="text-orange">{major.specialization}</td>
                                    <td>{major.code}</td>
                                    <td>{major.target}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>

                <Col md={4}>
                    <h5 className="mb-3">V. Thời gian</h5>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Đợt</th>
                                <th>Từ</th>
                                <th>Đến</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Đợt 1</td>
                                <td>
                                    <Form.Control type="text" placeholder="dd/MM/yyyy" />
                                </td>
                                <td>
                                    <Form.Control type="text" placeholder="dd/MM/yyyy" />
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col md={8}>
                    <h5>II. Đối tượng tuyển sinh</h5>
                    <Form.Control as="textarea" rows={3} placeholder="Nhập nội dung đối tượng tuyển sinh..." className="mb-3" />

                    <h5>III. Hình thức tư vấn tuyển sinh</h5>
                    <Form.Control as="textarea" rows={3} placeholder="Nhập nội dung hình thức tư vấn tuyển sinh..." className="mb-3" />

                    <h5>IV. Nội dung tư vấn tuyển sinh</h5>
                    <Form.Control as="textarea" rows={3} placeholder="Nhập nội dung tư vấn tuyển sinh..." className="mb-3" />
                </Col>

                <Col md={4}>
                    <h5>VI. Hồ sơ xét tuyển</h5>
                    <Form.Control as="textarea" rows={3} placeholder="Nhập nội dung hồ sơ xét tuyển..." className="mb-3" />

                    <h5>VII. Hình thức xét tuyển</h5>
                    <Form.Control as="textarea" rows={3} placeholder="Nhập nội dung hình thức xét tuyển..." className="mb-3" />

                    <h5>VIII. Tổ chức thực hiện</h5>
                    <Form.Control as="textarea" rows={3} placeholder="Nhập nội dung tổ chức thực hiện..." className="mb-3" />
                </Col>
            </Row>

            <div className="text-center mt-4">
                <Button variant="primary" >Chỉnh sửa</Button>
            </div>
        </Container>
    );
};

export default EnrollmentPlanEdit;
