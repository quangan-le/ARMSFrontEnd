import React from 'react';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';

const programs = [
    {
        logo: 'https://fita.vnua.edu.vn/wp-content/uploads/2024/05/Hoc-cong-nghe-thong-tin.jpg',
        name: 'Công Nghệ Thông Tin',
        details: ['Phát triển phần mềm', 'An ninh mạng', 'Hệ thống thông tin'],
    },
    {
        logo: 'https://cdn.tuoitre.vn/thumb_w/480/471584752817336320/2023/7/20/photo-1689837947711-1689837947850191398087.jpg',
        name: 'Cơ Khí',
        details: ['Kỹ thuật chế tạo', 'Kỹ thuật tự động hóa', 'Thiết kế cơ khí'],
    },
];

const ProgramCard = ({ logo, name, details }) => (
    <Card className="program-card mb-3">
        <Row className="g-0 m-1">
            <Col md={2}>
                <Card.Img src={logo} alt={name} className="program-logo" />
            </Col>
            <Col md={10}>
                <Card.Body>
                    <Card.Title className="program-name">{name}</Card.Title>
                    <ul className="program-details">
                        {details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                        ))}
                    </ul>
                </Card.Body>
            </Col>
        </Row>
    </Card>
);

const Programs = () => (

    <Container className='mt-5'>
        <h1 className="page-title">Ngành học</h1>
        <Breadcrumb>
            <Breadcrumb.Item href="/" className="text-orange">Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item active className="text-orange">Ngành học</Breadcrumb.Item>
        </Breadcrumb>
        {programs.map((program, index) => (
            <ProgramCard
                key={index}
                logo={program.logo}
                name={program.name}
                details={program.details}
            />
        ))}
    </Container>
);

export default Programs;