import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Modal, Row, Table } from 'react-bootstrap';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../apiService.js";
import subjectGroups from './SubjectGroups.js';

const PlanAdmissionDetail = () => {
    const { admissionInformationID } = useParams();
    const { campusId } = useOutletContext();
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    // show ngành tuyển sinh
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [ATId, setAdmissionTimeId] = useState(null);
    // Phần I
    const [admissionData, setAdmissionData] = useState(null);

    const fetchAdmissionData = async () => {
        try {
            const response = await api.get(
                `/admission-council/AdmissionInformation/get-admission-information-by-id?AdmissionInformationID=${admissionInformationID}`
            );
            setAdmissionData(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin tuyển sinh:", error);
        }
    };
    useEffect(() => {
        fetchAdmissionData();
    }, [admissionInformationID]);

    // Fetch danh sách ngành tuyển sinh theo đợt
    const fetchAdmissionMajor = async () => {
        try {
            const response = await api.get(
                `/admission-council/Major/get-majors_admission/${ATId}`
            );
            setDetailData(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ngành tuyển sinh:", error);
        }
    };

    // Trigger fetching admission majors when ATId changes
    useEffect(() => {
        if (ATId) {
            fetchAdmissionMajor();
        }
    }, [ATId]);
    // Phần II
    const handleShowDetailModal = (type, data) => {
        setAdmissionTimeId(data.admissionTimeId);
        setShowDetailModal(true);
    };
    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        //setDetailData(null);
    };
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

    const admissionInfo = admissionData ? admissionData : null;
    const admissionRounds = admissionInfo?.admissionTimes || [];
    const admissionMajors = admissionInfo?.majorAdmissions || [];

    const [editFormData, setEditFormData] = useState({});
    const [selectedMajor, setSelectedMajor] = useState(null);

    // Handle Modal
    const handleShowEditModal = (section, data) => {
        setCurrentSection(section);
        if (data) {
            setEditFormData({ ...data });
        }
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentSection(null);
    };

    useEffect(() => {
        if (currentSection === 'I' && admissionInfo) {
            setEditFormData({
                ...admissionInfo,
            });
        } else if (currentSection === 'III' && selectedMajor) {
            setEditFormData({
                ...selectedMajor,
            });
        }
    }, [currentSection, admissionInfo, selectedMajor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    // Lưu phần I
    const handleSaveChanges = async () => {
        // Validation trước khi lưu
        if (currentSection === 'I') {
            if (editFormData.feeRegister < 100000) {
                toast.error('Phí xét tuyển phải lớn hơn 100.000 VND!');
                return;
            }
            if (editFormData.feeAdmission < 100000) {
                toast.error('Phí nhập học phải lớn hơn 100.000 VND!');
                return;
            }
        }
        console.log(editFormData);
        try {
            if (currentSection === 'I') {
                await api.put('/admission-council/AdmissionInformation/update-admission-information', editFormData);
            } else if (currentSection === 'II') {
                await api.put('/admission-council/AdmissionTime/update-admission-time', editFormData);
            }
            await fetchAdmissionData();
            toast.success('Cập nhật thành công!');
            handleCloseEditModal();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Đã xảy ra lỗi khi cập nhật!';
                toast.error(errorMessage);
            } else {
                toast.error('Cập nhật thất bại! Đã xảy ra lỗi không xác định.');
            }
            console.error("Lỗi khi cập nhật:", error);
        }
    };

    // Tạo mới đợt tuyển sinh
    const [showModalCreate, setShowModalCreate] = useState(false);

    const [formData, setFormData] = useState({
        admissionTimeName: "",
        startRegister: "",
        endRegister: "",
        startAdmission: "",
        endAdmission: "",

    });
    const handleShowModalCreate = () => setShowModalCreate(true);
    const handleCloseModalCreate = () => setShowModalCreate(false);
    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataWithCampusId = {
            ...formData,
            admissionInformationID: parseInt(admissionInformationID, 10)
        };

        try {
            const response = await api.post(
                "/admission-council/AdmissionTime/add-admission-time",
                formDataWithCampusId
            );
            toast.success("Thêm đợt tuyển sinh thành công!");
            handleCloseModalCreate();
            fetchAdmissionData();
        } catch (error) {
            // if (error.response && error.response.data) {
            //     const errorMessage = error.response.data.message || 'Đã xảy ra lỗi khi tạo mới!';
            //     toast.error(errorMessage);
            // } else {
            //     toast.error("Thêm đợt tuyển sinh thất bại!");
            // }
            console.error("Lỗi khi thêm đợt tuyển sinh:", error);
        }
    };

    // Tạo mới ngành tuyển
    const [showModalCreateMajor, setShowModalCreateMajor] = useState(false);
    const [majorOptions, setMajorOptions] = useState([]);
    const fetchMajors = async () => {
        try {
            if (campusId) {
                const response = await api.get(`/admission-council/Major/get-majors-ac`, {
                    params: {
                        campus: campusId
                    },
                });
                const allMajors = response.data;
                // Lọc danh sách ngành đã có
                const filteredMajors = allMajors.filter(
                    (major) => !detailData.some((existingMajor) => existingMajor.majorID === major.majorID)
                );
                setMajorOptions(filteredMajors);
            }
        } catch (error) {
            console.error("Error fetching majors:", error);
        }
    };
    useEffect(() => {
        fetchMajors();
    }, [detailData]);

    // State lưu id môn học đã chọn
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const [formDataMajor, setFormDataMajor] = useState({
        admissionTimeId: 0,
        majorID: "",
        status: true,
        target: 0,
        totalScore: 0,
        totalScoreAcademic: 0,
        subjectGroupsJson: "",
        typeAdmissions: []
    });
    const handleShowModalCreateMajor = () => {
        setShowModalCreateMajor(true);
        fetchMajors();
    };

    const handleCloseModalCreateMajor = () => {
        setShowModalCreateMajor(false);
        setIsEditMode(false);
        setFormDataMajor({
            admissionTimeId: 0,
            majorID: "",
            status: true,
            target: 0,
            totalScore: 0,
            totalScoreAcademic: 0,
            subjectGroupsJson: "",
            typeAdmissions: []
        }); // Reset the form data on close
        setSelectedSubjects([]);
    };
    const handleCreateChangeMajor = (e) => {
        const { name, value } = e.target;
        setFormDataMajor((prevData) => ({
            ...prevData,
            [name]: name === "status" ? value === "true" : value,
        }));
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

    const handleCheckboxChange = (e, type) => {
        const isChecked = e.target.checked;
        setFormDataMajor((prevState) => {
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

    const handleSubmitMajor = async (e) => {
        e.preventDefault();
        // Kiểm tra ngành học
        if (!formDataMajor.majorID) {
            toast.error("Vui lòng chọn ngành học.");
            return;
        }
        // Kiểm tra chỉ tiêu
        const target = Number(formDataMajor.target);
        if (!Number.isInteger(target) || target <= 0) {
            toast.error("Chỉ tiêu phải là số nguyên lớn hơn 0.");
            return;
        }

        if (formDataMajor.typeAdmissions.length === 0) {
            toast.error("Phải chọn ít nhất một hình thức xét tuyển.");
            return;
        }
        // Nếu chọn hình thức xét học bạ (typeDiploma = 3), phải chọn loại xét học bạ
        if (
            formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3) &&
            !formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3 && item.typeOfTranscript != null)
        ) {
            toast.error("Vui lòng chọn loại xét học bạ.");
            return;
        }

        // Kiểm tra và validate điểm xét học bạ (typeDiploma = 3)
        if (
            formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3) &&
            (
                formDataMajor.totalScoreAcademic <= 0 ||
                formDataMajor.totalScoreAcademic > 30 ||
                !/^\d+(\.\d{1,2})?$/.test(formDataMajor.totalScoreAcademic)
            )
        ) {
            toast.error("Điểm xét học bạ phải là số thập phân từ 0 đến 30, tối đa 2 chữ số thập phân.");
            return;
        }
        // Kiểm tra và validate điểm xét THPT (typeDiploma = 5)
        if (
            formDataMajor.typeAdmissions.some(item => item.typeDiploma === 5) &&
            (
                formDataMajor.totalScore <= 0 ||
                formDataMajor.totalScore > 30 ||
                !/^\d+(\.\d{1,2})?$/.test(formDataMajor.totalScore)
            )
        ) {
            toast.error("Điểm xét THPT phải là số thập phân từ 0 đến 30, tối đa 2 chữ số thập phân.");
            return;
        }
        // Nếu chọn hình thức xét học bạ (typeDiploma = 3) hoặc điểm THPT (typeDiploma = 5), phải chọn ít nhất một khối xét tuyển
        if (
            formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3 || item.typeDiploma === 5) &&
            selectedSubjects.length === 0
        ) {
            toast.error("Vui lòng chọn ít nhất một khối xét tuyển.");
            return;
        }

        const updatedFormData = {
            ...formDataMajor,
            admissionTimeId: ATId,
            subjectGroupsJson: JSON.stringify(selectedSubjects)
        };
        try {
            const response = await api.post("/admission-council/Major/add-major", updatedFormData);
            toast.success("Thêm ngành xét tuyển thành công!");
            setFormDataMajor({
                admissionTimeId: 0,
                majorID: "",
                status: true,
                target: 0,
                totalScore: 0,
                totalScoreAcademic: 0,
                subjectGroupsJson: "",
                typeAdmissions: []
            });
            setSelectedSubjects([]);

            handleCloseModalCreateMajor();
            fetchAdmissionMajor();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Đã xảy ra lỗi khi thêm mới!';
                toast.error(errorMessage);
            } else {
                toast.error("Thêm ngành xét tuyển thất bại!");
            }
            console.error("Lỗi khi thêm ngành xét tuyển:", error);
        }
    };
    // Chỉnh sửa
    const [isEditMode, setIsEditMode] = useState(false);
    const [majorName, setMajorName] = useState(null);
    const [majorCode, setMajorCode] = useState(null);

    const handleEditMajor = (major) => {
        setFormDataMajor({
            admissionTimeId: major.admissionTimeId,
            majorID: major.majorID,
            status: major.status,
            target: major.target,
            totalScore: major.totalScore,
            totalScoreAcademic: major.totalScoreAcademic,
            typeAdmissions: major.typeAdmissions,
        });
        // Chuyển subjectCodes thành subjectIds từ subjectGroups và lưu vào selectedSubjects
        const selectedIds = major.subjectGroupDTOs.map(subjectGroupDTO => {
            const matchingGroup = subjectGroups.find(group => group.code === subjectGroupDTO.subjectGroup);
            return matchingGroup ? matchingGroup.id : null; // Nếu tìm thấy, lấy id, nếu không thì null
        }).filter(id => id !== null); // Lọc các id hợp lệ (không phải null)
        setSelectedSubjects(selectedIds);
        setMajorName(major.majorName);
        setMajorCode(major.majorCode);

        setIsEditMode(true);
        setShowModalCreateMajor(true);
    };
    const handleUpdateMajor = async () => {
        // Kiểm tra chỉ tiêu
        const target = Number(formDataMajor.target); // Chuyển đổi sang kiểu số
        if (!Number.isInteger(target) || target <= 0) {
            toast.error("Chỉ tiêu phải là số nguyên lớn hơn 0.");
            return;
        }
        if (formDataMajor.typeAdmissions.length === 0) {
            toast.error("Phải chọn ít nhất một hình thức xét tuyển.");
            return;
        }
        // Nếu chọn hình thức xét học bạ (typeDiploma = 3), phải chọn loại xét học bạ
        if (
            formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3) &&
            !formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3 && item.typeOfTranscript != null)
        ) {
            toast.error("Vui lòng chọn loại xét học bạ.");
            return;
        }
        // Kiểm tra và validate điểm xét học bạ (typeDiploma = 3)
        if (
            formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3) &&
            (
                formDataMajor.totalScoreAcademic <= 0 ||
                formDataMajor.totalScoreAcademic > 30 ||
                !/^\d+(\.\d{1,2})?$/.test(formDataMajor.totalScoreAcademic)
            )
        ) {
            toast.error("Điểm xét học bạ phải là số thập phân từ 0 đến 30, tối đa 2 chữ số thập phân.");
            return;
        }
        // Kiểm tra và validate điểm xét THPT (typeDiploma = 5)
        if (
            formDataMajor.typeAdmissions.some(item => item.typeDiploma === 5) &&
            (
                formDataMajor.totalScore <= 0 ||
                formDataMajor.totalScore > 30 ||
                !/^\d+(\.\d{1,2})?$/.test(formDataMajor.totalScore)
            )
        ) {
            toast.error("Điểm xét THPT phải là số thập phân từ 0 đến 30, tối đa 2 chữ số thập phân.");
            return;
        }
        // Nếu chọn hình thức xét học bạ (typeDiploma = 3) hoặc điểm THPT (typeDiploma = 5), phải chọn ít nhất một khối xét tuyển
        if (
            formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3 || item.typeDiploma === 5) &&
            selectedSubjects.length === 0
        ) {
            toast.error("Vui lòng chọn ít nhất một khối xét tuyển.");
            return;
        }
        const updatedFormData = {
            ...formDataMajor,
            admissionTimeId: ATId,
            subjectGroupsJson: JSON.stringify(selectedSubjects),
        };

        try {
            const response = await api.put(
                `/admission-council/Major/update-major/`, updatedFormData
            );
            toast.success("Cập nhật ngành xét tuyển thành công!");
            handleCloseModalCreateMajor();
            fetchAdmissionMajor();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Cập nhật ngành xét tuyển thất bại!";
            toast.error(errorMessage);
            console.error("Error updating major:", error);
        }
    };
    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-center text-orange fw-bold mb-4">Chi tiết kế hoạch tuyển sinh</h2>

            <Row className='mt-3 mb-2 d-flex'>
                <Col md={10}>
                    <h4 className='text-orange'>I. Thông tin</h4>
                </Col>
                <Col md={2} className="d-flex justify-content-end align-items-end">

                    <Button variant="warning" onClick={() => handleShowEditModal('I')}>
                        Chỉnh sửa
                    </Button>
                </Col>
            </Row>
            {admissionInfo ? (
                <Row className='mt-3 mb-2 '>
                    <p><strong>Năm:</strong> {admissionInfo.year}</p>
                    <p><strong>Thời gian bắt đầu:</strong> {new Intl.DateTimeFormat('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    }).format(new Date(admissionInfo.startAdmission))}
                    </p>
                    <p><strong>Thời gian kết thúc:</strong> {new Intl.DateTimeFormat('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    }).format(new Date(admissionInfo.endAdmission))}
                    </p>
                    <p><strong>Lệ phí:</strong> {admissionInfo.feeRegister.toLocaleString()} VND</p>
                    <p><strong>Nhập học:</strong> {admissionInfo.feeAdmission.toLocaleString()} VND</p>
                    <p><strong>Hồ sơ nhập học:</strong> {admissionInfo.admissionProfileDescription}</p>
                </Row>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
            <Row className='mt-3 mb-2 d-flex'>
                <Col md={10}>
                    <h4 className='text-orange'>II. Đợt tuyển sinh</h4>
                </Col>
                <Col md={2} className="d-flex justify-content-end align-items-end">
                    <Button variant="orange" onClick={handleShowModalCreate} >
                        Thêm mới
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Đợt</th>
                        <th>Thời gian bắt đầu tuyển</th>
                        <th>Thời gian kết thúc tuyển</th>
                        <th>Thời gian bắt đầu nhập học</th>
                        <th>Thời gian kết thúc nhập học</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {admissionRounds.length > 0 ? (
                        admissionRounds.map((round, index) => (
                            <tr key={round.admissionTimeId}>
                                <td>{index + 1}</td>
                                <td>{round.admissionTimeName}</td>
                                <td> {new Intl.DateTimeFormat('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                }).format(new Date(round.startRegister))}
                                </td>
                                <td>
                                    {new Intl.DateTimeFormat('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    }).format(new Date(round.endRegister))}
                                </td>
                                <td>
                                    {new Intl.DateTimeFormat('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    }).format(new Date(round.startAdmission))}
                                </td>
                                <td>
                                    {new Intl.DateTimeFormat('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    }).format(new Date(round.endAdmission))}
                                </td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="orange" id="dropdown-action">
                                            Hành động
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleShowEditModal('II', round)}>
                                                Chỉnh sửa
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleShowDetailModal('Detail-II', round)}>
                                                Ngành xét tuyển
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to={`/admin-council/ke-hoach-tuyen-sinh/danh-sach-dang-ky/${admissionInformationID}/${round.admissionTimeId}`}>
                                                Hồ sơ đã nộp
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to={`/admissions-council/ke-hoach-tuyen-sinh/thong-ke/${admissionInformationID}/${round.admissionTimeId}`}>
                                                Thống kê
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Không có đợt tuyển sinh.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={showModalCreate} onHide={handleCloseModalCreate}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới đợt tuyển sinh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên đợt tuyển sinh</Form.Label>
                            <Form.Control
                                type="text"
                                name="admissionTimeName"
                                value={formData.admissionTimeName}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian bắt đầu tuyển</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startRegister"
                                value={formData.startRegister}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian kết thúc tuyển</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endRegister"
                                value={formData.endRegister}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian bắt đầu nhập học</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startAdmission"
                                value={formData.startAdmission}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian kết thúc nhập học</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endAdmission"
                                value={formData.endAdmission}
                                onChange={handleCreateChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalCreate}>
                        Đóng
                    </Button>
                    <Button variant="orange" onClick={handleSubmit}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal chỉnh sửa */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {currentSection === 'I' && 'Chỉnh sửa Thông tin'}
                        {currentSection === 'II' && 'Chỉnh sửa Đợt tuyển sinh'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentSection === 'I' && admissionInfo && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Năm:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="year"
                                    value={editFormData.year || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian bắt đầu:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startAdmission"
                                    value={editFormData.startAdmission || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian kết thúc:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endAdmission"
                                    value={editFormData.endAdmission || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Lệ phí đăng ký:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="feeRegister"
                                    value={editFormData.feeRegister || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nhập học:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="feeAdmission"
                                    value={editFormData.feeAdmission || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả hồ sơ tuyển sinh:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="admissionProfileDescription"
                                    value={editFormData.admissionProfileDescription || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                    {currentSection === 'II' && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên đợt:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="admissionTimeName"
                                    value={editFormData.admissionTimeName || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian bắt đầu tuyển:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startRegister"
                                    value={editFormData.startRegister || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian kết thúc tuyển:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endRegister"
                                    value={editFormData.endRegister || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian bắt đầu nhập học:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startAdmission"
                                    value={editFormData.startAdmission || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian kết thúc nhập học:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endAdmission"
                                    value={editFormData.endAdmission || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Đóng
                    </Button>
                    <Button variant="warning" onClick={handleSaveChanges}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDetailModal} onHide={handleCloseDetailModal} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Danh sách ngành xét tuyển</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className=' mb-2 d-flex'>
                        <Col md={10}>
                        </Col>
                        <Col md={2} className="d-flex justify-content-end align-items-end">
                            <Button variant="warning"
                                onClick={handleShowModalCreateMajor}
                                disabled={majorOptions.length === 0}
                            >
                                Thêm mới
                            </Button>
                        </Col>
                    </Row>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã ngành</th>
                                <th>Mã code</th>
                                <th>Tên ngành</th>
                                <th>Chỉ tiêu</th>
                                <th>Hình thức xét tuyển</th>
                                <th>Khối xét tuyển</th>
                                <th>Điểm xét học bạ</th>
                                <th>Điểm xét THPT</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(detailData) && detailData.length > 0 ? (
                                detailData.map((round, index) => (
                                    <tr key={round.majorID}>
                                        <td>{index + 1}</td>
                                        <td>{round.majorID}</td>
                                        <td>{round.majorCode}</td>
                                        <td>{round.majorName}</td>
                                        <td>{round.target}</td>
                                        <td>{round.typeAdmissions.map((admission, idx) => (
                                            <div key={idx}>
                                                {getDiplomaName(admission.typeDiploma)}{" "}
                                                {admission.typeOfTranscript !== null && `- ${getTranscriptName(admission.typeOfTranscript)}`}
                                            </div>
                                        ))}</td>
                                        <td>{round.subjectGroupDTOs.map((subjectGroup, idx) => (
                                            <div key={idx}>
                                                {subjectGroup.subjectGroup}
                                            </div>
                                        ))}</td>
                                        <td>{round.totalScoreAcademic ? round.totalScoreAcademic : "N/A"}</td>
                                        <td>{round.totalScore ? round.totalScore : "N/A"}</td>
                                        <td className={round.status ? 'text-success' : 'text-danger'}>
                                            {round.status ? 'Tuyển sinh' : 'Không tuyển sinh'}
                                        </td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                className="m-1"
                                                onClick={() => handleEditMajor(round)}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalCreateMajor} onHide={handleCloseModalCreateMajor} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? "Chỉnh sửa ngành xét tuyển" : "Tạo mới ngành xét tuyển"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Row>
                            <Col md={6}>
                                <Form.Label>Tên ngành học:</Form.Label>
                                {!isEditMode ? (
                                    <Form.Select
                                        name="majorID"
                                        value={formDataMajor.majorID}
                                        onChange={handleCreateChangeMajor}
                                    >
                                        <option value="">Chọn ngành học</option>
                                        {majorOptions.map((major) => (
                                            <option key={major.majorID} value={major.majorID}>
                                                {major.majorName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Control
                                        type="text"
                                        name="majorID"
                                        value={majorName}
                                        disabled
                                    />
                                )}
                            </Col>
                            <Col md={6}>
                                <Form.Label>Trạng thái tuyển sinh:</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formDataMajor.status ? "true" : "false"}
                                    onChange={(e) => handleCreateChangeMajor(e)}
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
                                {!isEditMode ? (
                                    <Form.Control
                                        type="text"
                                        name="majorCode"
                                        value={
                                            majorOptions.find((major) => major.majorID === formDataMajor.majorID)?.majorCode || ""
                                        }
                                        disabled
                                    />
                                ) : (
                                    <Form.Control
                                        type="text"
                                        name="majorCode"
                                        value={majorCode}
                                        disabled
                                    />
                                )}

                            </Col>
                            <Col md={6}>
                                <Form.Label>Chỉ tiêu:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="target"
                                    value={formDataMajor.target}
                                    onChange={handleCreateChangeMajor}
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
                                        checked={formDataMajor.typeAdmissions.some(item => item.typeDiploma === type)}
                                        onChange={(e) => handleCheckboxChange(e, type)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Row>
                            {formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3) && (
                                <>
                                    <Col md={2}>
                                        <Form.Label>Điểm xét học bạ:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="totalScoreAcademic"
                                            value={formDataMajor.totalScoreAcademic}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Chỉ chấp nhận số thập phân với dấu `.` hoặc rỗng
                                                if (/^\d*\.?\d{0,2}$/.test(value)) {

                                                    setFormDataMajor({
                                                        ...formDataMajor,
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
                            {formDataMajor.typeAdmissions.some(item => item.typeDiploma === 5) && (
                                <Col md={2}>
                                    <Form.Label>Điểm xét THPT:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="totalScore"
                                        value={formDataMajor.totalScore}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Chỉ chấp nhận số thập phân với dấu `.` hoặc rỗng
                                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                setFormDataMajor({
                                                    ...formDataMajor,
                                                    totalScore: value,
                                                });
                                            }
                                        }}
                                    />
                                </Col>
                            )}
                        </Row>
                    </Form.Group>
                    {formDataMajor.typeAdmissions.some(item => item.typeDiploma === 3) && (
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
                                                checked={formDataMajor.typeAdmissions.some(item => item.typeOfTranscript === typeOfTranscript && item.typeDiploma === 3)}
                                                onChange={() => {
                                                    setFormDataMajor((prevState) => {
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
                <Modal.Footer>
                    <Button variant="primary" onClick={isEditMode ? handleUpdateMajor : handleSubmitMajor}>
                        {isEditMode ? "Cập nhật" : "Tạo mới"}
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalCreateMajor}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PlanAdmissionDetail;
