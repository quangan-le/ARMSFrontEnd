import React from 'react';
import { Container, Breadcrumb, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const programs = [
    {
      name: "Ngành A",
      majorFieldSlug: "nganh-a",
      details: [
        { name: "Chuyên ngành 1", slug: "chuyen-nganh-1", code: "MA001" },
      ],
    },
    {
      name: "Ngành B",
      majorFieldSlug: "nganh-b",
      details: [
        { name: "Chuyên ngành 3", slug: "chuyen-nganh-3", code: "MB001" },
      ],
    },
  ];
  
  const Programs = () => {
    return (
        <Container className='mt-5'>
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Ngành học</h1>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Ngành học</Breadcrumb.Item>
            </Breadcrumb>
            <Table striped bordered hover className='mx-5'>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Ngành</th>
                        <th>Chuyên Ngành</th>
                        <th>Mã Ngành</th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((program, index) => (
                        <tr key={program.majorFieldSlug}>
                            <td>{index + 1}</td>
                            <td>
                                <Link to={`/nganh-hoc/${program.majorFieldSlug}`} className="text-orange">
                                    {program.name}
                                </Link>
                            </td>
                            <td>
                                <ul className="list-unstyled">
                                    {program.details.map((detail, idx) => (
                                        <li key={idx}>
                                            <Link to={`/nganh-hoc/${program.majorFieldSlug}/${detail.slug}`} className="text-muted">
                                                {detail.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                {program.details.map((detail) => (
                                    <div key={detail.slug}>{detail.code}</div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>


    );
};

export default Programs;