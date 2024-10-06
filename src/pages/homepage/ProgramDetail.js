import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../apiService';

const ProgramDetail = () => {
    const { specializeMajorID } = useParams();
    const [majorInfo, setMajorInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(
                    `/Major/get-admission-major?SpecializeMajorID=${specializeMajorID}`
                );
                setMajorInfo(response.data);
            } catch (error) {
                console.error('Error fetching major data:', error);
            }
        };
        fetchData();
    }, [specializeMajorID]);

    if (!majorInfo) {
        return <p>Đang tải dữ liệu...</p>;
    }

    return (
        <Container className="my-3">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item href="/nganh-hoc">Ngành học</Breadcrumb.Item>
                <Breadcrumb.Item>{majorInfo.majorName}</Breadcrumb.Item>
                <Breadcrumb.Item active href={`/nganh-hoc/${majorInfo.specializeMajorName}`}>{majorInfo.specializeMajorName}</Breadcrumb.Item>
            </Breadcrumb>

            <h1>{majorInfo.specializeMajorName}</h1>
            <div className='mx-5'>
                <h3>Tổng quan ngành {majorInfo.specializeMajorName}:</h3>
                <p>{majorInfo.description || 'Không có mô tả'}</p>

                <h4>Thời gian học tập</h4>
                <p>{majorInfo.timeStudy}</p>

                <h4>Yêu cầu đầu vào</h4>
                {majorInfo.typeAdmissionForMajors?.map((admission, index) => (
                    <p key={index}>
                        <strong>{admission.typeOfDiploma.diplomaName}{admission.typeAcademicRecord?.arName ? ': ' : ''}</strong>
                        {admission.typeAcademicRecord?.arName || ''}
                    </p>
                ))}

                <h4>Cấu trúc chương trình</h4>
                <div className='mx-5'>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Module</th>
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
                                    <td>{subject.note ? subject.note : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p>
                    Thông tin tuyển sinh ngành {majorInfo.specializeMajorName} chi tiết tại{' '}
                    <a href="/tuyen-sinh" className="text-orange">
                        Tuyển sinh
                    </a>
                </p>
            </div>

        </Container>
    );
};

export default ProgramDetail;