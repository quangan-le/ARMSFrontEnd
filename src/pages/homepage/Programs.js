import React, { useEffect, useState } from 'react';
import { Breadcrumb, Container, Spinner, Table } from 'react-bootstrap';
import { Link, useOutletContext } from 'react-router-dom'; // Thêm Link
import api from '../../apiService';

const Programs = () => {
    const { selectedCampus } = useOutletContext();
    const [collegePrograms, setCollegePrograms] = useState([]);
    const [vocationalPrograms, setVocationalPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMajors = async () => {
            try {
                setLoading(true);
                const [collegeResponse, vocationalResponse] = await Promise.all([
                    api.get(`/Major/get-majors-college?campus=${selectedCampus.id}`),
                    api.get(`/Major/get-majors-vocational-school?campus=${selectedCampus.id}`)
                ]);
                
                setCollegePrograms(collegeResponse.data);
                setVocationalPrograms(vocationalResponse.data);
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
            <div className="table-container">
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">Ngành học</Breadcrumb.Item>
            </Breadcrumb>
                {loading && <Spinner animation="border" />}
                {error && <p className="text-danger">Lỗi: {error.message}</p>}

                {!loading && !error && (
                    <>
                        <h4 className='text-orange mt-4'>I. Chương trình Cao đẳng</h4>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className="text-center">STT</th>
                                    <th className="text-center">Tên ngành</th>
                                    <th className="text-center">Mã ngành</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collegePrograms.map((program, index) => (
                                    <tr key={program.majorID}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>
                                            <Link to={`/nganh-hoc/${program.majorID}/${program.admissionInformationID}`} className="text-decoration-none">
                                                {program.majorName}
                                            </Link>
                                        </td>
                                        <td>{program.majorCode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <h4 className='text-orange mt-4'>II. Chương trình Trung cấp</h4>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className="text-center">STT</th>
                                    <th className="text-center">Tên ngành</th>
                                    <th className="text-center">Mã ngành</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vocationalPrograms.map((program, index) => (
                                    <tr key={program.majorID}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>
                                            <Link to={`/nganh-hoc/${program.majorID}/${program.admissionInformationID}`} className="text-decoration-none">
                                                {program.majorName}
                                            </Link>
                                        </td>
                                        <td>{program.majorCode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </div>
        </Container>
    );
};

export default Programs;
