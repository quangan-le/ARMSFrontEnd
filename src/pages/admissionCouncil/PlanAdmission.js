import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";

const PlanAdmission = () => {
    const [search, setSearchTerm] = useState('');
    const [admissionInformations, setAdmissionInformations] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const majorsPerPage = 10;
    const { campusId } = useOutletContext();

    const fetchAdmissionInformations = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/admission-council/AdmissionInformation/get-admission-information`, {
                    params: {
                        CampusId: campusId
                    },
                });
                 setAdmissionInformations(response.data);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách ngành học:", error);
        }
    };
    const [showModal, setShowModal] = useState(false);
    const [selectedMajors, setSelectedMajors] = useState(null);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMajors(null);
    };
    const handleShowModal = async (major) => {
        try {
            
            const response = await api.get(`/school-service/Major/get-major-details?MajorId=${major.majorID}`);
            const majorData = response.data;
            
            setSelectedMajors(majorData);
            setShowModal(true);
            
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu bài viết:', error);
        }
    };
    useEffect(() => {
        fetchAdmissionInformations();
    }, [campusId]);


    return (
        <Container>
            <h2 className="text-center text-orange fw-bold">Kế hoạch tuyển sinh các năm</h2>
            <p className="text-center mb-4 text-orange fw-bold">Các kế hoạch tuyển sinh thuộc campus</p>
            <Col className="d-flex justify-content-end">

                <Button
                    variant="orange"
                    className="text-white my-2"
                >
                    Thêm mới
                </Button>
                </Col>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Năm</th>
                        <th>Bắt đầu tuyển sinh</th>
                        <th>Kết thúc tuyển sinh</th>
                        <th>Lệ phí xét tuyển</th>
                        <th>Lệ phí nhập học</th>
                        <th>Trạng thái tuyển sinh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                {admissionInformations && admissionInformations.length > 0 ? (
                        admissionInformations.map((admissionInformation, index) => (
                            <tr key={admissionInformation.majorID}>
                                <td className="text-center fw-bold">{index+1}</td>
                                <td>{admissionInformation.year}</td>
                                <td>{new Date(admissionInformation.startAdmission).toLocaleDateString('en-GB')}</td>
                                <td>{new Date(admissionInformation.endAdmission).toLocaleDateString('en-GB')}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(admissionInformation.feeRegister)}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(admissionInformation.feeAdmission)}</td>
                                <td
                                style={{
                                    color: admissionInformation.status === 1
                                    ? "green"
                                    : admissionInformation.status === 0
                                    ? "red"  
                                    : admissionInformation.status === 2
                                    ? "blue" 
                                    : "black"
                                }}
                                >
                                {admissionInformation.status === 1
                                    ? "Đang tuyển"
                                    : admissionInformation.status === 0
                                    ? "Ngưng tuyển"
                                    : admissionInformation.status === 2
                                    ? "Chưa tuyển"
                                    : "Trạng thái không xác định"}
                                </td>
                                <td>
                                <td>
                                    <Button
                                        variant="orange"
                                        className="text-white"
                                        style={{ whiteSpace: 'nowrap', marginRight: '10px' }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                    <Button
                                        variant="orange"
                                        className="text-white"
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    </td>

                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                Không có ngành học nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
           

        </Container>
    );
};

export default PlanAdmission;