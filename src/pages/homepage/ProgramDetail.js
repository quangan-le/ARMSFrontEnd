import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../apiService';

const ProgramDetail = () => {
    const { majorID } = useParams();
    const [majorInfo, setMajorInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(
                    `/Major/get-major-details?MajorId=${majorID}`
                );
                setMajorInfo(response.data);
            } catch (error) {
                console.error('Error fetching major data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [majorID]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (!majorInfo) {
        return <p>Không có dữ liệu ngành học.</p>;
    }

    return (
        <Container className="my-3">
            <h1 className="page-title mb-0" style={{ color: 'orange', textAlign: 'center' }}>{majorInfo.majorName}</h1>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item href="/nganh-hoc">Ngành học</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">{majorInfo.majorName}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="table-container">
                <h4 className='text-orange mt-4'>I. Tổng quan ngành {majorInfo.majorName}:</h4>
                <p>{majorInfo.description || 'Không có mô tả'}</p>
                <p>• Thời gian học tập: {majorInfo.timeStudy}</p>
                <p>• Học phí: {majorInfo.tuition.toLocaleString()} VND</p>
                <p>• Chỉ tiêu tuyển sinh: {majorInfo.target}</p>
                <h4 className='text-orange mt-4'>II. Cấu trúc chương trình</h4>
                <div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Môn học</th>
                                <th>Thời gian/Số học phần</th>
                                <th>Số tín chỉ</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {majorInfo.subjects.map((subject, index) => (
                                <tr key={subject.subjectCode}>
                                    <td>{index + 1}</td>
                                    <td>{subject.subjectName}</td>
                                    <td>{subject.studyTime}</td>
                                    <td>{subject.numberOfCredits}</td>
                                    <td>{subject.note || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p>
                    Thông tin tuyển sinh ngành {majorInfo.majorName} chi tiết tại{' '}
                    <a href="/tuyen-sinh" className="text-orange">
                        Tuyển sinh
                    </a>
                </p>
            </div>
        </Container>
    );
};

export default ProgramDetail;
