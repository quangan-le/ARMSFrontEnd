import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Table, Spinner } from 'react-bootstrap';
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
                // Gọi API cho từng cấp học, ví dụ Vocational và College
                const [collegeResponse, vocationalResponse] = await Promise.all([
                    api.get(`/Major/get-majors-college?campus=${selectedCampus.id}`),
                    api.get(`/Major/get-majors-vocational-school?campus=${selectedCampus.id}`)
                ]);
                setPrograms([...collegeResponse.data, ...vocationalResponse.data]);
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
            <div className="table-container">
                {loading && <Spinner animation="border" />}
                {error && <p className="text-danger">Lỗi: {error.message}</p>}
                {!loading && !error && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="text-center">STT</th>
                                <th className="text-center">Tên ngành</th>
                                <th className="text-center">Mã ngành</th>
                                {/* <th className="text-center">Học phí</th>
                                <th className="text-center">Chỉ tiêu</th>
                                <th className="text-center">Thời gian học</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map((program, index) => (
                                <tr key={program.majorID}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>{program.majorName}</td>
                                    <td>{program.majorCode}</td>
                                    {/* <td>{program.tuition.toLocaleString()} VND</td>
                                    <td>{program.target}</td>
                                    <td>{program.timeStudy}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </Container>
    );
};

export default Programs;
