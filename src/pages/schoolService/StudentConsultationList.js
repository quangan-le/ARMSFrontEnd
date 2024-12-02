
import FileSaver from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../apiService.js";


const StudentConsultation = () => {
    const [studentConsultation, setStudentConsultation] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const [selectedType, setSelectedType] = useState("");
    const { campusId } = useOutletContext();

    // Major data
    const [vocationalMajors, setVocationalMajors] = useState([]);
    const [collegeMajors, setCollegeMajors] = useState([]);

    // Modal state
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [consultationDetails, setConsultationDetails] = useState({});

    const fetchStudentConsultations = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/SchoolService/StudentConsultation/get-list-student-consultation`, {
                    params: {
                        CampusId: campusId,
                        Search: searchTerm,
                        CurrentPage: currentPage,
                        isVocationalSchool: selectedType || null,
                    },
                });
                console.log(response.data);
                setStudentConsultation(response.data.item);
                setTotalPages(response.data.pageCount);
                setTotalItems(response.data.totalItems);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách tư vấn tuyển sinh:", error);
        }
    };

    useEffect(() => {
        fetchStudentConsultations();
    }, [currentPage, campusId, selectedType, searchTerm]);

    const StatusEnum = {
        0: "Tiếp nhận",
        1: "Quan tâm",
        2: "Không quan tâm",
        3: "Không liên lạc được lần 1",
        4: "Không liên lạc được lần 2",
        5: "Không liên lạc được lần 3",
        6: "Gọi lại sau"
    };
    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/SchoolService/StudentConsultation/download-template', {
                responseType: 'blob',
            });
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1]
                : 'template.xlsx';

            FileSaver.saveAs(response.data, filename);
        } catch (error) {
            toast.error("Lỗi khi tải template!");
        }
    };
    
    const handleUploadFile = () => {
        // Dynamically create a file input element
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = '.xlsx, .xls'; // Restrict file selection to Excel files
    
        // Handle the file selection and upload
        inputFile.onchange = async (event) => {
            const file = event.target.files[0]; // Get the selected file
    
            if (file) {
                try {
                    // Prepare the file for upload
                    const formData = new FormData();
                    formData.append('file', file);
    
                    // Send the file using POST
                    const response = await api.post('/SchoolService/StudentConsultation/upload-excel', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        responseType: 'blob', // Expecting a file response
                    });
                    const text = await response.data.text(); // Đọc nội dung từ Blob nếu có

                    // Kiểm tra xem phản hồi có phải là file Excel không (kiểm tra Content-Type hoặc Content-Disposition)
                    if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        // Create a URL for the blob and trigger download
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        
                        // Set filename from response headers or a default filename
                        const contentDisposition = response.headers['content-disposition'];
                        const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'errors.xlsx';
                        
                        // Trigger download
                        link.setAttribute('download', fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        toast.warning(`Upload file hoàn thành! Vui lòng kiểm tra lại các dữ liệu gặp lỗi!`);
                    } else {
                        // Nếu không phải file, xử lý dưới dạng JSON
                        const jsonResponse = JSON.parse(text);
                        
                        if (jsonResponse.totalErrors === 0) {
                            toast.success(`Upload file hoàn thành!`);
                        } else {
                            toast.warning(`Có lỗi xảy ra trong quá trình tải lên: ${jsonResponse.totalErrors} lỗi.`);
                        }
                    }

                    fetchStudentConsultations();
                } catch (error) {
                    toast.error("Đã sảy ra lỗi trong quá trình upload file!");
                    
                }
            } else {
                toast.error("Vui lòng chọn file và thử lại!");
            }
        };
    
        // Trigger the file input dialog
        inputFile.click();
    };
    
    
    return (
        <div className="me-3">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách đăng ký tư vấn</h2>
            <p className="text-center mb-4 text-orange fw-bold">Yêu cầu đăng ký tư vấn tuyển sinh cho học sinh </p>
            {/* Search and Filter */}
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Form.Group className="me-2 d-flex align-items-center">
                        <Form.Control
                            type="text"
                            placeholder="Nhập nội dung tìm kiếm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                <Button
                    variant="primary"
                    className="text-white me-2"
                    onClick={handleDownloadTemplate} // Hàm xử lý tải xuống
                >
                    Tải template
                </Button>
                <Button
                    variant="orange"
                    className="text-white me-2"
                    onClick={handleUploadFile} // Hàm xử lý tải lên
                >
                    Tải lên file
                </Button>
                    <Form.Select
                        aria-label="Chọn loại"
                        value={selectedType !== null ? selectedType : ''}
                        onChange={({ target: { value } }) => {
                            setSelectedType(value === "" ? null : value);
                            setCurrentPage(1);
                        }}
                        className="me-2"
                        style={{ width: '200px' }}
                    >
                        <option value="">Tất cả</option>
                        <option value={true}>Trung cấp</option>
                        <option value={false}>Cao đẳng</option>
                    </Form.Select>
                </Col>
            </Row>
            {/* Table of Consultations */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Ngành học</th>
                        <th>Ngày gửi yêu cầu</th>
                        <th>Trạng thái yêu cầu</th>
                    </tr>
                </thead>
                <tbody>
                    {studentConsultation ? (
                        studentConsultation.map((consultation, index) => (
                            <tr key={consultation.studentConsultationId}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>
                                    {consultation.fullName}
                                </td>
                                <td>{consultation.phoneNumber}</td>
                                <td>{consultation.email}</td>
                                <td>{consultation.majorName}</td>
                                <td>{new Date(consultation?.dateReceive).toLocaleDateString()}</td>
                                <td
                                    style={{
                                        color: 
                                        consultation.status === 0
                                            ? "gray"
                                            : consultation.status === 1
                                            ? "green"
                                            : consultation.status === 2
                                            ? "red"
                                            : consultation.status === 3
                                            ? "orange"
                                            : consultation.status === 4
                                            ? "orange"
                                            : consultation.status === 5
                                            ? "orange"
                                            : consultation.status === 6
                                            ? "blue"
                                            : "black",
                                    }}
                                    >
                                    {StatusEnum[consultation.status]}
                                    </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                Không có yêu cầu nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {/* Pagination */}
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} yêu cầu
                </span>
                {totalPages > 1 && (
                    <Pagination>
                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    </Pagination>
                )}
            </div>

        </div>
    );
};

export default StudentConsultation;

