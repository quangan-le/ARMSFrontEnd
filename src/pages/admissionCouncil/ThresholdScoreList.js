import React, { useState } from "react";
import { Container, Table, Form, Button, Row, Col, Modal } from "react-bootstrap";

const ThresholdScoreList = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);

    // Dummy data for the table
    const programsData = [
        { id: 1, code: "SE", name: "Công nghệ thông tin", quota: 1300, status: "Đang tuyển sinh" },
        { id: 2, code: "SE", name: "Công nghệ thông tin", quota: 1300, status: "Đang tuyển sinh" },
        { id: 3, code: "SE", name: "Công nghệ thông tin", quota: 1300, status: "Đang tuyển sinh" },
        { id: 4, code: "SE", name: "Công nghệ thông tin", quota: 1300, status: "Đang tuyển sinh" },
        { id: 5, code: "SE", name: "Công nghệ thông tin", quota: 1300, status: "Đang tuyển sinh" },
    ];

    const handleEdit = (program) => {
        setSelectedProgram(program);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedProgram(null);
    };

    const handleSaveChanges = () => {
        // Logic to save changes to the selected program
        console.log("Saved program:", selectedProgram);
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedProgram({ ...selectedProgram, [name]: value });
    };

    return (
        <Container>
            <h2 className="text-center mb-4">Ngành học</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã Ngành</th>
                        <th>Tên Ngành Học</th>
                        <th>Chỉ tiêu</th>
                        <th>Trạng thái</th>
                        <th>Thông tin tuyển sinh</th>
                    </tr>
                </thead>
                <tbody>
                    {programsData.map((program, index) => (
                        <tr key={program.id}>
                            <td>{index + 1}</td>
                            <td>{program.code}</td>
                            <td>{program.name}</td>
                            <td>{program.quota}</td>
                            <td>{program.status}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(program)}>
                                    Chỉnh sửa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Editing Enrollment Program */}
            {selectedProgram && (
                <Modal show={showModal} onHide={handleModalClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Thông tin tuyển sinh</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={3}>Mã ngành</Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        name="code"
                                        value={selectedProgram.code}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={3}>Tên ngành học</Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={selectedProgram.name}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={3}>Trạng thái tuyển sinh</Form.Label>
                                <Col sm={9}>
                                    <Form.Check
                                        type="radio"
                                        label="Tuyển sinh"
                                        name="status"
                                        value="Tuyển sinh"
                                        checked={selectedProgram.status === "Tuyển sinh"}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Ngừng tuyển sinh"
                                        name="status"
                                        value="Ngừng tuyển sinh"
                                        checked={selectedProgram.status === "Ngừng tuyển sinh"}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={3}>Chỉ tiêu</Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="number"
                                        name="quota"
                                        value={selectedProgram.quota}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={3}>Yêu cầu</Form.Label>
                                <Col sm={9}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Tốt nghiệp THPT hoặc bổ túc (Bằng điểm 3 năm)"
                                        name="requirement"
                                    />
                                    {/* Add other requirement checkboxes as needed */}
                                </Col>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Thoát
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Chỉnh sửa
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default ThresholdScoreList;