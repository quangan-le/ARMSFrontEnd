import React from 'react';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const programs = [
    {
        logo: 'path/to/logo1.png',
        name: 'Công nghệ thông tin',
        slug: 'cong-nghe-thong-tin',
        details: [
            { name: 'Kỹ thuật phần mềm', slug: 'ky-thuat-phan-mem' },
            { name: 'An ninh mạng', slug: 'an-ninh-mang' }
        ]
    },
    {
        logo: 'path/to/logo2.png',
        name: 'Quản trị kinh doanh',
        slug: 'quan-tri-kinh-doanh',
        details: [
            { name: 'Quản trị nhân lực', slug: 'quan-tri-nhan-luc' },
            { name: 'Marketing', slug: 'marketing' }
        ]
    }
];
const ProgramCard = ({ logo, name, details, majorFieldSlug }) => ( 
    <Card className="program-card mb-3">
        <Row className="g-0 m-1">
            <Col md={2}>
                <Card.Img src={logo} alt={name} className="program-logo" />
            </Col>
            <Col md={10}>
                <Card.Body>
                    <Card.Title className="program-name">
                        <Link to={`/nganh-hoc/${majorFieldSlug}`} className="text-orange">{name}</Link>
                    </Card.Title>
                    <ul className="program-details">
                        {details.map((detail, index) => (
                            <li key={index}>
                                <Link to={`/nganh-hoc/${majorFieldSlug}/${detail.slug}`} className="text-muted">
                                    {detail.name}
                                </Link>
                            </li>
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
                majorFieldSlug={program.slug}
                details={program.details}
            />
        ))}
    </Container>
);

export default Programs;