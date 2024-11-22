import React, { useState } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';

const PlanAdmissionDetail = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentSection, setCurrentSection] = useState(null); // Xác định modal nào đang mở (I, II, hoặc III)

    // Mock data
    const admissionInfo = {
        year: '2024',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        fee: '500,000 VND',
        enrollmentMethod: 'Online & Offline',
    };

    const admissionRounds = [
        { id: 1, name: 'Đợt 1', startDate: '2024-01-01', endDate: '2024-03-31' },
        { id: 2, name: 'Đợt 2', startDate: '2024-04-01', endDate: '2024-06-30' },
    ];

    const admissionMajors = [
        { id: 1, code: 'CNTT', quantity: 50, status: 'Mở' },
        { id: 2, code: 'QTKD', quantity: 40, status: 'Đóng' },
    ];

    // Handle Modal
    const handleShowEditModal = (section) => {
        setCurrentSection(section); // Xác định modal nào mở
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentSection(null);
    };

    return (
        <Container>
            <h2 className="text-center text-orange fw-bold mb-4">Chi tiết hoạch tuyển sinh</h2>

            <h4 className='text-orange mt-4'>I. Thông tin</h4>
            <Row>
                <Col md={10}>
                    <p><strong>Năm:</strong> {admissionInfo.year}</p>
                    <p><strong>Thời gian bắt đầu:</strong> {admissionInfo.startDate}</p>
                    <p><strong>Thời gian kết thúc:</strong> {admissionInfo.endDate}</p>
                    <p><strong>Lệ phí:</strong> {admissionInfo.fee}</p>
                    <p><strong>Hình thức nhập học:</strong> {admissionInfo.enrollmentMethod}</p>
                </Col>
                <Col md={2}>
                    <Button variant="warning" onClick={() => handleShowEditModal('I')}>
                        Chỉnh sửa
                    </Button>
                </Col>
            </Row>
            <h4 className='text-orange mt-4'>II. Đợt tuyển sinh</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Đợt</th>
                        <th>Thời gian bắt đầu tuyển</th>
                        <th>Thời gian kết thúc tuyển</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionRounds.map((round, index) => (
                        <tr key={round.id}>
                            <td>{index + 1}</td>
                            <td>{round.name}</td>
                            <td>{round.startDate}</td>
                            <td>{round.endDate}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowEditModal('II')}>
                                    Sửa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4 className='text-orange mt-4'>III. Ngành tuyển</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã ngành</th>
                        <th>Số lượng tuyển</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionMajors.map((major, index) => (
                        <tr key={major.id}>
                            <td>{index + 1}</td>
                            <td>{major.code}</td>
                            <td>{major.quantity}</td>
                            <td>{major.status}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowEditModal('III')}>
                                    Sửa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal chỉnh sửa */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {currentSection === 'I' && 'Chỉnh sửa Thông tin'}
                        {currentSection === 'II' && 'Chỉnh sửa Đợt tuyển sinh'}
                        {currentSection === 'III' && 'Chỉnh sửa Ngành tuyển'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentSection === 'I' && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Năm:</Form.Label>
                                <Form.Control type="text" defaultValue={admissionInfo.year} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian bắt đầu:</Form.Label>
                                <Form.Control type="date" defaultValue={admissionInfo.startDate} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian kết thúc:</Form.Label>
                                <Form.Control type="date" defaultValue={admissionInfo.endDate} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Lệ phí:</Form.Label>
                                <Form.Control type="text" defaultValue={admissionInfo.fee} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Hình thức nhập học:</Form.Label>
                                <Form.Control type="text" defaultValue={admissionInfo.enrollmentMethod} />
                            </Form.Group>
                        </Form>
                    )}
                    {currentSection === 'II' && (
                        <p>Form chỉnh sửa Đợt tuyển sinh sẽ hiển thị ở đây.</p>
                    )}
                    {currentSection === 'III' && (
                        <p>Form chỉnh sửa Ngành tuyển sẽ hiển thị ở đây.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Đóng
                    </Button>
                    <Button variant="primary">Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PlanAdmissionDetail;
