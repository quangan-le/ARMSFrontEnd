import axios from 'axios';
import React from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../apiService';
import uploadImage from '../../firebase/uploadImage.js';
import { useEffect, useState } from '../hooks/Hooks.js';

const Application = () => {
    const navigate = useNavigate();
    const { selectedCampus } = useOutletContext();
    const [isWithinAdmissionTime, setIsWithinAdmissionTime] = useState(false);
    const [admissionTimes, setAdmissionTimes] = useState([]); // Lưu toàn bộ dữ liệu thời gian tuyển sinh
    const [formErrors, setFormErrors] = useState({});

    // Kiểm tra có trong thời gian tuyển sinh không
    const checkAdmissionTime = async () => {
        try {
            const response = await api.get('/AdmissionTime/get-admission-time',
                { params: { CampusId: selectedCampus.id } }
            );
            const times = response.data;
            setAdmissionTimes(times); // Lưu toàn bộ thời gian tuyển sinh
            const currentTime = new Date();

            // Kiểm tra nếu thời gian hiện tại trong bất kỳ khoảng nào
            const withinTime = times.some((admission) => {
                const start = new Date(admission.startRegister);
                const end = new Date(admission.endRegister);
                return currentTime >= start && currentTime <= end;
            });

            setIsWithinAdmissionTime(withinTime);
        } catch (error) {
            console.error('Lỗi khi kiểm tra thời gian tuyển sinh:', error);
            toast.error('Không thể kiểm tra thời gian tuyển sinh, vui lòng thử lại sau!');
        }
    };

    useEffect(() => {
        if (selectedCampus?.id) {
            checkAdmissionTime();
        }
    }, [selectedCampus?.id]);

    // Xử lý lấy danh sách tỉnh huyện
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    // Lấy danh sách tỉnh/thành phố khi component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/p');
                setProvinces(response.data);
            } catch (error) {
                console.error('Error fetching provinces data:', error);
            }
        };
        fetchProvinces();
    }, []);

    // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(
                        `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
                    );
                    setDistricts(response.data.districts);
                } catch (error) {
                    console.error('Error fetching districts data:', error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    // Lấy danh sách xã/phường khi chọn quận/huyện
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(
                        `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
                    );
                    setWards(response.data.wards);
                } catch (error) {
                    console.error('Error fetching wards data:', error);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    const handleProvinceChange = async (e) => {
        const selected = e.target.value;
        setSelectedProvince(selected);
        setFormData(prevState => ({
            ...prevState,
            province: selected,
            district: "",
            ward: ""
        }));
        setSelectedDistrict('');
        // Cập nhật lỗi
        const provinceError = await validateField("province", selected);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            province: provinceError,
            district: "",
            ward: "",
        }));
    };

    const handleDistrictChange = async (e) => {
        const selected = e.target.value;
        setSelectedDistrict(selected);
        setFormData(prevState => ({
            ...prevState,
            district: selected,
            ward: ""
        }));

        // Cập nhật lỗi
        const districtError = await validateField("district", selected);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            district: districtError,
            ward: "",
        }));
    };

    const handleWardChange = async (e) => {
        const selected = e.target.value;
        setFormData(prevState => ({
            ...prevState,
            ward: selected
        }));
        // Cập nhật lỗi
        const wardError = await validateField("ward", selected);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            ward: wardError,
        }));
    };

    // Cơ sở
    const [campuses, setCampuses] = useState([]);
    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const response = await api.get('/Campus/get-campuses');
                setCampuses(response.data);
            } catch (error) {
                console.error('Error fetching campuses:', error);
            }
        };
        fetchCampuses();
    }, []);

    // Ngành học
    const [majors, setMajors] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedMajorName, setSelectedMajorName] = useState('');
    const [typeAdmissions, setTypeAdmissions] = useState([]);
    const [selectedAdmissionType, setSelectedAdmissionType] = useState(null);
    const [typeOfTranscriptMajor, setTypeOfTranscriptMajor] = useState(null);
    const [subjectGroups, setSubjectGroups] = useState([]);
    const [selectedGroupData, setSelectedGroupData] = useState(null);
    const [showSubjectSelection, setShowSubjectSelection] = useState(false);
    const [academicTranscriptsMajor, setAcademicTranscriptsMajor] = useState([]);
    // Form nhập điểm động
    const [displayedFields, setDisplayedFields] = useState([]);
    // Định nghĩa các state hiển thị ảnh học bạ cho từng kỳ
    const [showSemester1Year10, setShowSemester1Year10] = useState(false);
    const [showSemester2Year10, setShowSemester2Year10] = useState(false);
    const [showFinalYear10, setShowFinalYear10] = useState(false);

    const [showSemester1Year11, setShowSemester1Year11] = useState(false);
    const [showSemester2Year11, setShowSemester2Year11] = useState(false);
    const [showFinalYear11, setShowFinalYear11] = useState(false);

    const [showSemester1Year12, setShowSemester1Year12] = useState(false);
    const [showFinalYear12, setShowFinalYear12] = useState(false);
    // Ảnh bằng tốt nghiệp
    const [showGraduationImage, setShowGraduationImage] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        dob: "",
        gender: "",
        nation: "",
        citizenIentificationNumber: "",
        ciDate: "",
        ciAddress: "",
        province: "",
        district: "",
        ward: "",
        specificAddress: "",
        emailStudent: "",
        phoneStudent: "",
        fullnameParents: "",
        phoneParents: "",
        campusId: "",
        major: "",
        yearOfGraduation: "",
        schoolName: "",
        recipientResults: true,
        permanentAddress: true,
        addressRecipientResults: "",
        imgCitizenIdentification1: "",
        imgCitizenIdentification2: "",
        imgDiplomaMajor: "",
        imgpriority: "",
        imgAcademicTranscript1: "",
        imgAcademicTranscript2: "",
        imgAcademicTranscript3: "",
        imgAcademicTranscript4: "",
        imgAcademicTranscript5: "",
        imgAcademicTranscript6: "",
        imgAcademicTranscript7: "",
        imgAcademicTranscript8: "",
        imgAcademicTranscript9: "",
        typeOfDiplomaMajor: null,
        typeOfTranscriptMajor: null,
        priorityDetailPriorityID: null,
        campusName: "",
        academicTranscriptsMajor: [],
    });

    // Lưu trữ ảnh tạm thời
    const [tempImages, setTempImages] = useState({
        imgpriority: null,
        imgCitizenIdentification1: null,
        imgCitizenIdentification2: null,
        imgDiplomaMajor: null,
        imgAcademicTranscript1: null,
        imgAcademicTranscript2: null,
        imgAcademicTranscript3: null,
        imgAcademicTranscript4: null,
        imgAcademicTranscript5: null,
        imgAcademicTranscript6: null,
        imgAcademicTranscript7: null,
        imgAcademicTranscript9: null,
    });
    const TypeOfDiploma = {
        0: 'Tốt nghiệp THCS',
        1: 'Tốt nghiệp THPT',
        2: 'Tốt nghiệp Cao đẳng, Đại học',
        3: 'Xét học bạ THPT',
        4: 'Liên thông',
        5: 'Xét điểm thi THPT',
    };
    const fieldMapping = {
        0: ['CN12'], // Xét học bạ lớp 12
        1: ['CN10', 'CN11', 'CN12'], // Xét học bạ 3 năm
        2: ['CN10', 'CN11', 'HK1-12'], // Xét học bạ lớp 10, lớp 11, HK1 lớp 12
        3: ['HK1-10', 'HK2-10', 'HK1-11', 'HK2-11', 'HK1-12'], // Xét học bạ 5 kỳ
        4: ['HK1-11', 'HK2-11', 'HK1-12'] // Xét học bạ 3 kỳ
    };

    // Hàm tạo ra các trường nhập liệu động dựa trên khối và typeOfTranscript
    const generateScoreFields = (subjects, typeOfTranscript) => {
        const fields = fieldMapping[typeOfTranscript] || [];
        return subjects.flatMap(subject =>
            fields.map(field => ({
                subject,
                field,
                name: `${subject}_${field}`,
            }))
        );
    };
    // Cập nhật formData và ngành học khi selectedCampus thay đổi
    useEffect(() => {
        if (selectedCampus?.id) {
            setFormData((prevData) => ({
                ...prevData,
                campusId: selectedCampus.id,
                campusName: selectedCampus.name,
            }));
            setSelectedMajor('');
            setTypeAdmissions([]);
            setSelectedAdmissionType(null);
            setShowSubjectSelection(false);
            setSubjectGroups([]);
            setAcademicTranscriptsMajor([]);

            const fetchMajors = async () => {
                try {
                    const response = await api.get(`/Major/get-majors-college?campus=${selectedCampus.id}`);
                    setMajors(response.data);
                } catch (error) {
                    console.error('Lỗi khi lấy giá trị ngành học', error);
                }
            };

            fetchMajors();
        }
    }, [selectedCampus]);

    // Khi người dùng chọn ngành cho nguyện vọng 1
    const handleMajorChange = async (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor(selectedMajorId);
        setSelectedAdmissionType(null);
        setDisplayedFields([]);
        setAcademicTranscriptsMajor([]);
        setDiplomaMajor(null);

        setShowGraduationImage(!!selectedMajorId); // Hiển thị trường tải ảnh nếu có ngành được chọn

        const selectedMajor = majors.find((major) => major.majorID === selectedMajorId);
        setSelectedMajorName(selectedMajor ? selectedMajor.majorName : '')
        setTypeAdmissions(selectedMajor?.typeAdmissions || []);
        setShowSubjectSelection(false);

        setFormData(prevData => ({
            ...prevData,
            major: selectedMajorId,
            typeOfDiplomaMajor: null,
        }));

        // Kiểm tra lỗi và cập nhật
        const fieldError = await validateField("major", selectedMajorId, tempImages, formData);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            major: fieldError, // Xóa lỗi nếu không có lỗi
        }));
    };

    // Khi chọn loại xét tuyển NV1
    const handleAdmissionTypeChange = async (e) => {
        const typeId = parseInt(e.target.value, 10);
        setSelectedAdmissionType(typeId);
        setDisplayedFields([]);
        setAcademicTranscriptsMajor([]);
        setSelectedGroupData([]);
        const selectedMajor1 = majors.find((major) => major.majorID === selectedMajor);
        const selectedAdmissionType = selectedMajor1?.typeAdmissions.find(admission => admission.typeDiploma === typeId);
        const typeOfTranscript = selectedAdmissionType?.typeOfTranscript ?? null;

        setTypeOfTranscriptMajor(typeOfTranscript);
        setFormData(prevData => ({
            ...prevData,
            typeOfDiplomaMajor: typeId,
            typeOfTranscriptMajor: typeOfTranscript
        }));
        if (typeId === 3 || typeId === 5) {
            setSubjectGroups(selectedMajor1?.subjectGroupDTOs || []);
            setShowSubjectSelection(true);
        } else {
            setShowSubjectSelection(false);
            setSubjectGroups([]);
        }

        // Validate and clear errors
        const fieldError = await validateField("typeOfDiplomaMajor", typeId);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            typeOfDiplomaMajor: fieldError,
        }));
    };


    const handleSubjectGroupChange1 = (e) => {
        const selectedGroup = e.target.value;
        const selectedGroupData = subjectGroups.find(group => group.subjectGroup === selectedGroup);
        if (selectedGroupData) {
            setSelectedGroupData(selectedGroupData);
            setAcademicTranscriptsMajor([]);
            setDisplayedFields([]);
        } else {
            setSelectedGroupData(null);
        }

        // Kiểm tra xem người dùng đang chọn xét tuyển học bạ hay xét điểm thi THPT
        if (selectedAdmissionType === 5 && selectedGroupData) {
            // Nếu chọn "Xét điểm thi THPT", chỉ hiển thị 3 ô nhập điểm cho 3 môn đã chọn
            const subjects = selectedGroupData.subjectGroupName.split("–").map(sub => sub.trim());

            // Tạo các trường nhập điểm cho 3 môn của khối
            let fieldIndex = 0;
            const generatedFields = subjects.slice(0, 3).map(subject => ({
                subject,
                field: 'Điểm thi THPT',
                name: `${subject}_${fieldIndex++}`,
                columnWidthPercentage: 33,
            }));

            setDisplayedFields(generatedFields);
        } else if (selectedGroupData && typeOfTranscriptMajor !== null) {
            // Nếu chọn loại xét tuyển học bạ (typeOfTranscript khác null)
            const subjects = selectedGroupData.subjectGroupName.split("–").map(sub => sub.trim());

            // Tạo các trường nhập điểm theo cấu trúc học bạ
            const generatedFields = generateScoreFields(subjects, typeOfTranscriptMajor).map(field => {
                // Xử lý logic độ rộng cột
                const columnWidthPercentage = typeOfTranscriptMajor === 3 ? 20 : 33;
                return { ...field, columnWidthPercentage };
            });

            setDisplayedFields(generatedFields);
        } else {
            setDisplayedFields([]);
        }
    };

    // Mảng ánh xạ thứ tự vị trí
    const indexMap = [
        [0, 3, 6, 9, 12],
        [1, 4, 7, 10, 13],
        [2, 5, 8, 11, 14]
    ];
    // Xử lý thay đổi điểm cho nguyện vọng 1
    const handleScoreChange1 = (e) => {
        const { name, value } = e.target;
        // Xét điểm THPT
        if (selectedAdmissionType === 5) {
            const [subject, index] = name.split("_");
            // Cập nhật `academicTranscripts` với môn học và điểm
            setAcademicTranscriptsMajor(prevTranscripts => {
                const updatedTranscripts = [...prevTranscripts];

                const existingTranscriptIndex = updatedTranscripts.findIndex(
                    item => item.typeOfAcademicTranscript === Number(index)
                );

                if (existingTranscriptIndex !== -1) {
                    // Cập nhật điểm môn học đã tồn tại
                    updatedTranscripts[existingTranscriptIndex].subjectPoint = Number(value);
                } else {
                    // Thêm mới điểm môn học vào `academicTranscriptsMajor`
                    updatedTranscripts.push({
                        subjectName: subject,
                        subjectPoint: Number(value),
                        typeOfAcademicTranscript: Number(index)
                    });
                }
                return updatedTranscripts;
            });
        } else { //Xét học bạ
            const [subject, field] = name.split("_");
            // Lấy vị trí của Môn học trong tổ hợp đã chọn
            const selectedSubjects = selectedGroupData.subjectGroupName.split("–").map(sub => sub.trim());
            const subjectIndex = selectedSubjects.indexOf(subject);

            // Lấy vị trí của cột trong `fieldMapping[typeOfTranscript]` (danh sách kỳ học)
            const fieldIndex = fieldMapping[typeOfTranscriptMajor]?.indexOf(field);

            // Kiểm tra tính hợp lệ của subjectIndex và fieldIndex
            if (subjectIndex === -1 || fieldIndex === -1) {
                console.error("Subject or field not found in mappings");
                return;
            }
            // Tính toán `typeOfAcademicTranscript` dựa trên vị trí của `subjectIndex` và `fieldIndex`
            const typeOfAcademicTranscript = indexMap[subjectIndex][fieldIndex];

            // Cập nhật `academicTranscriptsMajor` 
            setAcademicTranscriptsMajor(prevTranscripts => {
                const updatedTranscripts = [...prevTranscripts];

                const existingTranscriptIndex = updatedTranscripts.findIndex(
                    item => item.typeOfAcademicTranscript === typeOfAcademicTranscript
                );

                if (existingTranscriptIndex !== -1) {
                    updatedTranscripts[existingTranscriptIndex].subjectPoint = Number(value);
                } else {
                    updatedTranscripts.push({
                        subjectName: subject,
                        subjectPoint: Number(value),
                        typeOfAcademicTranscript
                    });
                }

                return updatedTranscripts;
            });
        }
    };

    // Hàm lấy các trường nhập điểm duy nhất từ hai loại xét học bạ
    const getUniqueFields = (type1) => {
        const fields1 = fieldMapping[type1] || [];
        return Array.from(new Set(fields1));
    };

    useEffect(() => {
        const selectedMajor1Data = majors.find((major) => major.majorID === selectedMajor);
        const selectedType1 = selectedMajor1Data?.typeAdmissions.find(
            (type) => type.typeDiploma === selectedAdmissionType
        );
        // Cập nhật displayedFields dựa trên các loại xét học bạ đã chọn
        const fields = getUniqueFields(selectedType1?.typeOfTranscript);
        // Xác định có cần hiện form nhập ảnh học bạ
        setShowSemester1Year10(fields.includes('HK1-10'));
        setShowSemester2Year10(fields.includes('HK2-10'));
        setShowFinalYear10(fields.includes('CN10'));
        setShowSemester1Year11(fields.includes('HK1-11'));
        setShowSemester2Year11(fields.includes('HK2-11'));
        setShowFinalYear11(fields.includes('CN11'));
        setShowSemester1Year12(fields.includes('HK1-12'));
        setShowFinalYear12(fields.includes('CN12'));
    }, [selectedAdmissionType, selectedMajor, majors]);

    // Thông tin ưu tiên
    const [priorityData, setPriorityData] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState('');
    const [showPriorityModal, setShowPriorityModal] = useState(false);

    useEffect(() => {
        const fetchPriorityData = async () => {
            try {
                const response = await api.get('/Priority/get-priority');
                setPriorityData(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu ưu tiên:', error);
            }
        };
        fetchPriorityData();
    }, []);

    // Xử lý khi người dùng chọn đối tượng ưu tiên
    const handlePriorityChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            // Nếu chọn "Chọn đối tượng", đặt lại các giá trị mặc định
            setSelectedPriority(null);
            setFormData((prevData) => ({
                ...prevData,
                priorityDetailPriorityID: null, // Giá trị mặc định khi không chọn
            }));
            setTempImages((prevImages) => ({
                ...prevImages,
                imgpriority: null, // Xóa ảnh liên quan
            }));
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgpriority: "Vui lòng chọn đối tượng ưu tiên.",
            }));
        } else {
            // Nếu chọn một đối tượng ưu tiên hợp lệ
            const selectedPriorityID = parseInt(value, 10);
            setSelectedPriority(selectedPriorityID);
            setFormData((prevData) => ({
                ...prevData,
                priorityDetailPriorityID: selectedPriorityID,
            }));
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgpriority: null,
            }));
        }
    };
    const handleFileChangePriority = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImages(prev => ({ ...prev, imgpriority: file }));
            const priorityError = await validateField("imgpriority", null, { ...tempImages, imgpriority: file }, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgpriority: priorityError,
            }));
        } else {
            // Nếu không có file (hủy chọn ảnh), reset lại tempImages và formErrors
            setTempImages(prev => ({ ...prev, imgpriority: null }));
            const priorityError = await validateField("imgpriority", null, { ...tempImages, imgpriority: null }, formData);
            setFormErrors(prevErrors => ({
                ...prevErrors,
                imgpriority: priorityError,
            }));
        }
        console.log(formErrors);
    };

    // Xử lý CCCD và bằng
    const [showOtherAddress, setShowOtherAddress] = useState(false);
    const [frontCCCD, setFrontCCCD] = useState(null);
    const [backCCCD, setBackCCCD] = useState(null);
    const [diplomaMajor, setDiplomaMajor] = useState(null);

    // Ảnh mặt trước
    const handleFrontCCCDChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setFrontCCCD(URL.createObjectURL(file));
            setTempImages(prev => ({ ...prev, imgCitizenIdentification1: file }));

            const error = await validateField("imgCitizenIdentification1", null, { ...tempImages, imgCitizenIdentification1: file }, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification1: error
            }));
        } else {
            // Nếu không có tệp nào được chọn, xóa trạng thái liên quan
            setFrontCCCD(null);
            setTempImages((prev) => ({ ...prev, imgCitizenIdentification1: null }));

            const error = await validateField("imgCitizenIdentification1", null, { ...tempImages, imgCitizenIdentification1: null }, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification1: error
            }));
        }
    };
    // Ảnh mặt sau
    const handleBackCCCDChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackCCCD(URL.createObjectURL(file));
            setTempImages(prev => ({ ...prev, imgCitizenIdentification2: file }));
            const backCCCDError = await validateField("imgCitizenIdentification2", null, { ...tempImages, imgCitizenIdentification2: file }, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification2: backCCCDError,
            }));
        } else {
            // Nếu không có tệp nào được chọn, xóa trạng thái liên quan
            setBackCCCD(null);
            setTempImages((prev) => ({ ...prev, imgCitizenIdentification2: null }));

            const backCCCDError = await validateField("imgCitizenIdentification2", null, { ...tempImages, imgCitizenIdentification2: null }, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification2: backCCCDError,
            }));
        }
    };
    // Ảnh tốt nghiệp
    const handleGraduationCertificateChange = async (e) => {
        const file = e.target.files[0];
        const key = "imgDiplomaMajor";
        if (file) {
            // Tạo URL object cho ảnh
            const objectURL = URL.createObjectURL(file);

            const updatedTempImages = {
                ...tempImages,
                [key]: file,
            };
            setTempImages(updatedTempImages);
            setDiplomaMajor(objectURL);
            const diplomaError = await validateField(key, null, updatedTempImages, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [key]: diplomaError,
            }));
        } else {
            // Xử lý khi nhấn Cancel hoặc không có file được chọn
            const updatedTempImages = {
                ...tempImages,
                [key]: null,
            };
            setTempImages(updatedTempImages);
            setDiplomaMajor(null);
            const diplomaError = await validateField(key, null, updatedTempImages, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [key]: diplomaError,
            }));
        }
    };
    // Ảnh học bạ
    const handleAcademicTranscriptUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            setTempImages(prev => ({
                ...prev,
                [`imgAcademicTranscript${index}`]: file // Lưu từng học bạ vào ảnh tương ứng
            }));
        }
    };

    const handleChange = async (e) => {
        const { id, value, type, checked } = e.target;

        // Cập nhật giá trị trong formData
        const updatedValue =
            id === "gender" || id === "recipientResults"
                ? value === "true"
                : type === "checkbox"
                    ? checked
                    : value;

        setFormData((prevState) => ({
            ...prevState,
            [id]: updatedValue,
        }));
        const fieldError = await validateField(id, updatedValue);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [id]: fieldError,
        }));
    };

    // Validate
    const validateField = async (field, value, tempImages, formData) => {
        let error = "";
        const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"]; // Loại tệp cho phép
        const phoneRegex = /^[0-9]{10,11}$/;

        switch (field) {
            case "fullname":
                if (!value.trim()) {
                    error = "Họ và tên không được để trống.";
                }
                break;
            case "dob":
                if (!value) {
                    error = "Ngày sinh không được để trống.";
                } else if (new Date(value) > new Date()) {
                    error = "Ngày sinh không hợp lệ.";
                }
                break;
            case "gender":
                if (value === "") {
                    error = "Giới tính được yêu cầu.";
                }
                break;
            case "nation":
                if (!value.trim()) {
                    error = "Dân tộc không được để trống.";
                }
                break;
            case "citizenIentificationNumber":
                if (!value.trim()) {
                    error = "CCCD/CMND không được để trống.";
                } else if (!/^\d{12}$/.test(value)) {
                    error = "CCCD phải có 12 chữ số.";
                } else {
                    try {
                        const response = await api.get("/RegisterAdmission/check-cccd", {
                            params: { CCCD: value },
                        });
                        if (!response.data.status) {
                            error = response.data.message || "CCCD không hợp lệ!";
                        }
                    } catch (err) {
                        if (err.response && err.response.status === 400) {
                            error = err.response.data.message || "Lỗi khi kiểm tra CCCD!";
                        } else {
                            error = "Không thể kiểm tra CCCD, vui lòng thử lại!";
                        }
                    }
                }
                break;
            case "ciDate":
                if (!value) {
                    error = "Ngày cấp không được để trống.";
                } else if (new Date(value) > new Date()) {
                    error = "Ngày cấp không hợp lệ.";
                }
                break;
            case "ciAddress":
                if (!value.trim()) {
                    error = "Nơi cấp không được để trống.";
                }
                break;
            case "province":
                if (value === "") {
                    error = "Tỉnh/Thành phố không được để trống.";
                }
                break;
            case "district":
                if (value === "") {
                    error = "Quận/Huyện không được để trống.";
                }
                break;
            case "ward":
                if (value === "") {
                    error = "Xã/Phường/Thị trấn không được để trống.";
                }
                break;
            case "specificAddress":
                if (!value.trim()) {
                    error = "Địa chỉ cụ thể không được để trống.";
                }
                break;
            case "phoneStudent":
                if (!value.trim()) {
                    error = "Số điện thoại không được để trống.";
                } else if (!phoneRegex.test(value)) {
                    error = "Số điện thoại phải có 10-11 chữ số.";
                } else {
                    try {
                        const response = await api.get("/RegisterAdmission/check-phone", {
                            params: { phone: value },
                        });
                        if (!response.data.status) {
                            error = response.data.message || "Số điện thoại không hợp lệ!";
                        }
                    } catch (err) {
                        if (err.response && err.response.status === 400) {
                            error = err.response.data.message || "Lỗi khi kiểm tra số điện thoại!";
                        } else {
                            error = "Không thể kiểm tra số điện thoại, vui lòng thử lại!";
                        }
                    }
                }
                break;
            case "phoneParents":
                if (!value.trim()) {
                    error = `Số điện thoại không được để trống.`;
                } else if (!phoneRegex.test(value)) {
                    error = `Số điện thoại phải có 10-11 chữ số.`;
                }
                break;
            case "emailStudent":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    error = `Email không được để trống.`;
                } else if (!emailRegex.test(value)) {
                    error = `Email không đúng định dạng.`;
                } else {
                    try {
                        const response = await api.get("/RegisterAdmission/check-email", {
                            params: { email: value },
                        });
                        if (!response.data.status) {
                            error = response.data.message || "Email không hợp lệ!";
                        }
                    } catch (err) {
                        if (err.response && err.response.status === 400) {
                            error = err.response.data.message || "Lỗi khi kiểm tra Email!";
                        } else {
                            error = "Không thể kiểm tra Email, vui lòng thử lại!";
                        }
                    }
                }
                break;
            case "fullnameParents":
                if (!value.trim()) {
                    error = "Họ và tên phụ huynh không được để trống.";
                }
                break;
            case "schoolName":
                if (!value.trim()) {
                    error = "Trường học không được để trống.";
                }
                break;
            case "yearOfGraduation":
                if (!value.trim()) {
                    error = "Năm tốt nghiệp không được để trống.";
                } else if (!/^\d+$/.test(value)) {
                    error = "Năm tốt nghiệp phải là số.";
                }
                break;
            case "major":
                if (!value) {
                    error = "Ngành học không được để trống.";
                }
                break;
            case "typeOfDiplomaMajor":
                if (value === null || value === undefined || value === "") {
                    error = "Loại xét tuyển không được để trống.";
                }
                break;
            case "academicTranscriptsMajor":
                if (selectedAdmissionType === 3 || selectedAdmissionType === 5) {
                    if (!selectedGroupData || !selectedGroupData.subjectGroup || !selectedGroupData.subjectGroupName) {
                        error = "Vui lòng chọn khối xét tuyển.";
                    } else {
                        const selectedSubjects = selectedGroupData.subjectGroupName
                            .split("–")
                            .map(sub => sub.trim()); // Danh sách môn trong tổ hợp

                        const hasInvalidPoint = selectedSubjects.some((subject, subjectIndex) => {
                            return fieldMapping[typeOfTranscriptMajor]?.some((field, fieldIndex) => {
                                const typeOfAcademicTranscript = indexMap[subjectIndex][fieldIndex]; // Ánh xạ `typeOfAcademicTranscript`

                                const transcript = academicTranscriptsMajor.find(
                                    item => item.typeOfAcademicTranscript === typeOfAcademicTranscript
                                );

                                const point = transcript?.subjectPoint;

                                // Kiểm tra nếu điểm không hợp lệ
                                return point === undefined || point === null ||
                                    !/^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/.test(point);
                            });
                        });
                        if (hasInvalidPoint) {
                            error = "Điểm phải là số từ 0 đến 10, tối đa 2 chữ số thập phân.";
                        }
                    }
                }
                break;
            case "addressRecipientResults":
                if (formData?.permanentAddress === false && !value.trim()) {
                    error = "Vui lòng nhập địa chỉ nhận giấy báo khác.";
                }
                break;

            case "imgpriority":
                // Nếu chọn đối tượng ưu tiên, cần kiểm tra giấy tờ ưu tiên
                if (selectedPriority) {
                    const file = tempImages?.imgpriority; // Lấy file từ tempImages
                    if (!file) {
                        error = "Vui lòng tải lên giấy tờ ưu tiên.";
                    } else {
                        // Kiểm tra loại file
                        if (!allowedFileTypes.includes(file.type)) {
                            error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                        }
                    }
                }
                break;
            case "imgCitizenIdentification1":
                if (!tempImages?.imgCitizenIdentification1) {
                    error = "Ảnh mặt trước CMND/CCCD là bắt buộc.";
                } else if (!allowedFileTypes.includes(tempImages?.imgCitizenIdentification1?.type)) {
                    error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                }
                break;

            case "imgCitizenIdentification2":
                if (!tempImages?.imgCitizenIdentification2) {
                    error = "Ảnh mặt sau CMND/CCCD là bắt buộc.";
                } else if (!allowedFileTypes.includes(tempImages?.imgCitizenIdentification2?.type)) {
                    error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                }
                break;

            case "imgDiplomaMajor":
                if (!tempImages?.imgDiplomaMajor) {
                    error = "Ảnh bằng tốt nghiệp xét tuyển là bắt buộc.";
                } else if (!allowedFileTypes.includes(tempImages?.imgDiplomaMajor?.type)) {
                    error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                }
                break;
            default:
                break;
        }
        return error;
    };

    const validateForm = async () => {
        const errors = {};
        for (const field of Object.keys(formData)) {
            const error = await validateField(field, formData[field], tempImages, formData);
            if (error) {
                errors[field] = error;
            }
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
    };

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isPaymentStep, setIsPaymentStep] = useState(false); // Chuyển sang bước thanh toán

    // Gửi dữ liệu và upload ảnh
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu trạng thái loading
        setLoadingMessage('Đang lưu hồ sơ...');
        const currentTime = new Date();
        // Kiểm tra nếu thời gian hiện tại không nằm trong bất kỳ khoảng nào
        const isWithinTime = admissionTimes.some((admission) => {
            const start = new Date(admission.startRegister);
            const end = new Date(admission.endRegister);
            return currentTime >= start && currentTime <= end;
        });

        if (!isWithinTime) {
            toast.error('Đã hết thời gian đăng ký xét tuyển! Vui lòng xem thông tin đợt tuyển sinh mới tại trang tuyển sinh!');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            setIsLoading(false); // Kết thúc loading
            return;
        }

        // Validate dữ liệu trước khi submit
        const isValid = await validateForm();
        if (!isValid) {
            toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại thông tin!");
            setIsLoading(false);
            return;
        }

        // Khởi tạo updatedFormData với dữ liệu ban đầu
        const updatedFormData = {
            ...formData,
            academicTranscriptsMajor
        };
        const uploadPromises = Object.entries(tempImages).map(async ([key, file]) => {
            if (file) {
                const folder = 'RegisterAdmission';
                try {
                    // Upload ảnh và lấy URL
                    const url = await uploadImage(file, folder);

                    // Cập nhật updatedFormData với URL ảnh đã upload
                    updatedFormData[key] = url;
                } catch (error) {
                    console.error(`Lỗi cập nhật ảnh lên firebase ${key}:`, error);
                }
            }
        });
        await Promise.all(uploadPromises);

        // Cập nhật lại formData với các URL ảnh và các điểm của academicTranscripts
        setFormData(updatedFormData);
        try {
            const response = await api.post('/RegisterAdmission/add-register-admission', updatedFormData);
            const spId = response.data;
            if (!spId) {
                throw new Error('Không lấy được spId, vui lòng kiểm tra lại.');
            }
            sessionStorage.setItem('spId', spId);
            setIsPaymentStep(true);
            toast.success('Đăng ký hồ sơ thành công!');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Lỗi khi nộp hồ sơ, vui lòng thử lại!';
                toast.error(errorMessage);
            } else {
                toast.error('Lỗi khi nộp hồ sơ, vui lòng thử lại!');
            }
            sessionStorage.removeItem('spId');
        } finally {
            setIsLoading(false);
        }
    };

    const [formattedAmount, setFormattedAmount] = useState(null);
    const [loadingAmount, setLoadingAmount] = useState(true);
    const [campusDetail, setCampusDetail] = useState(null);

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN') + ' VND';
    };
    useEffect(() => {
        const fetchAdmissionFee = async () => {
            try {
                setLoadingAmount(true);
                const response = await api.get(`/AdmissionInformation/get-admission-information?CampusId=${selectedCampus.id}`);
                const admissionFee = response.data?.feeRegister;
                if (admissionFee) {
                    setFormattedAmount(formatCurrency(admissionFee));
                } else {
                    setFormattedAmount("Không rõ");
                }
                const responseCampus = await api.get(`/Campus/get-campus?campusid=${selectedCampus.id}`);
                setCampusDetail(responseCampus.data.address);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingAmount(false);
            }
        };
        fetchAdmissionFee();
    }, [selectedCampus.id]);

    // Hướng dẫn thanh toán
    const handlePayment = async () => {
        setIsLoading(true);
        const selectedCampusPost = {
            campus: selectedCampus.id
        };
        try {
            const paymentResponse = await api.post('/VNPay/pay-register-admission', selectedCampusPost);
            const paymentUrl = paymentResponse.data.paymentUrl;

            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                toast.error('Không lấy được đường dẫn thanh toán, vui lòng thử lại.');
            }
        } catch (error) {
            toast.error('Lỗi khi thanh toán, vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner-border text-orange" role="status"></div>
                    <p>{loadingMessage}</p>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="background-overlay">
                <div className="overlay"></div>
                <Container>
                    <Row>
                        <Col md={12} className="background-content">
                            <h2>Nộp hồ sơ trực tuyến</h2>
                            <h4>1. Điền thông tin xét tuyển</h4>
                            <h4>2. Chụp CCCD/CMND 2 mặt</h4>
                            <h4>3. Chụp chứng nhận/Bằng tốt nghiệp THCS hoặc tương đương</h4>
                        </Col>
                    </Row>
                </Container>
                <Row className="mt-5 background-content text-center justify-content-center align-items-center text-white bg-orange p-3 mx-auto w-75 rounded">
                    <div className="register-section d-flex justify-content-center align-items-center flex-column flex-md-row">
                        <h4 className="text-black mb-2 mb-md-0">Đăng ký tư vấn ngay tại đây</h4>
                        <Link to="/#dang-ky" className="text-white d-inline ms-3 fs-4">ĐĂNG KÝ TƯ VẤN!</Link>
                    </div>
                </Row>
            </div>
            {isWithinAdmissionTime ? (
                isPaymentStep ? (
                    <Container className="mt-5 mb-3 px-5">
                        <h3 className="mb-4">Hướng dẫn thanh toán và tra cứu hồ sơ</h3>
                        <p>Quý phụ huynh và sinh viên vui lòng thực hiện thanh toán học phí theo các bước dưới đây để hoàn tất quá trình nộp hồ sơ:</p>
                        <ol>
                            <li>
                                Nhấn vào nút <strong>"Thanh toán phí đăng ký"</strong> bên dưới để truy cập cổng thanh toán VNPay.
                            </li>
                            <li>
                                Lựa chọn phương thức thanh toán phù hợp (thẻ ATM nội địa, ví điện tử, hoặc QR Code).
                            </li>
                            <li>
                                Điền đầy đủ thông tin thanh toán theo hướng dẫn tại cổng VNPay và xác nhận thanh toán.
                            </li>
                            <li>
                                Sau khi thanh toán, bạn có thể tra cứu trạng thái hồ sơ để xác nhận hoàn tất.
                            </li>
                            <li>
                                Bổ sung bản photo công chứng CCCD và bằng tốt nghiệp tạm thời đến địa chỉ của trường tại
                                <strong> {campusDetail || ""} {" "}</strong> 
                                để nhà trường làm căn cứ cho việc đối chiếu hồ sơ.
                            </li>
                        </ol>

                        <p className="mt-4">
                            <strong className="text-success">Nếu thanh toán thành công:</strong>
                        </p>
                        <ol>
                            <li>Tại trang <Link to="/tra-cuu-ho-so" className="text-primary fw-bold">Tra cứu hồ sơ</Link>, vui lòng nhập số căn cước công dân để xác minh thông tin người tra cứu.</li>
                            <li>Kiểm tra OTP được gửi về email của bạn và nhập mã vào hệ thống để xác nhận.</li>
                            <li>Xem trạng thái hồ sơ và các thông tin chi tiết đã được cập nhật.</li>
                        </ol>

                        <p className="mt-4">
                            <strong className="text-danger">Nếu thanh toán thất bại:</strong> Trạng thái hồ sơ hiển thị <strong>"Chưa thanh toán"</strong>, bạn sẽ thấy nút <strong>"Thanh toán phí đăng ký"</strong>.
                            Nhấn vào đó để tiếp tục thanh toán.
                        </p>
                        <p className="mt-4">
                            <strong className="text-danger">Lưu ý quan trọng:</strong>
                        </p>
                        <ul>
                            <li>Kiểm tra thông tin thanh toán thật kỹ trước khi xác nhận để tránh sai sót.</li>
                            <li>
                                Trong trường hợp gặp lỗi hoặc thanh toán thất bại nhiều lần, vui lòng liên hệ bộ phận hỗ trợ qua hotline:
                                <a href="tel:02485820808" className="text-primary fw-bold"> (024) 8582 0808</a>.
                            </li>
                            <li>Việc đăng ký này xem như là sự đồng thuận của người nộp hồ sơ đăng ký với nhà trường, người nộp hồ sơ sẽ phải thanh toán khoản phí đăng ký, và khoản phí này sẽ không được hoàn lại trong bất kì trường hợp nào.</li>
                        </ul>

                        <p className="mt-4">
                            <strong>Thông tin thanh toán:</strong>
                        </p>
                        <ul>
                            <li><strong>Ngành học:</strong> {selectedMajorName}</li>
                            <li>
                                <strong>Số tiền cần thanh toán:</strong>{' '}
                                {loadingAmount ? 'Đang tải...' : '' || formattedAmount}
                            </li>
                        </ul>

                        <div className="text-center mt-4">
                            <Button
                                className="bg-orange text-white px-4 py-2"
                                variant="light"
                                onClick={handlePayment}
                            >
                                Thanh toán phí đăng ký
                            </Button>
                        </div>
                    </Container>
                ) : (
                    <Container className="mt-5 mb-3 px-4">
                        <Form onSubmit={handleSubmit}>
                            <h4 className='text-orange'>Thông tin thí sinh</h4>
                            <Row>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="fullname">
                                        <Form.Label>Họ và tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập họ và tên"
                                            value={formData.fullname}
                                            onChange={handleChange}
                                        />
                                        {formErrors.fullname && <p className="error">{formErrors.fullname}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="dob">
                                        <Form.Label>Ngày sinh</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.dob}
                                            onChange={handleChange}
                                        />
                                        {formErrors.dob && <p className="error">{formErrors.dob}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="gender">
                                        <Form.Label>Giới tính</Form.Label>
                                        <Form.Control as="select" value={formData.gender} onChange={handleChange}>
                                            <option value="">Chọn giới tính</option>
                                            <option value="true">Nam</option>
                                            <option value="false">Nữ</option>
                                        </Form.Control>
                                        {formErrors.gender && <p className="error">{formErrors.gender}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="nation">
                                        <Form.Label>Dân tộc</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập dân tộc"
                                            value={formData.nation}
                                            onChange={handleChange}
                                        />
                                        {formErrors.nation && <p className="error">{formErrors.nation}</p>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="citizenIentificationNumber">
                                        <Form.Label>Số CMND/CCCD</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số CMND/CCCD"
                                            value={formData.citizenIentificationNumber}
                                            onChange={handleChange}
                                        />
                                        {formErrors.citizenIentificationNumber && <p className="error">{formErrors.citizenIentificationNumber}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="ciDate">
                                        <Form.Label>Ngày cấp</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.ciDate}
                                            onChange={handleChange}
                                        />
                                        {formErrors.ciDate && <p className="error">{formErrors.ciDate}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <Form.Group controlId="ciAddress">
                                        <Form.Label>Nơi cấp</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập nơi cấp"
                                            value={formData.ciAddress}
                                            onChange={handleChange}
                                        />
                                        {formErrors.ciAddress && <p className="error">{formErrors.ciAddress}</p>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Form.Label>Nơi thường trú</Form.Label>
                                <Col md={3} xs={12} className="mb-3">
                                    <Form.Group controlId="province">
                                        <Form.Control
                                            as="select"
                                            value={formData.province}
                                            onChange={handleProvinceChange}
                                        >
                                            <option value="">Tỉnh/Thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        {formErrors.province && <p className="error">{formErrors.province}</p>}
                                    </Form.Group>
                                </Col>

                                <Col md={3} xs={12} className="mb-3">
                                    <Form.Group controlId="district">
                                        <Form.Control
                                            as="select"
                                            value={formData.district}
                                            onChange={handleDistrictChange}
                                            disabled={!selectedProvince}
                                        >
                                            <option value="">Quận/Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.code} value={district.code}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        {formErrors.district && <p className="error">{formErrors.district}</p>}
                                    </Form.Group>
                                </Col>

                                <Col md={3} xs={12} className="mb-3">
                                    <Form.Group controlId="ward">
                                        <Form.Control
                                            as="select"
                                            value={formData.ward}
                                            onChange={handleWardChange}
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="">Xã/Phường/Thị trấn</option>
                                            {wards.map((ward) => (
                                                <option key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        {formErrors.ward && <p className="error">{formErrors.ward}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} xs={12} className="mb-3">
                                    <Form.Group controlId="specificAddress">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số nhà, đường, ngõ..."
                                            value={formData.specificAddress}
                                            onChange={handleChange}
                                        />
                                        {formErrors.specificAddress && <p className="error">{formErrors.specificAddress}</p>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="phoneStudent">
                                        <Form.Label>Số điện thoại thí sinh</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phoneStudent}
                                            onChange={handleChange}
                                        />
                                        {formErrors.phoneStudent && <p className="error">{formErrors.phoneStudent}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="emailStudent">
                                        <Form.Label>Email thí sinh</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Nhập email"
                                            value={formData.emailStudent}
                                            onChange={handleChange}
                                        />
                                        {formErrors.emailStudent && <p className="error">{formErrors.emailStudent}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="fullnameParents">
                                        <Form.Label>Họ và tên phụ huynh</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập họ và tên phụ huynh"
                                            value={formData.fullnameParents}
                                            onChange={handleChange}
                                        />
                                        {formErrors.fullnameParents && <p className="error">{formErrors.fullnameParents}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="phoneParents">
                                        <Form.Label>Số điện thoại phụ huynh</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số điện thoại phụ huynh"
                                            value={formData.phoneParents}
                                            onChange={handleChange}
                                        />
                                        {formErrors.phoneParents && <p className="error">{formErrors.phoneParents}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="schoolName">
                                        <Form.Label>Trường học</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Trường THPT FPT"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                        />
                                        {formErrors.schoolName && <p className="error">{formErrors.schoolName}</p>}
                                    </Form.Group>
                                </Col>

                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="yearOfGraduation">
                                        <Form.Label>Năm tốt nghiệp</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="2024"
                                            value={formData.yearOfGraduation}
                                            onChange={handleChange}
                                        />
                                        {formErrors.yearOfGraduation && <p className="error">{formErrors.yearOfGraduation}</p>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h4 className='text-orange mt-4'>Thông tin đăng ký cơ sở</h4>
                            <div>
                                <Row className='mb-2'>
                                    <Col md={3}>
                                        <Form.Group controlId="campusId">
                                            <Form.Label>Cơ sở</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={selectedCampus?.name || ''}
                                                disabled
                                                className="bg-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <h6 className='mt-2'>Nguyện vọng</h6>
                                    <Col md={3}>
                                        <Form.Group controlId="major" className='mb-2'>
                                            <Form.Label>Ngành học</Form.Label>
                                            <Form.Control as="select" value={selectedMajor} onChange={handleMajorChange}>
                                                <option value="">Chọn ngành</option>
                                                {majors.map(major => (
                                                    <option key={major.majorID} value={major.majorID}>
                                                        {major.majorName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            {formErrors.major && <p className="error">{formErrors.major}</p>}
                                        </Form.Group>
                                    </Col>

                                    {typeAdmissions.length > 0 && (
                                        <Col md={3}>
                                            <Form.Group controlId="typeOfDiplomaMajor" className='mb-2'>
                                                <Form.Label>Loại xét tuyển</Form.Label>
                                                <Form.Control as="select"
                                                    value={selectedAdmissionType !== null && selectedAdmissionType !== undefined ? selectedAdmissionType : ''}
                                                    onChange={handleAdmissionTypeChange}
                                                >
                                                    <option value="">Chọn loại xét tuyển</option>
                                                    {typeAdmissions.map((admission, index) => (
                                                        <option key={index} value={admission.typeDiploma}>
                                                            {TypeOfDiploma[admission.typeDiploma]}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {formErrors.typeOfDiplomaMajor && <p className="error">{formErrors.typeOfDiplomaMajor}</p>}
                                            </Form.Group>
                                        </Col>
                                    )}

                                    {showSubjectSelection && (
                                        <Row>
                                            <Form.Label>Khối xét tuyển</Form.Label>
                                            <Col md={3}>
                                                <Form.Group controlId="subjectSelection" className='mb-2'>
                                                    <Form.Control as="select"
                                                        value={selectedGroupData?.subjectGroup || ''}
                                                        onChange={handleSubjectGroupChange1}
                                                    >
                                                        <option value="">Chọn khối</option>
                                                        {subjectGroups.map(subject => (
                                                            <option key={subject.subjectGroup} value={subject.subjectGroup}>
                                                                {subject.subjectGroupName}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={9}>
                                                <Form.Group controlId="subjectScores" className="mb-2">
                                                    <div className="score-inputs" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                        {displayedFields.map((field, index) => {
                                                            let transcript;
                                                            if (selectedAdmissionType === 5) {
                                                                // Xét điểm THPT
                                                                const [subject, index] = field.name.split("_");

                                                                transcript = academicTranscriptsMajor.find(
                                                                    item => item.typeOfAcademicTranscript === Number(index)
                                                                );
                                                            } else {
                                                                // Xét học bạ
                                                                const selectedSubjects = selectedGroupData.subjectGroupName.split("–").map(sub => sub.trim());
                                                                const subjectIndex = selectedSubjects.indexOf(field.subject);
                                                                const fieldIndex = fieldMapping[typeOfTranscriptMajor]?.indexOf(field.name.split("_")[1]);

                                                                // Tính toán typeOfAcademicTranscript
                                                                const typeOfAcademicTranscript =
                                                                    subjectIndex !== -1 && fieldIndex !== -1 ? indexMap[subjectIndex][fieldIndex] : null;

                                                                transcript = academicTranscriptsMajor.find(
                                                                    item => item.typeOfAcademicTranscript === typeOfAcademicTranscript
                                                                );
                                                            }

                                                            return (
                                                                <div key={index} className="score-input" style={{ width: `${field.columnWidthPercentage}%`, padding: '0 4px' }}>
                                                                    <Form.Control
                                                                        className="mb-2"
                                                                        type="number"
                                                                        placeholder={`${field.subject} (${field.field})`}
                                                                        name={field.name}
                                                                        value={transcript ? transcript.subjectPoint : ""}
                                                                        onChange={handleScoreChange1}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </Form.Group>
                                                {formErrors.academicTranscriptsMajor && <p className="error">{formErrors.academicTranscriptsMajor}</p>}
                                            </Col>
                                        </Row>
                                    )}
                                </Row>
                                <h4 className='text-orange mt-3'>Thông tin ưu tiên (nếu có)</h4>
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Row>
                                            <Form.Label>Chọn đối tượng ưu tiên</Form.Label>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group controlId="priorityDetailPriorityID">
                                                    <Form.Control as="select" value={selectedPriority} onChange={handlePriorityChange}>
                                                        <option value="">Chọn đối tượng</option>
                                                        {priorityData.map((priority) => (
                                                            <option key={priority.priorityID} value={priority.priorityID}>
                                                                {priority.priorityName} ({priority.typeOfPriority})
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Button variant="light" className="read-more-btn" onClick={() => setShowPriorityModal(true)}>
                                                    Mô tả chi tiết
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {selectedPriority && (
                                        <Col md={6}>
                                            <Form.Group controlId="imgpriority">
                                                <Form.Label>Giấy tờ ưu tiên</Form.Label>
                                                <Form.Control type="file" accept="image/*" onChange={handleFileChangePriority} required />
                                            </Form.Group>
                                            {formErrors.imgpriority && <p className="error">{formErrors.imgpriority}</p>}
                                        </Col>
                                    )}
                                </Row>
                            </div>

                            <Modal show={showPriorityModal} onHide={() => setShowPriorityModal(false)} size="lg">
                                <Modal.Header closeButton>
                                    <Modal.Title>Mô tả chi tiết các đối tượng ưu tiên</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {priorityData.map((priority) => (
                                        <div key={priority.priorityID} className="mb-3">
                                            <h5>{priority.priorityName} - {priority.typeOfPriority}</h5>
                                            <p>{priority.priorityDescription}</p>
                                            <p>Điểm cộng: {priority.bonusPoint}</p>
                                            <hr />
                                        </div>
                                    ))}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowPriorityModal(false)}>
                                        Đóng
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <h4 className='text-orange mt-3'>Thông tin nhận giấy báo kết quả</h4>
                            <Row>
                                <Col md={6} className='mt-2'>
                                    <Form.Group controlId="recipientResults">
                                        <Form.Label>Người nhận</Form.Label>
                                        <Form.Check
                                            type="radio"
                                            label="Thí sinh"
                                            name="recipientResults"
                                            id="recipientResults"
                                            value="true"
                                            checked={formData.recipientResults === true}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Phụ huynh/Người bảo trợ"
                                            name="recipientResults"
                                            id="recipientResults"
                                            value="false"
                                            checked={formData.recipientResults === false}
                                            className="pt-3"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className='mt-2'>
                                    <Form.Group controlId="addressRecipientResults">
                                        <Form.Label>Địa chỉ nhận</Form.Label>
                                        <Form.Check
                                            type="radio"
                                            label="Địa chỉ thường trú"
                                            name="address"
                                            id="permanentAddress"
                                            checked={formData.permanentAddress === true}
                                            onChange={() => {
                                                setFormData(prevData => ({
                                                    ...prevData,
                                                    permanentAddress: true,
                                                    addressRecipientResults: "" // Xóa địa chỉ khác nếu chọn địa chỉ thường trú
                                                }));
                                                setShowOtherAddress(false);
                                                // Xóa lỗi liên quan đến addressRecipientResults
                                                setFormErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    addressRecipientResults: "", // Xóa lỗi
                                                }));
                                            }}
                                        />
                                        <div className='d-flex align-items-end'>
                                            <Form.Check
                                                type="radio"
                                                label="Khác"
                                                name="address"
                                                id="otherAddress"
                                                checked={formData.permanentAddress === false}
                                                onChange={() => {
                                                    setFormData(prevData => ({ ...prevData, permanentAddress: false }));
                                                    setShowOtherAddress(true);
                                                }}
                                                className="pt-3"
                                            />
                                            {showOtherAddress && (
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập địa chỉ khác"
                                                    className="ms-2"
                                                    value={formData.addressRecipientResults || ""}
                                                    onChange={handleChange}
                                                />
                                            )}
                                        </div>
                                        {formErrors.addressRecipientResults && <p className="error">{formErrors.addressRecipientResults}</p>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h4 className='text-orange mt-3'>Tải lên giấy tờ xác thực hồ sơ đăng ký học</h4>
                            <Row>
                                <Col md={3} className='mt-2'>
                                    <Form.Group>
                                        <Form.Label>Ảnh CMND/CCCD mặt trước</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFrontCCCDChange}
                                            required
                                        />
                                        {frontCCCD && (
                                            <div className="image-preview-container mt-2">
                                                <img src={frontCCCD} alt="Mặt trước CCCD" className="img-preview" />
                                            </div>
                                        )}
                                        {formErrors.imgCitizenIdentification1 && <p className="error">{formErrors.imgCitizenIdentification1}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={3} className='mt-2'>
                                    <Form.Group>
                                        <Form.Label>Ảnh CMND/CCCD mặt sau</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBackCCCDChange}
                                            required
                                        />
                                        {backCCCD && (
                                            <div className="image-preview-container mt-2">
                                                <img src={backCCCD} alt="Mặt sau CCCD" className="img-preview" />
                                            </div>
                                        )}
                                        {formErrors.imgCitizenIdentification2 && <p className="error">{formErrors.imgCitizenIdentification2}</p>}
                                    </Form.Group>
                                </Col>

                                {showGraduationImage && (
                                    <Col md={3} className='mt-2'>
                                        <Form.Group>
                                            <Form.Label>Bằng tốt nghiệp xét tuyển</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleGraduationCertificateChange}
                                                required
                                            />
                                            {diplomaMajor && (
                                                <div className="image-preview-container mt-2">
                                                    <img src={diplomaMajor} alt="Bằng tốt nghiệp" className="img-preview" />
                                                </div>
                                            )}
                                            {formErrors.imgDiplomaMajor && <p className="error">{formErrors.imgDiplomaMajor}</p>}
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group>
                                        <Row className="mt-2">
                                            {showSemester1Year10 && (
                                                <Col md={3} className="mt-2">
                                                    <Form.Label>Ảnh học bạ học kỳ 1 lớp 10</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAcademicTranscriptUpload(e, 1)}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                            {showSemester2Year10 && (
                                                <Col md={3} className="mt-2">
                                                    <Form.Label>Ảnh học bạ học kỳ 2 lớp 10</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAcademicTranscriptUpload(e, 2)}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                            {showFinalYear10 && (
                                                <Col md={3} className="mt-2">
                                                    <Form.Label>Ảnh học bạ cuối năm lớp 10</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAcademicTranscriptUpload(e, 3)}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                            {showSemester1Year11 && (
                                                <Col md={3} className="mt-2">
                                                    <Form.Label>Ảnh học bạ học kỳ 1 lớp 11</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAcademicTranscriptUpload(e, 4)}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                            {showSemester2Year11 && (
                                                <Col md={3} className="mt-2">
                                                    <Form.Label>Ảnh học bạ học kỳ 2 lớp 11</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAcademicTranscriptUpload(e, 5)}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                            {showFinalYear11 && (
                                                <Col md={3} className="mt-2">
                                                    <Form.Label>Ảnh học bạ cuối năm lớp 11</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAcademicTranscriptUpload(e, 6)}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                            {showSemester1Year12 && (
                                                <Col md={3} className="mt-2">
                                                    <Form.Label>Ảnh học bạ học kỳ 1 lớp 12</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAcademicTranscriptUpload(e, 7)}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                            {showFinalYear12 && (
                                                <Col md={3} className="mt-2">
                                                    <Form.Label>Ảnh học bạ cuối năm lớp 12</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAcademicTranscriptUpload(e, 9)}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-center">
                                <Button variant="light" type="submit" className="read-more-btn mt-3">
                                    Gửi hồ sơ đăng ký
                                </Button>
                            </div>
                        </Form>
                    </Container>
                )
            ) : (
                <Container className="my-5 py-5 px-4 text-center">
                    <h3 className="text-danger mt-5 pt-5">Đã hết thời gian tuyển sinh</h3>
                    <p className='mb-5 pb-5'>
                        Vui lòng tham khảo thông tin đợt tuyển sinh mới tại trang{' '}
                        <Link to="/tuyen-sinh" className="text-primary">
                            tuyển sinh
                        </Link>.
                    </p>
                </Container>
            )}
        </div >
    );
};

export default Application;