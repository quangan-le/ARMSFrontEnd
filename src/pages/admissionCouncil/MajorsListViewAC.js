import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useOutletContext } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import api from "../../apiService.js";
import subjectGroups from './SubjectGroups.js';

const MajorsListViewAC = () => {
    const [search, setSearchTerm] = useState('');
    const [majors, setMajors] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [majorsPerPage, setMajorsPerPage] = useState(0);
    const { campusId } = useOutletContext();
    const [selectedBlocks, setSelectedBlocks] = useState([]);

    const getDiplomaName = (typeDiploma) => {
        switch (typeDiploma) {
            case 0: return "Tốt nghiệp THCS";
            case 1: return "Tốt nghiệp THPT";
            case 2: return "Tốt nghiệp CĐ/ĐH";
            case 3: return "Xét học bạ THPT";
            case 4: return "Liên thông";
            case 5: return "Xét điểm thi THPT";
            default: return "Khác";
        }
    };
    const getTranscriptName = (typeOfTranscript) => {
        switch (typeOfTranscript) {
            case 0: return "Xét học bạ 12";
            case 1: return "Xét học bạ 3 năm";
            case 2: return "Xét học bạ lớp 10, lớp 11, HK1 lớp 12";
            case 3: return "Xét học bạ 5 kỳ";
            case 4: return "Xét học bạ 3 kỳ";
            default: return null;
        }
    };
    // Gọi API để lấy danh sách các majors theo điều kiện tìm kiếm
    const fetchMajors = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/admission-council/Major/get-majors`, {
                    params: {
                        CampusId: campusId,
                        Search: search,
                        CurrentPage: currentPage,
                        College: selectedCollege || null,
                    },
                });
                setMajors(response.data.item);
                setTotalPages(response.data.pageCount);
                setTotalItems(response.data.totalItems);
                setMajorsPerPage(response.data.pageSize);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách ngành học:", error);
        }
    };
    const [showModal, setShowModal] = useState(false);
    const [selectedMajors, setSelectedMajors] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMajors(null);
        setIsEditMode(false);
    };
    // State lưu id môn học đã chọn
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const handleShowModal = async (major) => {
        try {
            const response = await api.get(`/admission-council/Major/get-major-details?MajorId=${major.majorID}`);
            const majorData = response.data;
            setSelectedMajors(majorData);

            // Chuyển subjectCodes thành subjectIds từ subjectGroups và lưu vào selectedSubjects
            const selectedIds = majorData.subjectGroupDTOs.map(subjectGroupDTO => {
                const matchingGroup = subjectGroups.find(group => group.code === subjectGroupDTO.subjectGroup);
                return matchingGroup ? matchingGroup.id : null; // Nếu tìm thấy, lấy id, nếu không thì null
            }).filter(id => id !== null); // Lọc các id hợp lệ (không phải null)

            setSelectedSubjects(selectedIds);
            setShowModal(true);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu ngành học:', error);
        }
    };

    // Xử lý khối xét tuyển
    // Hàm để xử lý khi người dùng thay đổi trạng thái checkbox
    const handleCheckboxChangeSubjects = (id) => {
        setSelectedSubjects((prevSelected) => {
            if (prevSelected.includes(id)) {
                // Nếu môn học đã chọn rồi, bỏ chọn
                return prevSelected.filter((subjectId) => subjectId !== id);
            } else {
                // Nếu môn học chưa chọn, thêm vào
                return [...prevSelected, id];
            }
        });
        console.log(selectedSubjects);
    };

    // Nhóm các môn học theo ký tự đầu tiên của "code"
    const groupedSubjects = subjectGroups.reduce((groups, subject) => {
        const key = subject.code[0]; // Lấy ký tự đầu tiên của mã môn học
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(subject);
        return groups;
    }, {});

    const handleSaveChanges = async () => {
        // Kiểm tra chỉ tiêu
        const target = Number(selectedMajors.target); // Chuyển đổi sang kiểu số
        if (!Number.isInteger(target) || target <= 0) {
            toast.error("Chỉ tiêu phải là số nguyên lớn hơn 0.");
            return;
        }

        if (selectedMajors.typeAdmissions.length === 0) {
            toast.error("Phải chọn ít nhất một hình thức xét tuyển.");
            return;
        }
        // Nếu chọn hình thức xét học bạ (typeDiploma = 3), phải chọn loại xét học bạ
        if (
            selectedMajors.typeAdmissions.some(item => item.typeDiploma === 3) &&
            !selectedMajors.typeAdmissions.some(item => item.typeDiploma === 3 && item.typeOfTranscript != null)
        ) {
            toast.error("Vui lòng chọn loại xét học bạ.");
            return;
        }
        // Kiểm tra và validate điểm xét học bạ (typeDiploma = 3)
        if (
            selectedMajors.typeAdmissions.some(item => item.typeDiploma === 3) &&
            (
                selectedMajors.totalScoreAcademic <= 0 ||
                selectedMajors.totalScoreAcademic > 30 ||
                !/^\d+(\.\d{1,2})?$/.test(selectedMajors.totalScoreAcademic)
            )
        ) {
            toast.error("Điểm xét học bạ phải là số thập phân từ 0 đến 30, tối đa 2 chữ số thập phân.");
            return;
        }
        // Kiểm tra và validate điểm xét THPT (typeDiploma = 5)
        if (
            selectedMajors.typeAdmissions.some(item => item.typeDiploma === 5) &&
            (
                selectedMajors.totalScore <= 0 ||
                selectedMajors.totalScore > 30 ||
                !/^\d+(\.\d{1,2})?$/.test(selectedMajors.totalScore)
            )
        ) {
            toast.error("Điểm xét THPT phải là số thập phân từ 0 đến 30, tối đa 2 chữ số thập phân.");
            return;
        }
        // Nếu chọn hình thức xét học bạ (typeDiploma = 3) hoặc điểm THPT (typeDiploma = 5), phải chọn ít nhất một khối xét tuyển
        if (
            selectedMajors.typeAdmissions.some(item => item.typeDiploma === 3 || item.typeDiploma === 5) &&
            selectedSubjects.length === 0
        ) {
            toast.error("Vui lòng chọn ít nhất một khối xét tuyển.");
            return;
        }
        try {
            const majorDTO = {
                admissionTimeId: selectedMajors.admissionTimeId,
                majorID: selectedMajors.majorID,  // ID ngành học
                status: selectedMajors.status,  // Trạng thái tuyển sinh
                target: selectedMajors.target,  // Mục tiêu tuyển sinh
                totalScore: selectedMajors.totalScore,
                totalScoreAcademic: selectedMajors.totalScoreAcademic,
                typeAdmissions: selectedMajors.typeAdmissions,  // Thông tin tuyển sinh
                subjectGroupsJson: JSON.stringify(selectedSubjects)
            };
            const response = await api.put(`/admission-council/Major/update-major`, majorDTO);
            if (response.data.status) {
                toast.success(response.data.message);
                fetchMajors(); // Refresh the majors list after update
                handleCloseModal(); // Close the modal
            }

        } catch (error) {
            toast.error("Có lỗi xảy ra khi xử lý yêu cầu.");
            console.error('Lỗi khi cập nhật thông tin ngành học:', error);
        }
    };
    // Gọi API lấy danh sách major khi search hoặc currentPage thay đổi
    useEffect(() => {
        fetchMajors();
    }, [search, currentPage, campusId, selectedCollege]);

    const itemsPerPage = 8;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handleCheckboxChange = (e, type) => {
        const isChecked = e.target.checked;
        setSelectedMajors((prevState) => {
            let updatedTypeAdmissions = [...prevState.typeAdmissions];

            // Nếu checkbox được chọn
            if (isChecked) {
                updatedTypeAdmissions.push({ typeDiploma: type, typeOfTranscript: null }); // Giả sử chưa có loại xét học bạ nào khi vừa chọn
            } else {
                updatedTypeAdmissions = updatedTypeAdmissions.filter(item => item.typeDiploma !== type);
            }

            return {
                ...prevState,
                typeAdmissions: updatedTypeAdmissions
            };
        });
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold">Danh sách ngành học</h2>
            <p className="text-center mb-4 text-orange fw-bold">Danh sách ngành học đang tuyển sinh </p>
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex">
                    <Form.Group className="me-2 d-flex align-items-center" style={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên ngành học"
                            value={search}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end">
                    <Form.Select
                        aria-label="Chọn loại hình giáo dục"
                        value={selectedCollege}
                        onChange={({ target: { value } }) => {
                            setSelectedCollege(value);
                            setCurrentPage(1);
                        }}
                        className="me-2"
                        style={{ width: '200px' }}
                    >
                        <option value="">Hệ đào tạo</option>
                        <option value="true">Cao Đẳng</option>
                        <option value="false">Trung Cấp</option>
                    </Form.Select>

                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên ngành</th>
                        <th>Mã ngành</th>
                        <th>Chỉ tiêu</th>
                        <th>Hệ đào tạo</th>
                        <th>Hình thức</th>
                        <th>Khối xét tuyển</th>
                        <th>Xét học bạ</th>
                        <th>Xét THPT</th>
                        <th>Trạng thái tuyển sinh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {majors && majors.length > 0 ? (
                        majors.map((major, index) => (
                            <tr key={major.majorID}>
                                <td className="text-center fw-bold"> {(currentPage - 1) * majorsPerPage + index + 1}</td>
                                <td>
                                    <div className="d-flex align-items-center">

                                        <div className="ms-3">
                                            <span
                                                className="text-orange"
                                                onClick={() => handleShowModal(major)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {major.majorName}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>{major.majorID}</td>
                                <td>{major.target}</td>
                                <td>{major.isVocationalSchool == true ? "Trung cấp" : "Cao đẳng"}</td>
                                <td>{major.typeAdmissions.map((admission, idx) => (
                                    <div key={idx}>
                                        {getDiplomaName(admission.typeDiploma)}{" "}
                                        {admission.typeOfTranscript !== null && `- ${getTranscriptName(admission.typeOfTranscript)}`}
                                    </div>
                                ))}</td>
                                <td>{major.subjectGroupDTOs.map((subjectGroup, idx) => (
                                    <div key={idx}>
                                        {subjectGroup.subjectGroup}
                                    </div>
                                ))}</td>
                                <td>{major.totalScoreAcademic ? major.totalScoreAcademic : "N/A"}</td>
                                <td>{major.totalScore ? major.totalScore : "N/A"}</td>
                                <td className={major.status ? 'text-success' : 'text-danger'}>
                                    {major.status ? 'Tuyển sinh' : 'Không tuyển sinh'}
                                </td>
                                <td><Button
                                    variant="orange"
                                    className="text-white"
                                    style={{ whiteSpace: 'nowrap' }}
                                    onClick={() => {
                                        setIsEditMode(true);
                                        handleShowModal(major);
                                    }}
                                >
                                    Chỉnh sửa
                                </Button></td>
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
            <div className="d-flex justify-content-between">
                <span>
                    Hiển thị {startItem}-{endItem} trên tổng số {totalItems} tin tức
                </span>
                {totalPages > 1 && totalItems > 0 && (
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                )}


            </div>
            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                {selectedMajors && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditMode ? 'Chỉnh sửa ngành học' : 'Chi tiết ngành học'}</Modal.Title>
                        </Modal.Header>
                        {isEditMode ? (
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Tên ngành học:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={selectedMajors.majorName}
                                                disabled
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Trạng thái tuyển sinh:</Form.Label>
                                            <Form.Select
                                                name="postType"
                                                value={selectedMajors.status ? "true" : "false"}
                                                onChange={(e) => {
                                                    setSelectedMajors({
                                                        ...selectedMajors,
                                                        status: e.target.value === "true"
                                                    });
                                                }}
                                            >
                                                <option value="false">Không tuyển sinh</option>
                                                <option value="true">Tuyển sinh</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Mã ngành:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={selectedMajors.majorID}
                                                disabled
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Chỉ tiêu:</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="target"
                                                value={selectedMajors.target}
                                                onChange={(e) => setSelectedMajors({ ...selectedMajors, target: e.target.value })}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hình thức xét tuyển:</Form.Label>
                                    <Row>
                                        {[0, 1, 2, 3, 4, 5].map((type) => (
                                            <Col md={6} key={type}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label={getDiplomaName(type)}
                                                    checked={selectedMajors.typeAdmissions.some(item => item.typeDiploma === type)}
                                                    onChange={(e) => handleCheckboxChange(e, type)}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Row>
                                        {selectedMajors.typeAdmissions.some(item => item.typeDiploma === 3) && (
                                            <>
                                                <Col md={2}>
                                                    <Form.Label>Điểm xét học bạ:</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="totalScoreAcademic"
                                                        value={selectedMajors.totalScoreAcademic}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Chỉ chấp nhận số thập phân với dấu `.` hoặc rỗng
                                                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                                setSelectedMajors({
                                                                    ...selectedMajors,
                                                                    totalScoreAcademic: value,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                </Col>
                                            </>
                                        )}
                                        {selectedMajors.typeAdmissions.some(item => item.typeDiploma === 5) && (
                                            <Col md={2}>
                                                <Form.Label>Điểm xét THPT:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="totalScore"
                                                    value={selectedMajors.totalScore}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Chỉ chấp nhận số thập phân với dấu `.` hoặc rỗng
                                                        if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                            setSelectedMajors({
                                                                ...selectedMajors,
                                                                totalScore: value,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </Form.Group>
                                {selectedMajors.typeAdmissions.some(item => item.typeDiploma === 3) && (
                                    <Form.Group className="mb-3">
                                        <Row>
                                            <Col md={12}>
                                                <Form.Label>Loại xét học bạ:</Form.Label>
                                                <div>
                                                    {/* Checkbox cho các loại xét học bạ */}
                                                    {[0, 1, 2, 3, 4].map((typeOfTranscript) => (
                                                        <Form.Check
                                                            key={typeOfTranscript}
                                                            type="checkbox"
                                                            label={getTranscriptName(typeOfTranscript)}
                                                            checked={selectedMajors.typeAdmissions.some(item => item.typeOfTranscript === typeOfTranscript && item.typeDiploma === 3)}
                                                            onChange={() => {
                                                                setSelectedMajors((prevState) => {
                                                                    let updatedTypeAdmissions = prevState.typeAdmissions.map(item => {
                                                                        if (item.typeDiploma === 3) {

                                                                            const isSelected = item.typeOfTranscript === typeOfTranscript;
                                                                            return {
                                                                                ...item,
                                                                                typeOfTranscript: isSelected ? null : typeOfTranscript
                                                                            };
                                                                        }
                                                                        return item;
                                                                    });

                                                                    // Trả về trạng thái mới
                                                                    return {
                                                                        ...prevState,
                                                                        typeAdmissions: updatedTypeAdmissions
                                                                    };
                                                                });
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                )}
                                <h6>Danh sách khối xét tuyển</h6>
                                {Object.keys(groupedSubjects).map((key) => (
                                    <div key={key}>
                                        <h6 className='mt-3'>Khối {key}</h6>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "10px" }}>
                                            {groupedSubjects[key].map((subject) => (
                                                <div key={subject.id}>
                                                    <input
                                                        type="checkbox"
                                                        className='me-1'
                                                        id={subject.id}
                                                        checked={selectedSubjects.includes(subject.id)}
                                                        onChange={() => handleCheckboxChangeSubjects(subject.id)}
                                                    />
                                                    <label htmlFor={subject.id}>{subject.code}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </Modal.Body>
                        ) : (
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Tên ngành học:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={selectedMajors.majorName}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Trạng thái tuyển sinh:</Form.Label>
                                            <Form.Select
                                                name="postType"
                                                value={selectedMajors.status}
                                                disabled
                                            >
                                                <option value="false">Không tuyển sinh</option>
                                                <option value="true">Tuyển sinh</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Mã code:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={selectedMajors.majorCode}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Mã ngành:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={selectedMajors.majorID}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Mô tả:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="description"
                                        value={selectedMajors.description}
                                    //onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Học phí:</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="tuition"
                                                value={selectedMajors.tuition}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Chỉ tiêu:</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="target"
                                                value={selectedMajors.target}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Thời gian học:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="timeStudy"
                                                value={selectedMajors.timeStudy}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Hệ đào tạo:</Form.Label>
                                            <Form.Select
                                                name="postType"
                                                value={selectedMajors.isVocationalSchool}
                                                onChange={(e) => {
                                                    setSelectedMajors({
                                                        ...selectedMajors,
                                                        isVocationalSchool: e.target.value === 'true'
                                                    });
                                                    setCurrentPage(1);
                                                }}
                                                disabled
                                            >
                                                <option value="false">Cao Đẳng</option>
                                                <option value="true">Trung Cấp</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phương thức xét tuyển:</Form.Label>
                                    {selectedMajors.typeAdmissions && selectedMajors.typeAdmissions.length > 0 ? (
                                        <ul>
                                            {selectedMajors.typeAdmissions.map((typeAdmission, index) => (
                                                <li key={index}>
                                                    {typeAdmission.typeDiploma === 0
                                                        ? "Tốt nghiệp trung học cơ sở"
                                                        : typeAdmission.typeDiploma === 1
                                                            ? "Tốt nghiệp trung học phổ thông"
                                                            : typeAdmission.typeDiploma === 2
                                                                ? "Tốt nghiệp trung học đại học, cao đẳng"
                                                                : typeAdmission.typeDiploma === 3
                                                                    ? `Xét học bạ THPT - ${typeAdmission.typeOfTranscript === 0
                                                                        ? "Xét học bạ năm 12"
                                                                        : typeAdmission.typeOfTranscript === 1
                                                                            ? "Xét học bạ 3 năm"
                                                                            : typeAdmission.typeOfTranscript === 2
                                                                                ? "Xét học bạ lớp 10, lớp 11, học kỳ 1 12"
                                                                                : typeAdmission.typeOfTranscript === 3
                                                                                    ? "Xét học bạ 5 kỳ"
                                                                                    : "Xét học bạ 3 kỳ"
                                                                    }`
                                                                    : typeAdmission.typeDiploma === 4
                                                                        ? "Liên thông"
                                                                        : "Xét điểm thi THPT"}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div>Không có phương thức xét tuyển</div>
                                    )}
                                </Form.Group>


                                <Form.Group className="mb-3">
                                    <Form.Label>Thông tin xét tuyển:</Form.Label>
                                    <ul>
                                        {selectedMajors.totalScoreAcademic != null && (
                                            <li>
                                                <strong>Điểm xét học bạ:</strong> {selectedMajors.totalScoreAcademic} điểm
                                            </li>
                                        )}
                                        {selectedMajors.totalScore != null && (
                                            <li>
                                                <strong>Điểm xét thi THPT:</strong> {selectedMajors.totalScore} điểm
                                            </li>
                                        )}
                                        {selectedMajors.subjectGroupDTOs && selectedMajors.subjectGroupDTOs.length > 0 && (
                                            <li>
                                                <strong>Tổ hợp môn xét tuyển:</strong>
                                                <ul>
                                                    {selectedMajors.subjectGroupDTOs.map((group, idx) => (
                                                        <li key={idx}>
                                                            {group.subjectGroup} - {group.subjectGroupName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        )}
                                    </ul>

                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Khung chương trình:</Form.Label>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Mã môn</th>
                                                <th>Tên môn</th>
                                                <th>Số tín chỉ</th>
                                                <th>Kỳ học</th>
                                                <th>Thời gian học</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedMajors.subjects && selectedMajors.subjects.length > 0 ? (
                                                selectedMajors.subjects.map((subject, index) => (
                                                    <tr key={subject.subjectCode}>
                                                        <td className="text-center fw-bold">{index + 1}</td>
                                                        <td>{subject.subjectCode}</td>
                                                        <td>{subject.subjectName}</td>
                                                        <td>{subject.numberOfCredits}</td>
                                                        <td>{subject.semesterNumber}</td>
                                                        <td>{subject.studyTime}</td>
                                                        <td>{subject.note}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        Không có môn học nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Form.Group>

                            </Modal.Body>
                        )}

                        <Modal.Footer>
                            {isEditMode ? (
                                <Button variant="orange"
                                    className="text-white"
                                    style={{ whiteSpace: 'nowrap' }}
                                    onClick={handleSaveChanges}> Lưu thay đổi
                                </Button>
                            ) : (
                                <Button variant="secondary" onClick={() => setIsEditMode(true)}>Chỉnh sửa</Button>
                            )}
                            <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default MajorsListViewAC;