import FileSaver from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../apiService.js";

const StudentConsultationList = () => {
    const [studentConsultation, setStudentConsultation] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const [selectedType, setSelectedType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const { campusId } = useOutletContext();

    // Major data
    const [vocationalMajors, setVocationalMajors] = useState([]);
    const [collegeMajors, setCollegeMajors] = useState([]);

    // Modal state
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [consultationDetails, setConsultationDetails] = useState({});
    // Enum theo các giá trị của trạng thái
    
    const fetchStudentConsultations = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/admin-officer/StudentConsultation/get-list-student-consultation`, {
                    params: {
                        CampusId: campusId,
                        Search: searchTerm,
                        CurrentPage: currentPage,
                        isVocationalSchool: selectedType || null,
                        Status: selectedStatus || null,
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

    // Fetch vocational and college majors on campus selection
    useEffect(() => {
        const fetchData = async () => {
            if (campusId) {
                try {
                    const [vocationalResponse, collegeResponse] = await Promise.all([
                        api.get(`/Major/get-majors-vocational-school?campus=${campusId}`),
                        api.get(`/Major/get-majors-college?campus=${campusId}`),
                    ]);

                    setVocationalMajors(vocationalResponse.data);
                    setCollegeMajors(collegeResponse.data);
                } catch (error) {
                    console.error("Có lỗi khi lấy dữ liệu ngành:", error);
                }
            }
        };
        fetchData();
    }, [campusId]);

    useEffect(() => {
        fetchStudentConsultations();
    }, [currentPage, campusId, selectedType, searchTerm, selectedStatus]);

    const handleShowDetailModal = (consultation) => {
        setSelectedConsultation(consultation);
        setConsultationDetails({
            ...consultation,
            dateReceive: consultation.dateReceive ? new Date(consultation.dateReceive).toISOString().split("T")[0] : ""
        });
        setShowDetailModal(true);
    };

    const handleShowEditModal = () => {
        setShowDetailModal(false);
        setShowEditModal(true);
    };

    const handleCloseModals = () => {
        setShowDetailModal(false);
        setShowEditModal(false);
        setSelectedConsultation(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Kiểm tra xem nếu name là 'status', chuyển đổi giá trị thành enum
        if (name === 'status') {
            // Chuyển đổi giá trị chuỗi thành enum (giá trị số)
            const statusEnumValue = Number(value);
    
            // Cập nhật trạng thái với giá trị enum
            setConsultationDetails((prevDetails) => ({
                ...prevDetails,
                [name]: statusEnumValue,
            }));
        } else {
            // Nếu không phải là 'status', chỉ cần cập nhật bình thường
            setConsultationDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };
    

    const handleSaveChanges = async () => {
        try {
            await api.put(`/admin-officer/StudentConsultation/update-student-consultation`, {
                ...consultationDetails,
                studentConsultationId: selectedConsultation.studentConsultationId,
                campusId: campusId
            });
            toast.success("Thông tin tư vấn tuyển sinh đã được cập nhật thành công!");
            fetchStudentConsultations();
            handleCloseModals();
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật thông tin:", error);
            toast.error("Cập nhật không thành công, vui lòng thử lại.");
        }
    };
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
            const response = await api.get('/admin-officer/StudentConsultation/download-template', {
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
                    const response = await api.post('/admin-officer/StudentConsultation/upload-excel', formData, {
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
                <Col xs={12} md={5}>
                    <Form.Group className="me-2 d-flex align-items-center">
                        <Form.Control
                            type="text"
                            placeholder="Nhập nội dung tìm kiếm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={7} className="d-flex justify-content-end">
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
                        aria-label="Chọn trạng thái"
                        value={selectedStatus !== null ? selectedStatus : ''}
                        onChange={({ target: { value } }) => {
                            setSelectedStatus(value === "" ? null : value);
                            setCurrentPage(1);
                        }}
                        className="me-2"
                        style={{ width: '200px' }}
                    >
                        <option value="">Trạng thái</option>
                        <option value="0">Tiếp nhận</option>
                        <option value="1">Quan tâm</option>
                        <option value="2">Không quan tâm</option>
                        <option value="3">Không liên lạc được lần 1</option>
                        <option value="4">Không liên lạc được lần 2</option>
                        <option value="5">Không liên lạc được lần 3</option>
                        <option value="6">Gọi lại sau</option>
                    </Form.Select>
                    
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
                        <option value="">Hệ đào tạo</option>
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
                        <th>Xử lý yêu cầu</th>
                    </tr>
                </thead>
                <tbody>
                    {studentConsultation ? (
                        studentConsultation.map((consultation, index) => (
                            <tr key={consultation.studentConsultationId}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td
                                    className="text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleShowDetailModal(consultation)}
                                >
                                    {consultation.fullName}
                                </td>
                                <td>{consultation.phoneNumber}</td>
                                <td>{consultation.email}</td>
                                <td>{consultation.majorName}</td>
                                <td>{consultation.dateReceive}</td>
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

                                <td style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                    <Button
                                        variant="secondary"
                                        className="text-white"
                                        onClick={() => handleShowDetailModal(consultation)}
                                    >
                                        Chi tiết
                                    </Button>
                                    <Button variant="orange"
                                        className="text-white" onClick={handleShowEditModal}>
                                        Chỉnh sửa
                                    </Button>
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

            {/* Detail Modal */}
            <Modal show={showDetailModal} onHide={handleCloseModals} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin chi tiết tư vấn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Họ và tên:</strong> {consultationDetails.fullName}</p>
                    <p><strong>Email:</strong> {consultationDetails.email}</p>
                    <p><strong>Số điện thoại:</strong> {consultationDetails.phoneNumber}</p>
                    <p><strong>Facebook:</strong> {consultationDetails.linkFB}</p>
                    <p><strong>Ngày nhận:</strong> {consultationDetails.dateReceive}</p>
                    <p><strong>Ngành học:</strong> {consultationDetails.majorName}</p>
                    <p><strong>Trạng thái:</strong><span
                                        style={{
                                            color: 
                                            consultationDetails.status === 0
                                            ? "gray"
                                            : consultationDetails.status === 1
                                            ? "green"
                                            : consultationDetails.status === 2
                                            ? "red"
                                            : consultationDetails.status === 3
                                            ? "orange"
                                            : consultationDetails.status === 4
                                            ? "orange"
                                            : consultationDetails.status === 5
                                            ? "orange"
                                            : consultationDetails.status === 6
                                            ? "blue"
                                            : "black",
                                        }}
                                        > {StatusEnum[consultationDetails.status]}
                                        </span>
                                        </p>
                    <p><strong>Ghi chú:</strong> {consultationDetails.notes}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleShowEditModal}>
                        Chỉnh sửa
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={handleCloseModals} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin tư vấn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFullName">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={consultationDetails.fullName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={consultationDetails.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={consultationDetails.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLinkFB">
                            <Form.Label>Link Facebook</Form.Label>
                            <Form.Control
                                type="text"
                                name="linkFB"
                                value={consultationDetails.linkFB}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateReceive">
                            <Form.Label>Ngày nhận</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateReceive"
                                value={consultationDetails.dateReceive}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formMajorID">
                            <Form.Label>Ngành học</Form.Label>
                            <Form.Select
                                name="majorID"
                                value={consultationDetails.majorID}
                                onChange={handleInputChange}
                            >
                                <option value="">Chọn ngành</option>
                                {collegeMajors.length > 0 && (
                                    <optgroup label="Ngành học Cao đẳng">
                                        {collegeMajors.map((major) => (
                                            <option key={major.majorID} value={major.majorID}>
                                                {major.majorName}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {vocationalMajors.length > 0 && (
                                    <optgroup label="Ngành học Trung cấp">
                                        {vocationalMajors.map((major) => (
                                            <option key={major.majorID} value={major.majorID}>
                                                {major.majorName}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                name="status"
                                value={consultationDetails.status}
                                onChange={handleInputChange}
                            >
                                <option value="0">Tiếp nhận</option>
                                <option value="1">Quan tâm</option>
                                <option value="2">Không quan tâm</option>
                                <option value="3">Không liên lạc được lần 1</option>
                                <option value="4">Không liên lạc được lần 2</option>
                                <option value="5">Không liên lạc được lần 3</option>
                                <option value="6">Gọi lại sau</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formNotes">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="notes"
                                rows={3}
                                value={consultationDetails.notes}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StudentConsultationList;
