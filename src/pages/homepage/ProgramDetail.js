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
            <h1 className="page-title mb-0" style={{ color: 'orange', textAlign: 'center' }}>Chi tiết ngành học</h1>
            <h4 className="mb-0" style={{ color: 'orange', textAlign: 'center' }}>Ngành {majorInfo.majorName}</h4>
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
                                <th>Mã ngành</th>
                                <th>Kỳ học</th>
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
                                    <td>{subject.subjectCode}</td>
                                    <td>{subject.semesterNumber}</td>
                                    <td>{subject.studyTime}</td>
                                    <td>{subject.numberOfCredits}</td>
                                    <td>{subject.note || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h4 className='text-orange mt-4'>III. Hình thức xét tuyển</h4>
                <ul>
                    {majorInfo.typeAdmissions.map((admission, index) => (
                        <li key={index}>
                            {admission.typeDiploma === 0 && 'Tốt nghiệp THCS'}
                            {admission.typeDiploma === 1 && 'Tốt nghiệp THPT'}
                            {admission.typeDiploma === 2 && 'Tốt nghiệp Cao đẳng/Đại học'}
                            {admission.typeDiploma === 3 && 'Xét học bạ THPT'}
                            {admission.typeDiploma === 4 && 'Liên thông'}
                            {admission.typeDiploma === 5 && 'Xét điểm thi THPT'}
                            {admission.typeOfTranscript != null && (
                                <span> -
                                    {admission.typeOfTranscript === 0 && ' Xét học bạ lớp 12'}
                                    {admission.typeOfTranscript === 1 && ' Xét học bạ 3 năm'}
                                    {admission.typeOfTranscript === 2 && ' Xét học bạ lớp 10, lớp 11 và HK1 lớp 12'}
                                    {admission.typeOfTranscript === 3 && ' Xét học bạ 5 kỳ'}
                                    {admission.typeOfTranscript === 4 && ' Xét học bạ 3 kỳ'}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
                <h4 className='text-orange mt-4'>IV. Điểm xét tuyển</h4>
                <ul>
                    {majorInfo.admissionDetailForMajors.map((admission, index) => (
                        <li key={index}>
                             {admission.statusScoreAcademic && (
                                <div>
                                    <strong>Điểm xét học bạ:</strong> {admission.totalScoreAcademic}
                                </div>
                            )}
                            {admission.statusScore && (
                                <div>
                                    <strong>Điểm xét thi THPT:</strong> {admission.totalScore}
                                </div>
                            )}
                            {admission.subjectGroupDTOs && admission.subjectGroupDTOs.length > 0 && (
                                <div>
                                    <strong>Tổ hợp môn xét tuyển:</strong>
                                    <ul>
                                        {admission.subjectGroupDTOs.map((group, idx) => (
                                            <li key={idx}>
                                                {group.subjectGroup} - {group.subjectGroupName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
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
