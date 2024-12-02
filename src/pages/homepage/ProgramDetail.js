import React, { useEffect, useState } from 'react';
import { Breadcrumb, Container, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
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
                console.log(response.data);
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
        <Container className="my-5">
            <h1 className="page-title mb-0" style={{ color: 'orange', textAlign: 'center' }}>Chi tiết ngành học</h1>
            <h4 className="mb-0" style={{ color: 'orange', textAlign: 'center' }}>Ngành {majorInfo.majorName}</h4>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/nganh-hoc">Ngành học</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="text-orange">{majorInfo.majorName}</Breadcrumb.Item>
            </Breadcrumb>

            <div >
                <h4 className='text-orange mt-4'>I. Tổng quan ngành {majorInfo.majorName}:</h4>
                <p>{majorInfo.description || 'Không có mô tả'}</p>
                <li><strong>Mã ngành:</strong> {majorInfo.majorID}</li>
                <li><strong>Mã code:</strong> {majorInfo.majorCode}</li>
                <li><strong>Thời gian học tập:</strong> {majorInfo.timeStudy}</li>
                <li><strong>Học phí:</strong> {majorInfo.tuition.toLocaleString()} VND</li>
                <li><strong>Chỉ tiêu tuyển:</strong> {majorInfo.target} học sinh</li>
                <h4 className='text-orange mt-4'>II. Hình thức xét tuyển</h4>
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
                <h4 className='text-orange mt-4'>III. Điểm xét tuyển</h4>
                <ul>
                    {majorInfo.totalScoreAcademic != null && (
                        <li>
                            <strong>Điểm xét học bạ:</strong> {majorInfo.totalScoreAcademic} điểm
                        </li>
                    )}
                    {majorInfo.totalScore != null && (
                        <li>
                            <strong>Điểm xét thi THPT:</strong> {majorInfo.totalScore} điểm
                        </li>
                    )}
                    {majorInfo.subjectGroupDTOs && majorInfo.subjectGroupDTOs.length > 0 && (
                        <li>
                            <strong>Tổ hợp môn xét tuyển:</strong>
                            <ul>
                                {majorInfo.subjectGroupDTOs.map((group, idx) => (
                                    <li key={idx}>
                                        {group.subjectGroup} - {group.subjectGroupName}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )}
                </ul>
                <h4 className='text-orange mt-4'>IV. Cấu trúc chương trình</h4>
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

                <p>
                    Thông tin tuyển sinh chi tiết tại{' '}
                    <Link to="/tuyen-sinh" className="text-orange">Tuyển sinh</Link>
                </p>
            </div>
        </Container>
    );
};

export default ProgramDetail;
