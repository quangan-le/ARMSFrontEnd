import React, { useState } from 'react';
import { Container, Breadcrumb, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";

const RequestForWithdraw = () => {
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <Container className='mt-5'>
            <h1 className="page-title text-center" style={{ color: 'orange' }}>Yêu cầu rút hồ sơ nhập học</h1>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Yêu cầu rút hồ sơ</Breadcrumb.Item>
            </Breadcrumb>
            <div className="text-end mb-3">
                <Button variant="warning" onClick={handleShow}>
                    Tạo đơn
                </Button>
            </div>
            <Table striped bordered hover className='mb-5'>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Nội dung</th>
                        <th>Đơn rút hồ sơ</th>
                        <th>Thời gian tạo đơn</th>
                        <th>Trạng thái đơn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Em muốn rút hồ sơ nhập học</td>
                        <td>RutHoSo.docx</td>
                        <td>01/10/2024</td>
                        <td style={{ color: 'red' }}>Từ chối</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Em muốn rút hồ sơ nhập học</td>
                        <td>RutHoSo.docx</td>
                        <td>01/10/2024</td>
                        <td style={{ color: 'green' }}>Chấp nhận</td>
                    </tr>
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center" style={{ color: 'orange' }}>Tạo đơn rút hồ sơ nhập học</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Họ và tên</Form.Label>
                            </Col>
                            <Col md={9}>
                                <div>Quang An</div>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Ngành học</Form.Label>
                            </Col>
                            <Col md={9}>
                                <div>Công nghệ thông tin</div>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Chuyên ngành</Form.Label>
                            </Col>
                            <Col md={9}>
                                <div>Kỹ thuật phần mềm</div>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Label>Đơn xin rút hồ sơ</Form.Label>
                            </Col>
                            <Col md={9}>
                                <Form.Control type="file" required />
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col md={3}>
                                <Form.Label>Lý do rút hồ sơ</Form.Label>
                            </Col>
                            <Col md={9}>
                                <Form.Control as="textarea" rows={3} placeholder="Nhập lý do" required />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 9, offset: 3 }} className='d-flex'>
                                <div className='me-2'> Download đơn xin rút hồ sơ</div>
                                <a href="/" style={{ textDecoration: 'underline', color: 'blue' }}>
                                    Tại đây
                                </a>
                            </Col>
                        </Row>
                        <Form.Group as={Row} className="mb-3 text-center">
                            <Col md={12}>
                                <Button variant="warning" className="mt-3">
                                    Gửi đơn
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default RequestForWithdraw;
