import React from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const MajorDetail = () => {
    const { majorId } = useParams();

    // Dummy data for demonstration purposes
    const majorData = {
        code: "HWE",
        name: "Công nghệ thông tin",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        enrollmentQuota: 200,
        requirements: [
            "- Tốt nghiệp THCS",
            "- Tốt nghiệp THPT",
            "- Xét học bạ THPT (Xét học ba 3 năm)"
        ],
        subjects: [
            { id: 1, code: "GDQP", name: "Giáo dục quốc phòng", semester: 0, credits: 3 },
            { id: 2, code: "ENG1", name: "Tiếng anh 1", semester: 0, credits: 3 },
            { id: 3, code: "ENG2", name: "Tiếng anh 2", semester: 0, credits: 3 },
            { id: 4, code: "PRF", name: "Nhập môn lập trình", semester: 1, credits: 3 }
        ]
    };


    return (
        <Container>
            <h2 className="text-center">Chi tiết ngành học</h2>
            <h5 className="text-center mb-4">{majorData.name}</h5>
            <Row>
                <Col md={12}>
                    <p><strong>Mã ngành:</strong> {majorData.code}</p>
                    <p><strong>Tên ngành học:</strong> {majorData.name}</p>
                    <p><strong>Mô tả:</strong> {majorData.description}</p>
                    <p><strong>Chỉ tiêu:</strong> {majorData.enrollmentQuota}</p>
                    <p><strong>Yêu cầu:</strong></p>
                    <ul>
                        {majorData.requirements.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                        ))}
                    </ul>
                </Col>
            </Row>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã môn</th>
                        <th>Tên môn</th>
                        <th>Kỳ học</th>
                        <th>Số tín chỉ</th>
                    </tr>
                </thead>
                <tbody>
                    {majorData.subjects.map((subject, index) => (
                        <tr key={subject.id}>
                            <td>{index + 1}</td>
                            <td>{subject.code}</td>
                            <td>{subject.name}</td>
                            <td>{subject.semester}</td>
                            <td>{subject.credits}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="text-center mt-4">
                <Button variant="primary">Chỉnh sửa</Button>
            </div>
        </Container>
    );
};

export default MajorDetail;
