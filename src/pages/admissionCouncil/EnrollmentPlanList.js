import React, { useState } from "react";
import { Container, Table, Form, Button, Row, Col } from "react-bootstrap";

const EnrollmentPlanList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState("2024");

    // Dummy data for the table
    const admissionsData = [
        { id: 1, batch: "Đợt 1", year: "2024", startRegister: "01/08/2023", endRegister: "01/03/2024", startAdmission: "01/04/2024", endAdmission: "30/04/2024" },
        { id: 2, batch: "Đợt 2", year: "2024", startRegister: "01/08/2023", endRegister: "01/03/2024", startAdmission: "01/04/2024", endAdmission: "30/04/2024" },
        { id: 3, batch: "Đợt 3", year: "2024", startRegister: "01/08/2023", endRegister: "01/03/2024", startAdmission: "01/04/2024", endAdmission: "30/04/2024" }
    ];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleAddNew = () => {
        // Add logic to open a modal or navigate to a new page for adding a new admissions plan
    };

    const handleEdit = (id) => {
        // Add logic to handle edit action, e.g., open a modal with form fields to edit the specific plan
    };

    return (
        <Container>
            <h2 className="text-center mb-4">Kế hoạch tuyển sinh</h2>
            <Row className="mb-3">
                <Col xs={6} md={4} className="d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                    <Form.Label className="mb-0 me-2">Tìm kiếm:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập nội dung tìm kiếm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col xs={6} md={2} className="d-flex align-items-center">
                    <Form.Select value={selectedYear} onChange={handleYearChange}>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        {/* Add more years as needed */}
                    </Form.Select>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button onClick={handleAddNew}>Thêm mới</Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Đợt</th>
                        <th>Năm</th>
                        <th>Start Register</th>
                        <th>End Register</th>
                        <th>Start Admission</th>
                        <th>End Admission</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionsData
                        .filter((plan) => plan.year === selectedYear)
                        .map((plan, index) => (
                            <tr key={plan.id}>
                                <td>{index + 1}</td>
                                <td>{plan.batch}</td>
                                <td>{plan.year}</td>
                                <td>{plan.startRegister}</td>
                                <td>{plan.endRegister}</td>
                                <td>{plan.startAdmission}</td>
                                <td>{plan.endAdmission}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEdit(plan.id)}>Chỉnh sửa</Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default EnrollmentPlanList;
