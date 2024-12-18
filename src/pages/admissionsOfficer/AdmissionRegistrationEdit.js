import React from 'react';
import { Container, Row, Col, Form, Button, Modal, Card } from 'react-bootstrap';
import { useState, useEffect } from '../hooks/Hooks.js';
import { Link, useOutletContext, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../apiService';
import uploadImage from '../../firebase/uploadImage.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdmissionRegistrationEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { spId } = useParams();
    const [applicationData, setApplicationData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const fetchApplicationData = async () => {
        try {
            const response = await api.get(
                `/admin-officer/RegisterAdmission/get-register-admission/${spId}`
            );
            setApplicationData(response.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu ứng tuyển:", error);
        } finally {
            setIsLoadingData(false); // Đảm bảo trạng thái tải được cập nhật
        }
    };

    useEffect(() => {
        fetchApplicationData();
    }, [spId]);

    const [formData, setFormData] = useState({
        aiId: "",
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
        academicTranscripts: [],
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

    // Ngành học
    const [majors, setMajors] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState('');
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
    useEffect(() => {
        const fetchMajors = async () => {
            if (!applicationData?.campusId) return;

            try {
                const response = await api.get(`/Major/get-majors-college?campus=${applicationData.campusId}`);
                setMajors(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy giá trị ngành học', error);
            }
        };
        fetchMajors();
    }, [applicationData?.campusId]);

    const updateScoreByIndex = (typeOfAcademicTranscript, subjectPoint, subjectName) => {
        setAcademicTranscriptsMajor((prevTranscripts) => {
            const updatedTranscripts = [...prevTranscripts];

            // Tìm index của transcript cần cập nhật
            const existingIndex = updatedTranscripts.findIndex(
                (item) => item.typeOfAcademicTranscript === typeOfAcademicTranscript
            );

            if (existingIndex !== -1) {
                // Nếu đã tồn tại, cập nhật điểm
                updatedTranscripts[existingIndex].subjectPoint = subjectPoint;
            } else {
                // Nếu chưa tồn tại, thêm mới
                updatedTranscripts.push({
                    subjectName: subjectName,
                    subjectPoint: subjectPoint,
                    typeOfAcademicTranscript: typeOfAcademicTranscript,
                });
            }

            return updatedTranscripts;
        });
    };

    useEffect(() => {
        if (applicationData) {
            const formatDate = (dateString) => {
                if (!dateString) return ""; // Nếu không có giá trị, trả về chuỗi rỗng
                const date = new Date(dateString); // Chuyển đổi chuỗi thành đối tượng Date
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm số 0 trước nếu cần
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`; // Trả về định dạng YYYY-MM-DD
            };
            setFormData({
                aiId: applicationData.aiId || "",
                fullname: applicationData.fullname || "",
                dob: formatDate(applicationData.dob), // Chuyển đổi định dạng ngày
                gender: applicationData.gender === true ? "true" : applicationData.gender === false ? "false" : "",
                nation: applicationData.nation || "",
                citizenIentificationNumber: applicationData.citizenIentificationNumber || "",
                ciDate: formatDate(applicationData.ciDate),
                ciAddress: applicationData.ciAddress || "",
                province: applicationData.province || "",
                district: applicationData.district || "",
                ward: applicationData.ward || "",
                specificAddress: applicationData.specificAddress || "",
                emailStudent: applicationData.emailStudent || "",
                phoneStudent: applicationData.phoneStudent || "",
                fullnameParents: applicationData.fullnameParents || "",
                phoneParents: applicationData.phoneParents || "",
                campusId: applicationData.campusId || "",
                major: applicationData.major || "",
                yearOfGraduation: applicationData.yearOfGraduation ? String(applicationData.yearOfGraduation) : "",
                schoolName: applicationData.schoolName || "",
                recipientResults: applicationData.recipientResults ?? true, // Đảm bảo giá trị boolean
                permanentAddress: applicationData.permanentAddress ?? true, // Đảm bảo giá trị boolean
                addressRecipientResults: applicationData.addressRecipientResults || "",
                imgCitizenIdentification1: applicationData.imgCitizenIdentification1 || "",
                imgCitizenIdentification2: applicationData.imgCitizenIdentification2 || "",
                imgDiplomaMajor: applicationData.imgDiplomaMajor || "",
                imgpriority: applicationData.imgpriority || "",
                imgAcademicTranscript1: applicationData.imgAcademicTranscript1 || "",
                imgAcademicTranscript2: applicationData.imgAcademicTranscript2 || "",
                imgAcademicTranscript3: applicationData.imgAcademicTranscript3 || "",
                imgAcademicTranscript4: applicationData.imgAcademicTranscript4 || "",
                imgAcademicTranscript5: applicationData.imgAcademicTranscript5 || "",
                imgAcademicTranscript6: applicationData.imgAcademicTranscript6 || "",
                imgAcademicTranscript7: applicationData.imgAcademicTranscript7 || "",
                imgAcademicTranscript8: applicationData.imgAcademicTranscript8 || "",
                imgAcademicTranscript9: applicationData.imgAcademicTranscript9 || "",
                typeOfDiplomaMajor: applicationData.typeOfDiplomaMajor ?? null,
                typeOfTranscriptMajor: applicationData.typeOfTranscriptMajor ?? null,
                priorityDetailPriorityID: applicationData.priorityDetailPriorityID ?? null,
                campusName: applicationData.campusName || "",
                academicTranscripts: applicationData.academicTranscripts || [],
            });
            setSelectedProvince(applicationData.province || "");
            setSelectedDistrict(applicationData.district || "");
            setSelectedMajor(applicationData.major || "");
            setSelectedPriority(applicationData.priorityDetailPriorityID ?? null);
            setShowOtherAddress(applicationData.permanentAddress === false);
            const initializeData = async () => {
                if (selectedMajor && majors.length > 0) {
                    // Gọi handleMajorChange
                    await handleMajorChange({ target: { value: selectedMajor } });

                    // Gọi handleAdmissionTypeChange và chờ hoàn tất
                    const typeId = applicationData.typeOfDiplomaMajor;
                    setSelectedAdmissionType(typeId);
                    const updatedSubjectGroups = await handleAdmissionTypeChange({ target: { value: typeId } });

                    const academicTranscriptsMajor = applicationData?.academicTranscripts || [];
                    // Loại xét học bạ
                    const subjects = Array.from(new Set(academicTranscriptsMajor.map(item => item.subjectName)));
                    const subjectGroupName = subjects.join(" – "); // Sử dụng en dash
                    const selectedGroup = updatedSubjectGroups.find(group => group.subjectGroupName === subjectGroupName);
                    if (selectedGroup) {
                        handleSubjectGroupChange2(
                            { target: { value: selectedGroup.subjectGroup } },
                            updatedSubjectGroups,
                            typeId
                        );
                    } else {
                        console.error("Không tìm thấy mã tổ hợp phù hợp!");
                    }

                    // Get điểm
                    if (academicTranscriptsMajor.length > 0) {
                        academicTranscriptsMajor.forEach(({ typeOfAcademicTranscript, subjectPoint, subjectName }) => {
                            updateScoreByIndex(typeOfAcademicTranscript, subjectPoint, subjectName);
                        });
                    }
                }
            };
            initializeData();
        }
    }, [applicationData, majors]);

    useEffect(() => {
        const updateFieldsBasedOnAdmissionType = async () => {
            if (selectedAdmissionType !== null && typeOfTranscriptMajor !== null) {
                const updatedSubjectGroups = await handleAdmissionTypeChange({ target: { value: selectedAdmissionType } });

                const academicTranscriptsMajor = applicationData?.academicTranscripts || [];
                const subjects = Array.from(new Set(academicTranscriptsMajor.map(item => item.subjectName)));
                const subjectGroupName = subjects.join(" – ");
                const selectedGroup = updatedSubjectGroups.find(group => group.subjectGroupName === subjectGroupName);

                if (selectedGroup) {
                    handleSubjectGroupChange(
                        { target: { value: selectedGroup.subjectGroup } },
                        updatedSubjectGroups
                    );
                } else {
                    console.error("Không tìm thấy mã tổ hợp phù hợp!");
                }

                // Get điểm sau khi handleSubjectGroupChange xong
                if (academicTranscriptsMajor.length > 0) {
                    academicTranscriptsMajor.forEach(({ typeOfAcademicTranscript, subjectPoint, subjectName }) => {
                        updateScoreByIndex(typeOfAcademicTranscript, subjectPoint, subjectName);
                    });
                }
            }
        };

        // Gọi hàm updateFieldsBasedOnAdmissionType khi selectedAdmissionType và typeOfTranscriptMajor thay đổi
        updateFieldsBasedOnAdmissionType();
    }, [selectedAdmissionType, typeOfTranscriptMajor]);  // Dependency array, chỉ chạy lại khi selectedAdmissionType hoặc typeOfTranscriptMajor thay đổi

    const [formErrors, setFormErrors] = useState({});

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
    }, [selectedProvince, formData.district]);

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

    const getCampusName = (campusId) => {
        const campus = campuses.find((c) => c.campusId === campusId);
        return campus ? campus.campusName : "Không xác định";
    };

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

    // Hàm lấy các trường nhập điểm duy nhất từ loại xét học bạ
    const getUniqueFields = (type1) => {
        const fields1 = fieldMapping[type1] || [];
        return Array.from(new Set(fields1));
    };

    // Khi người dùng chọn ngành cho nguyện vọng
    const handleMajorChange = async (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor(selectedMajorId);
        setSelectedAdmissionType(null);
        setDisplayedFields([]);
        setAcademicTranscriptsMajor([]);

        setShowGraduationImage(!!selectedMajorId); // Hiển thị trường tải ảnh nếu có ngành được chọn

        const selectedMajor = majors.find((major) => major.majorID === selectedMajorId);
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

    // Khi chọn loại xét tuyển
    const handleAdmissionTypeChange = async (e) => {
        const typeId = parseInt(e.target.value, 10);
        setSelectedAdmissionType(typeId);
        setDisplayedFields([]);
        setAcademicTranscriptsMajor([]);
        setSelectedGroupData([]);

        const major = majors.find((major) => major.majorID === selectedMajor);
        const selectedAdmissionType = major?.typeAdmissions.find(admission => admission.typeDiploma === typeId);
        const typeOfTranscript = selectedAdmissionType?.typeOfTranscript ?? null;

        setTypeOfTranscriptMajor(typeOfTranscript);
        setFormData(prevData => ({
            ...prevData,
            typeOfDiplomaMajor: typeId,
            typeOfTranscriptMajor: typeOfTranscript
        }));
        // Validate and clear errors
        const fieldError = await validateField("typeOfDiplomaMajor", typeId);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            typeOfDiplomaMajor: fieldError,
        }));

        if (typeId === 3 || typeId === 5) {
            setShowSubjectSelection(true);

            const newSubjectGroups = major?.subjectGroupDTOs || [];
            setSubjectGroups(newSubjectGroups);
            return Promise.resolve(newSubjectGroups); // Trả về Promise khi subjectGroups được cập nhật
        } else {
            setShowSubjectSelection(false);
            setSubjectGroups([]);
            return Promise.resolve([]);
        }
    };

    const handleSubjectGroupChange2 = (e, subjectGroupsData = subjectGroups, selectedAdmissionType = selectedAdmissionType) => {
        const selectedGroup = e.target.value;
        const selectedGroupData = subjectGroupsData.find(group => group.subjectGroup === selectedGroup);
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

    const handleSubjectGroupChange = (e, subjectGroupsData = subjectGroups) => {
        const selectedGroup = e.target.value;
        const selectedGroupData = subjectGroupsData.find(group => group.subjectGroup === selectedGroup);
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
    // Xử lý thay đổi điểm cho nguyện vọng
    const handleScoreChange = (e) => {
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
                    // Thêm mới điểm môn học vào `academicTranscripts`
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

    useEffect(() => {
        const selectedMajorData = majors.find((major) => major.majorID === selectedMajor);
        const selectedType = selectedMajorData?.typeAdmissions.find(
            (type) => type.typeDiploma === selectedAdmissionType
        );
        // Cập nhật displayedFields dựa trên các loại xét học bạ đã chọn
        const fields = getUniqueFields(selectedType?.typeOfTranscript);
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
    };

    // Xử lý CCCD và bằng
    const [showOtherAddress, setShowOtherAddress] = useState(false);

    // Ảnh mặt trước
    const handleFrontCCCDChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImages(prev => ({ ...prev, imgCitizenIdentification1: file }));

            const error = await validateField("imgCitizenIdentification1", null, { ...tempImages, imgCitizenIdentification1: file }, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification1: error
            }));
        } else {
            // Nếu không có tệp nào được chọn, xóa trạng thái liên quan
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
            setTempImages(prev => ({ ...prev, imgCitizenIdentification2: file }));
            const backCCCDError = await validateField("imgCitizenIdentification2", null, { ...tempImages, imgCitizenIdentification2: file }, formData);
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification2: backCCCDError,
            }));
        } else {
            // Nếu không có tệp nào được chọn, xóa trạng thái liên quan
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
            const updatedTempImages = {
                ...tempImages,
                [key]: file,
            };
            setTempImages(updatedTempImages);
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
        const key = `imgAcademicTranscript${index}`; // Tạo key cho mỗi học bạ
        if (file) {
            setTempImages(prev => ({
                ...prev,
                [`imgAcademicTranscript${index}`]: file // Lưu từng học bạ vào ảnh tương ứng
            }));
        } else {
            const updatedTempImages = { ...tempImages, [key]: null };
            setTempImages(updatedTempImages); // Xóa ảnh nếu người dùng hủy
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
                } else if (value !== applicationData.phoneStudent) {
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
                } else if (value !== applicationData.emailStudent) {
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
                if (!value) {
                    error = "Loại xét tuyển không được để trống.";
                }
                break;
            case "academicTranscripts":
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
                    if (file) {
                        if (!allowedFileTypes.includes(file.type)) {
                            error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                        }
                    }
                }
                break;
            case "imgCitizenIdentification1":
                if (tempImages?.imgCitizenIdentification1 && !allowedFileTypes.includes(tempImages?.imgCitizenIdentification1?.type)) {
                    error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                }
                break;

            case "imgCitizenIdentification2":
                if (tempImages?.imgCitizenIdentification2 && !allowedFileTypes.includes(tempImages?.imgCitizenIdentification2?.type)) {
                    error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                }
                break;

            case "imgDiplomaMajor":
                if (tempImages?.imgDiplomaMajor && !allowedFileTypes.includes(tempImages?.imgDiplomaMajor?.type)) {
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

    // Gửi dữ liệu và upload ảnh
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu trạng thái loading
        setLoadingMessage('Đang cập nhật hồ sơ...');

        // Validate dữ liệu trước khi submit
        const isValid = await validateForm();
        if (!isValid) {
            toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại thông tin!");
            setIsLoading(false);
            return;
        }

        // Kiểm tra TypeOfDiplomaMajor để xử lý academicTranscriptsMajor
        const shouldClearAcademicTranscripts =
            formData.typeOfDiplomaMajor !== 3 && formData.typeOfDiplomaMajor !== 5;

        // Khởi tạo updatedFormData với dữ liệu ban đầu
        const updatedFormData = {
            ...formData,
            spId: spId,
            gender: formData.gender === "true",
            academicTranscripts: shouldClearAcademicTranscripts ? [] : academicTranscriptsMajor,
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
                    console.error(`Error uploading ${key}:`, error);
                }
            }
        });
        await Promise.all(uploadPromises);

        // Cập nhật lại formData với các URL ảnh và các điểm của academicTranscripts
        setFormData(updatedFormData);
        try {
            const response = await api.put('/admin-officer/RegisterAdmission/update-student-register', updatedFormData);
            if (response && response.data) {
                toast.success('Cập nhật hồ sơ thành công!');
                // Chuyển hướng về trang chi tiết của hồ sơ vừa sửa
                navigate(`/admissions-officer/chi-tiet-dang-ky-tuyen-sinh/${updatedFormData.spId}`);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'Lỗi khi cập nhật hồ sơ, vui lòng thử lại!';
                toast.error(errorMessage);
            } else {
                toast.error('Lỗi khi cập nhật hồ sơ, vui lòng thử lại!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return <p>Đang tải dữ liệu...</p>;
    }
    return (
        <div>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner-border text-orange" role="status"></div>
                    <p>{loadingMessage}</p>
                </div>
            )}
            <Container className="my-3">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="text-center text-orange fw-bold">Chỉnh sửa hồ sơ đăng ký</h2>
                {applicationData && (
                    <Card className="mt-4 px-md-5 px-3">
                        <Card.Body>
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
                                                readOnly
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
                                                    value={getCampusName(formData?.campusId) || ""}
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
                                                            onChange={handleSubjectGroupChange}
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
                                                                            onChange={handleScoreChange}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </Form.Group>
                                                    {formErrors.academicTranscripts && <p className="error">{formErrors.academicTranscripts}</p>}
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
                                                    {(tempImages.imgpriority || applicationData.imgpriority) ? (
                                                        <div>
                                                            <img
                                                                src={
                                                                    tempImages.imgpriority
                                                                        ? URL.createObjectURL(tempImages.imgpriority) // Hiển thị ảnh tạm nếu đã chọn file mới
                                                                        : applicationData.imgpriority // Hiển thị ảnh từ URL nếu chưa chọn file mới
                                                                }
                                                                alt="Giấy tờ ưu tiên"
                                                                style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "10px" }}
                                                            />
                                                            <Form.Control
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileChangePriority}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChangePriority}
                                                            required
                                                        />
                                                    )}
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
                                <h4 className='text-orange mt-3'>Giấy tờ xác thực hồ sơ đăng ký học</h4>
                                <Row>
                                    <Col md={3} className='mt-2'>
                                        <Form.Group>
                                            <Form.Label>Ảnh CMND/CCCD mặt trước</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFrontCCCDChange}
                                            />
                                            {(tempImages?.imgCitizenIdentification1 || applicationData?.imgCitizenIdentification1) && (
                                                <div className="image-preview-container mt-2">
                                                    <img
                                                        src={
                                                            tempImages.imgCitizenIdentification1
                                                                ? URL.createObjectURL(tempImages.imgCitizenIdentification1)
                                                                : applicationData.imgCitizenIdentification1
                                                        }
                                                        alt="Mặt trước CCCD"
                                                        className="img-preview"
                                                    />
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
                                            />
                                            {(tempImages?.imgCitizenIdentification2 || applicationData?.imgCitizenIdentification2) && (
                                                <div className="image-preview-container mt-2">
                                                    <img
                                                        src={
                                                            tempImages.imgCitizenIdentification2
                                                                ? URL.createObjectURL(tempImages.imgCitizenIdentification2)
                                                                : applicationData.imgCitizenIdentification2
                                                        }
                                                        alt="Mặt sau CCCD"
                                                        className="img-preview"
                                                    />
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
                                                    onChange={(e) => handleGraduationCertificateChange(e, true)}
                                                />
                                                {(tempImages?.imgDiplomaMajor || applicationData?.imgDiplomaMajor) && (
                                                    <div className="image-preview-container mt-2">
                                                        <img
                                                            src={
                                                                tempImages.imgDiplomaMajor
                                                                    ? URL.createObjectURL(tempImages.imgDiplomaMajor)
                                                                    : applicationData.imgDiplomaMajor
                                                            }
                                                            alt="Bằng tốt nghiệp"
                                                            className="img-preview"
                                                        />
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
                                                        />
                                                        {(tempImages?.imgAcademicTranscript1 || applicationData?.imgAcademicTranscript1) && (
                                                            <div className="image-preview-container mt-2">
                                                                <img
                                                                    src={
                                                                        tempImages.imgAcademicTranscript1
                                                                            ? URL.createObjectURL(tempImages.imgAcademicTranscript1)
                                                                            : applicationData.imgAcademicTranscript1
                                                                    }
                                                                    alt="Học bạ học kỳ 1 lớp 10"
                                                                    className="img-preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                )}
                                                {showSemester2Year10 && (
                                                    <Col md={3} className="mt-2">
                                                        <Form.Label>Ảnh học bạ học kỳ 2 lớp 10</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleAcademicTranscriptUpload(e, 2)}
                                                        />
                                                        {(tempImages?.imgAcademicTranscript2 || applicationData?.imgAcademicTranscript2) && (
                                                            <div className="image-preview-container mt-2">
                                                                <img
                                                                    src={
                                                                        tempImages.imgAcademicTranscript2
                                                                            ? URL.createObjectURL(tempImages.imgAcademicTranscript2)
                                                                            : applicationData.imgAcademicTranscript2
                                                                    }
                                                                    alt="Học bạ học kỳ 2 lớp 10"
                                                                    className="img-preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                )}
                                                {showFinalYear10 && (
                                                    <Col md={3} className="mt-2">
                                                        <Form.Label>Ảnh học bạ cuối năm lớp 10</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleAcademicTranscriptUpload(e, 3)}
                                                        />
                                                        {(tempImages.imgAcademicTranscript3 || applicationData.imgAcademicTranscript3) && (
                                                            <div className="image-preview-container mt-2">
                                                                <img
                                                                    src={
                                                                        tempImages.imgAcademicTranscript3
                                                                            ? URL.createObjectURL(tempImages.imgAcademicTranscript3)
                                                                            : applicationData.imgAcademicTranscript3
                                                                    }
                                                                    alt="Học bạ cuối năm lớp 10"
                                                                    className="img-preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                )}
                                                {showSemester1Year11 && (
                                                    <Col md={3} className="mt-2">
                                                        <Form.Label>Ảnh học bạ học kỳ 1 lớp 11</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleAcademicTranscriptUpload(e, 4)}
                                                        />
                                                        {(tempImages.imgAcademicTranscript4 || applicationData.imgAcademicTranscript4) && (
                                                            <div className="image-preview-container mt-2">
                                                                <img
                                                                    src={
                                                                        tempImages.imgAcademicTranscript4
                                                                            ? URL.createObjectURL(tempImages.imgAcademicTranscript4)
                                                                            : applicationData.imgAcademicTranscript4
                                                                    }
                                                                    alt="Học bạ học kỳ 1 lớp 11"
                                                                    className="img-preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                )}
                                                {showSemester2Year11 && (
                                                    <Col md={3} className="mt-2">
                                                        <Form.Label>Ảnh học bạ học kỳ 2 lớp 11</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleAcademicTranscriptUpload(e, 5)}
                                                        />
                                                        {(tempImages.imgAcademicTranscript5 || applicationData.imgAcademicTranscript5) && (
                                                            <div className="image-preview-container mt-2">
                                                                <img
                                                                    src={
                                                                        tempImages.imgAcademicTranscript5
                                                                            ? URL.createObjectURL(tempImages.imgAcademicTranscript5)
                                                                            : applicationData.imgAcademicTranscript5
                                                                    }
                                                                    alt="Học bạ học kỳ 2 lớp 11"
                                                                    className="img-preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                )}
                                                {showFinalYear11 && (
                                                    <Col md={3} className="mt-2">
                                                        <Form.Label>Ảnh học bạ cuối năm lớp 11</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleAcademicTranscriptUpload(e, 6)}
                                                        />
                                                        {(tempImages.imgAcademicTranscript6 || applicationData.imgAcademicTranscript6) && (
                                                            <div className="image-preview-container mt-2">
                                                                <img
                                                                    src={
                                                                        tempImages.imgAcademicTranscript6
                                                                            ? URL.createObjectURL(tempImages.imgAcademicTranscript6)
                                                                            : applicationData.imgAcademicTranscript6
                                                                    }
                                                                    alt="Học bạ cuối năm lớp 11"
                                                                    className="img-preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                )}
                                                {showSemester1Year12 && (
                                                    <Col md={3} className="mt-2">
                                                        <Form.Label>Ảnh học bạ học kỳ 1 lớp 12</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleAcademicTranscriptUpload(e, 7)}
                                                        />
                                                        {(tempImages.imgAcademicTranscript7 || applicationData.imgAcademicTranscript7) && (
                                                            <div className="image-preview-container mt-2">
                                                                <img
                                                                    src={
                                                                        tempImages.imgAcademicTranscript7
                                                                            ? URL.createObjectURL(tempImages.imgAcademicTranscript7)
                                                                            : applicationData.imgAcademicTranscript7
                                                                    }
                                                                    alt="Học bạ học kỳ 1 lớp 12"
                                                                    className="img-preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                )}
                                                {showFinalYear12 && (
                                                    <Col md={3} className="mt-2">
                                                        <Form.Label>Ảnh học bạ cuối năm lớp 12</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleAcademicTranscriptUpload(e, 9)}
                                                        />
                                                        {(tempImages.imgAcademicTranscript9 || applicationData.imgAcademicTranscript9) && (
                                                            <div className="image-preview-container mt-2">
                                                                <img
                                                                    src={
                                                                        tempImages.imgAcademicTranscript9
                                                                            ? URL.createObjectURL(tempImages.imgAcademicTranscript9)
                                                                            : applicationData.imgAcademicTranscript9
                                                                    }
                                                                    alt="Học bạ cuối năm lớp 12"
                                                                    className="img-preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                )}
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="light"
                                        type="submit"
                                        className="read-more-btn mt-3 me-3"
                                    >
                                        Lưu chỉnh sửa
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="read-more-btn mt-3 me-3"
                                        onClick={() => navigate(`/admissions-officer/chi-tiet-dang-ky-tuyen-sinh/${spId}`)}
                                    >
                                        Đóng
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                )
                }
            </Container >

        </div >
    );
};

export default AdmissionRegistrationEdit;