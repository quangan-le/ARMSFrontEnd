import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import api from '../../apiService';

const Programs = () => {
    const { selectedCampus } = useOutletContext();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const response = await api.get(`/Major/get-majors?campus=${selectedCampus.id}`);
                setPrograms(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCampus.id) {
            fetchMajors();
        }
    }, [selectedCampus]);

    return (
        <Container className='mt-5'>
            <h1 className="page-title" style={{ color: 'orange', textAlign: 'center' }}>Ngành học</h1>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Ngành học</Breadcrumb.Item>
            </Breadcrumb>
            {loading && <Spinner animation="border" />}
            {error && <p className="text-danger">Lỗi: {error.message}</p>}
            {!loading && !error && (
                <Table striped bordered hover className='mx-5'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên ngành</th>
                            <th>Chuyên ngành</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map((program, index) => (
                            <tr key={program.majorID}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={`/nganh-hoc/${program.majorID}`} className="text-orange">
                                        {program.majorName}
                                    </Link>
                                </td>
                                <td>
                                    <ul className="list-unstyled">
                                        {program.specializeMajorDTOs.map((specialize, idx) => (
                                            <li key={specialize.specializeMajorID}>
                                                <Link to={`/nganh-hoc/${program.majorID}/${specialize.specializeMajorID}`} className="text-muted">
                                                    {specialize.specializeMajorName}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default Programs;
