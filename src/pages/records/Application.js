import React from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from '../hooks/Hooks.js';
import { Link, useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../apiService';
import uploadImage from '../../firebase/uploadImage.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Application = () => {

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
                console.log(start);
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

    const handleProvinceChange = (e) => {
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
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            province: validateField("province", selected),
            district: "",
            ward: "",
        }));
    };

    const handleDistrictChange = (e) => {
        const selected = e.target.value;
        setSelectedDistrict(selected);
        setFormData(prevState => ({
            ...prevState,
            district: selected,
            ward: ""
        }));

        // Cập nhật lỗi
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            district: validateField("district", selected),
            ward: "",
        }));
    };

    const handleWardChange = (e) => {
        const selected = e.target.value;
        setFormData(prevState => ({
            ...prevState,
            ward: selected
        }));
        // Cập nhật lỗi
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            ward: validateField("ward", selected),
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
    const [selectedMajor1, setSelectedMajor1] = useState('');
    const [selectedMajor2, setSelectedMajor2] = useState('');

    const [typeAdmissions1, setTypeAdmissions1] = useState([]);
    const [typeAdmissions2, setTypeAdmissions2] = useState([]);
    const [selectedAdmissionType1, setSelectedAdmissionType1] = useState(null);
    const [selectedAdmissionType2, setSelectedAdmissionType2] = useState(null);

    const [typeOfTranscriptMajor1, setTypeOfTranscriptMajor1] = useState(null);
    const [typeOfTranscriptMajor2, setTypeOfTranscriptMajor2] = useState(null);

    const [subjectGroups1, setSubjectGroups1] = useState([]);
    const [subjectGroups2, setSubjectGroups2] = useState([]);
    const [selectedGroupData1, setSelectedGroupData1] = useState(null);
    const [selectedGroupData2, setSelectedGroupData2] = useState(null);

    const [showSubjectSelection1, setShowSubjectSelection1] = useState(false);
    const [showSubjectSelection2, setShowSubjectSelection2] = useState(false);

    const [academicTranscriptsMajor1, setAcademicTranscriptsMajor1] = useState([]);
    const [academicTranscriptsMajor2, setAcademicTranscriptsMajor2] = useState([]);

    // Form nhập điểm động
    const [displayedFields, setDisplayedFields] = useState([]);
    const [displayedFields1, setDisplayedFields1] = useState([]);
    const [displayedFields2, setDisplayedFields2] = useState([]);

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
    const [showGraduationImage1, setShowGraduationImage1] = useState(false);
    const [showGraduationImage2, setShowGraduationImage2] = useState(false);

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
        major1: "",
        major2: "",
        yearOfGraduation: "",
        schoolName: "",
        recipientResults: true,
        permanentAddress: true,
        addressRecipientResults: "",
        imgCitizenIdentification1: "",
        imgCitizenIdentification2: "",
        imgDiplomaMajor1: "",
        imgDiplomaMajor2: "",
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
        typeOfDiplomaMajor1: null,
        typeOfTranscriptMajor1: null,
        typeOfDiplomaMajor2: null,
        typeOfTranscriptMajor2: null,
        priorityDetailPriorityID: null,
        campusName: "",
        academicTranscriptsMajor1: [],
        academicTranscriptsMajor2: [],
    });

    // Lưu trữ ảnh tạm thời
    const [tempImages, setTempImages] = useState({
        imgpriority: null,
        imgCitizenIdentification1: null,
        imgCitizenIdentification2: null,
        imgDiplomaMajor1: null,
        imgDiplomaMajor2: null,
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

    // Hàm lấy các trường nhập điểm duy nhất từ hai loại xét học bạ
    const getUniqueFields = (type1, type2) => {
        const fields1 = fieldMapping[type1] || [];
        const fields2 = fieldMapping[type2] || [];
        return Array.from(new Set([...fields1, ...fields2]));
    };

    // Khi người dùng chọn cơ sở, cập nhật ngành học
    // const handleCampusChange = async (e) => {
    //     const campusId = e.target.value;
    //     const campusName = campuses.find(campus => campus.campusId === campusId)?.campusName || '';

    //     setSelectedCampusForm(campusId);
    //     setFormData(prevData => ({
    //         ...prevData,
    //         campusId: campusId,
    //         campusName: campusName
    //     }));
    //     setSelectedMajor1('');
    //     setSelectedMajor2('');
    //     setTypeAdmissions1([]);
    //     setTypeAdmissions2([]);
    //     setSelectedAdmissionType1(null);
    //     setSelectedAdmissionType2(null);
    //     setShowSubjectSelection1(false);
    //     setShowSubjectSelection2(false);
    //     setSubjectGroups1([]);
    //     setSubjectGroups2([]);
    //     setAcademicTranscriptsMajor1([]);
    //     setAcademicTranscriptsMajor2([]);

    //     if (campusId) {
    //         try {
    //             const response = await api.get(`/Major/get-majors-college?campus=${campusId}`);
    //             setMajors(response.data);
    //             console.log(response.data);
    //         } catch (error) {
    //             console.error('Error fetching majors:', error);
    //         }
    //     } else {
    //         setMajors([]);
    //     }
    // };

    // Cập nhật formData và ngành học khi selectedCampus thay đổi
    useEffect(() => {
        if (selectedCampus?.id) {
            setFormData((prevData) => ({
                ...prevData,
                campusId: selectedCampus.id,
                campusName: selectedCampus.name,
            }));
            setSelectedMajor1('');
            setSelectedMajor2('');
            setTypeAdmissions1([]);
            setTypeAdmissions2([]);
            setSelectedAdmissionType1(null);
            setSelectedAdmissionType2(null);
            setShowSubjectSelection1(false);
            setShowSubjectSelection2(false);
            setSubjectGroups1([]);
            setSubjectGroups2([]);
            setAcademicTranscriptsMajor1([]);
            setAcademicTranscriptsMajor2([]);

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
    const handleMajorChange1 = (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor1(selectedMajorId);
        setSelectedAdmissionType1(null);
        setDisplayedFields1([]);
        setAcademicTranscriptsMajor1([]);

        setShowGraduationImage1(!!selectedMajorId); // Hiển thị trường tải ảnh nếu có ngành được chọn

        const selectedMajor = majors.find((major) => major.majorID === selectedMajorId);
        setTypeAdmissions1(selectedMajor?.typeAdmissions || []);
        setShowSubjectSelection1(false);

        setFormData(prevData => ({
            ...prevData,
            major1: selectedMajorId
        }));
    };

    // Khi người dùng chọn ngành cho nguyện vọng 2
    const handleMajorChange2 = (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor2(selectedMajorId);
        setSelectedAdmissionType2(null);
        setDisplayedFields2([]);
        setAcademicTranscriptsMajor2([]);

        setShowGraduationImage2(!!selectedMajorId); // Hiển thị trường tải ảnh nếu có ngành được chọn

        const selectedMajor = majors.find((major) => major.majorID === selectedMajorId);
        setTypeAdmissions2(selectedMajor?.typeAdmissions || []);
        setShowSubjectSelection2(false);
        setFormData(prevData => ({
            ...prevData,
            major2: selectedMajorId
        }));
    };

    // Khi chọn loại xét tuyển NV1
    const handleAdmissionTypeChange1 = (e) => {
        const typeId = parseInt(e.target.value, 10);
        setSelectedAdmissionType1(typeId);
        setDisplayedFields1([]);
        setAcademicTranscriptsMajor1([]);
        setSelectedGroupData1([]);

        const selectedMajor = majors.find((major) => major.majorID === selectedMajor1);
        const selectedAdmissionType = selectedMajor?.typeAdmissions.find(admission => admission.typeDiploma === typeId);
        const typeOfTranscript = selectedAdmissionType?.typeOfTranscript ?? null;

        setTypeOfTranscriptMajor1(typeOfTranscript);
        setFormData(prevData => ({
            ...prevData,
            typeOfDiplomaMajor1: typeId,
            typeOfTranscriptMajor1: typeOfTranscript
        }));
        if (typeId === 3 || typeId === 5) {
            setSubjectGroups1(selectedMajor?.subjectGroupDTOs || []);
            setShowSubjectSelection1(true);
        } else {
            setShowSubjectSelection1(false);
            setSubjectGroups1([]);
        }
    };
    // Khi chọn loại xét tuyển NV2
    const handleAdmissionTypeChange2 = (e) => {
        const typeId = parseInt(e.target.value, 10);
        setSelectedAdmissionType2(typeId);
        setDisplayedFields2([]);
        setAcademicTranscriptsMajor2([]);
        setSelectedGroupData2([]);

        const selectedMajor = majors.find((major) => major.majorID === selectedMajor2);
        const selectedAdmissionType = selectedMajor?.typeAdmissions.find(admission => admission.typeDiploma === typeId);
        const typeOfTranscript = selectedAdmissionType?.typeOfTranscript ?? null;

        setTypeOfTranscriptMajor2(typeOfTranscript);
        setFormData(prevData => ({
            ...prevData,
            typeOfDiplomaMajor2: typeId,
            typeOfTranscriptMajor2: typeOfTranscript
        }));

        if (typeId === 3 || typeId === 5) {
            setSubjectGroups2(selectedMajor?.subjectGroupDTOs || []);
            setShowSubjectSelection2(true);
        } else {
            setShowSubjectSelection2(false);
            setSubjectGroups2([]);
        }
    };

    const handleSubjectGroupChange1 = (e) => {
        const selectedGroup = e.target.value;
        const selectedGroupData = subjectGroups1.find(group => group.subjectGroup === selectedGroup);
        if (selectedGroupData) {
            setSelectedGroupData1(selectedGroupData);
            setAcademicTranscriptsMajor1([]);
            setDisplayedFields1([]);
        } else {
            setSelectedGroupData1(null);
        }

        // Kiểm tra xem người dùng đang chọn xét tuyển học bạ hay xét điểm thi THPT
        if (selectedAdmissionType1 === 5 && selectedGroupData) {
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

            setDisplayedFields1(generatedFields);
        } else if (selectedGroupData && typeOfTranscriptMajor1 !== null) {
            // Nếu chọn loại xét tuyển học bạ (typeOfTranscript khác null)
            const subjects = selectedGroupData.subjectGroupName.split("–").map(sub => sub.trim());

            // Tạo các trường nhập điểm theo cấu trúc học bạ
            const generatedFields = generateScoreFields(subjects, typeOfTranscriptMajor1).map(field => {
                // Xử lý logic độ rộng cột
                const columnWidthPercentage = typeOfTranscriptMajor1 === 3 ? 20 : 33;
                return { ...field, columnWidthPercentage };
            });

            setDisplayedFields1(generatedFields);
        } else {
            setDisplayedFields1([]);
        }
    };

    const handleSubjectGroupChange2 = (e) => {
        const selectedGroup = e.target.value;
        const selectedGroupData = subjectGroups2.find(group => group.subjectGroup === selectedGroup);
        if (selectedGroupData) {
            setSelectedGroupData2(selectedGroupData);
            setAcademicTranscriptsMajor2([]);
            setDisplayedFields2([]);
        } else {
            setSelectedGroupData2(null);
        }
        // Kiểm tra xem người dùng đang chọn xét tuyển học bạ hay xét điểm thi THPT
        if (selectedAdmissionType2 === 5 && selectedGroupData) {
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

            setDisplayedFields2(generatedFields);
        } else if (selectedGroupData && typeOfTranscriptMajor2 !== null) {
            // Nếu chọn loại xét tuyển học bạ (typeOfTranscript khác null)
            const subjects = selectedGroupData.subjectGroupName.split("–").map(sub => sub.trim());

            // Tạo các trường nhập điểm theo cấu trúc học bạ
            const generatedFields = generateScoreFields(subjects, typeOfTranscriptMajor2).map(field => {
                // Xử lý logic độ rộng cột
                const columnWidthPercentage = typeOfTranscriptMajor2 === 3 ? 20 : 33;
                return { ...field, columnWidthPercentage };
            });

            setDisplayedFields2(generatedFields);
        } else {
            setDisplayedFields2([]);
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
        if (selectedAdmissionType1 === 5) {
            const [subject, index] = name.split("_");
            // Cập nhật `academicTranscripts` với môn học và điểm
            setAcademicTranscriptsMajor1(prevTranscripts => {
                const updatedTranscripts = [...prevTranscripts];

                const existingTranscriptIndex = updatedTranscripts.findIndex(
                    item => item.typeOfAcademicTranscript === Number(index)
                );

                if (existingTranscriptIndex !== -1) {
                    // Cập nhật điểm môn học đã tồn tại
                    updatedTranscripts[existingTranscriptIndex].subjectPoint = Number(value);
                } else {
                    // Thêm mới điểm môn học vào `academicTranscriptsMajor1`
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
            const selectedSubjects = selectedGroupData1.subjectGroupName.split("–").map(sub => sub.trim());
            const subjectIndex = selectedSubjects.indexOf(subject);

            // Lấy vị trí của cột trong `fieldMapping[typeOfTranscript]` (danh sách kỳ học)
            const fieldIndex = fieldMapping[typeOfTranscriptMajor1]?.indexOf(field);

            // Kiểm tra tính hợp lệ của subjectIndex và fieldIndex
            if (subjectIndex === -1 || fieldIndex === -1) {
                console.error("Subject or field not found in mappings");
                return;
            }
            // Tính toán `typeOfAcademicTranscript` dựa trên vị trí của `subjectIndex` và `fieldIndex`
            const typeOfAcademicTranscript = indexMap[subjectIndex][fieldIndex];

            // Cập nhật `academicTranscriptsMajor1` 
            setAcademicTranscriptsMajor1(prevTranscripts => {
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

    // Xử lý thay đổi điểm cho nguyện vọng 2
    const handleScoreChange2 = (e) => {
        const { name, value } = e.target;
        if (selectedAdmissionType2 === 5) {
            // Trường hợp xét điểm thi THPT cho nguyện vọng 2
            const [subject, index] = name.split("_");

            setAcademicTranscriptsMajor2(prevTranscripts => {
                const updatedTranscripts = [...prevTranscripts];

                const existingTranscriptIndex = updatedTranscripts.findIndex(
                    item => item.typeOfAcademicTranscript === Number(index)
                );

                if (existingTranscriptIndex !== -1) {
                    // Cập nhật điểm môn học đã tồn tại
                    updatedTranscripts[existingTranscriptIndex].subjectPoint = Number(value);
                } else {
                    // Thêm mới điểm môn học vào `academicTranscriptsMajor2`
                    updatedTranscripts.push({
                        subjectName: subject,
                        subjectPoint: Number(value),
                        typeOfAcademicTranscript: Number(index)
                    });
                }

                return updatedTranscripts;
            });
        } else {
            // Trường hợp xét học bạ cho nguyện vọng 2
            const [subject, field] = name.split("_");

            // Lấy vị trí của Môn học trong tổ hợp đã chọn
            const selectedSubjects = selectedGroupData2.subjectGroupName.split("–").map(sub => sub.trim());
            const subjectIndex = selectedSubjects.indexOf(subject);

            const fieldIndex = fieldMapping[typeOfTranscriptMajor2]?.indexOf(field);
            if (subjectIndex === -1 || fieldIndex === -1) {
                console.error("Subject or field not found in mappings");
                return;
            }

            const typeOfAcademicTranscript = indexMap[subjectIndex][fieldIndex];

            setAcademicTranscriptsMajor2(prevTranscripts => {
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
        const selectedMajor1Data = majors.find((major) => major.majorID === selectedMajor1);
        const selectedMajor2Data = majors.find((major) => major.majorID === selectedMajor2);

        const selectedType1 = selectedMajor1Data?.typeAdmissions.find(
            (type) => type.typeDiploma === selectedAdmissionType1
        );
        const selectedType2 = selectedMajor2Data?.typeAdmissions.find(
            (type) => type.typeDiploma === selectedAdmissionType2
        );

        // Cập nhật displayedFields dựa trên các loại xét học bạ đã chọn
        const fields = getUniqueFields(selectedType1?.typeOfTranscript, selectedType2?.typeOfTranscript);
        setDisplayedFields(fields);
        // Xác định có cần hiện form nhập ảnh học bạ
        setShowSemester1Year10(fields.includes('HK1-10'));
        setShowSemester2Year10(fields.includes('HK2-10'));
        setShowFinalYear10(fields.includes('CN10'));
        setShowSemester1Year11(fields.includes('HK1-11'));
        setShowSemester2Year11(fields.includes('HK2-11'));
        setShowFinalYear11(fields.includes('CN11'));
        setShowSemester1Year12(fields.includes('HK1-12'));
        setShowFinalYear12(fields.includes('CN12'));
    }, [selectedAdmissionType1, selectedAdmissionType2, selectedMajor1, selectedMajor2, majors]);

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
        console.log(formErrors);
    };
    const handleFileChangePriority = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImages(prev => ({ ...prev, imgpriority: file }));
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgpriority: validateField("imgpriority", null, { ...tempImages, imgpriority: file }, formData),
            }));
        } else {
            // Nếu không có file (hủy chọn ảnh), reset lại tempImages và formErrors
            setTempImages(prev => ({ ...prev, imgpriority: null }));
            setFormErrors(prevErrors => ({
                ...prevErrors,
                imgpriority: null, // Reset lỗi nếu ảnh không được chọn
            }));
        }
        console.log(formErrors);
    };

    // Xử lý CCCD và bằng
    const [showOtherAddress, setShowOtherAddress] = useState(false);
    const [frontCCCD, setFrontCCCD] = useState(null);
    const [backCCCD, setBackCCCD] = useState(null);
    const [diplomaMajor1, setDiplomaMajor1] = useState(null);
    const [diplomaMajor2, setDiplomaMajor2] = useState(null);

    // Ảnh mặt trước
    const handleFrontCCCDChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFrontCCCD(URL.createObjectURL(file));
            setTempImages(prev => ({ ...prev, imgCitizenIdentification1: file }));
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification1: validateField("imgCitizenIdentification1", null, { ...tempImages, imgCitizenIdentification1: file }, formData),
            }));
        } else {
            // Nếu không có tệp nào được chọn, xóa trạng thái liên quan
            setFrontCCCD(null);
            setTempImages((prev) => ({ ...prev, imgCitizenIdentification1: null }));
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification1: validateField("imgCitizenIdentification1", null, { ...tempImages, imgCitizenIdentification1: null }, formData),
            }));
        }
    };
    // Ảnh mặt sau
    const handleBackCCCDChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackCCCD(URL.createObjectURL(file));
            setTempImages(prev => ({ ...prev, imgCitizenIdentification2: file }));
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification2: validateField("imgCitizenIdentification2", null, { ...tempImages, imgCitizenIdentification2: file }, formData),
            }));
        } else {
            // Nếu không có tệp nào được chọn, xóa trạng thái liên quan
            setBackCCCD(null);
            setTempImages((prev) => ({ ...prev, imgCitizenIdentification2: null }));
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                imgCitizenIdentification2: validateField("imgCitizenIdentification2", null, { ...tempImages, imgCitizenIdentification2: null }, formData),
            }));
        }
    };
    // Ảnh tốt nghiệp
    const handleGraduationCertificateChange = (e, isMajor1) => {
        const file = e.target.files[0];
        if (file) {
            // Tạo URL object cho ảnh
            const objectURL = URL.createObjectURL(file);

            setTempImages(prev => ({
                ...prev,
                [isMajor1 ? 'imgDiplomaMajor1' : 'imgDiplomaMajor2']: file
            }));

            if (isMajor1) {
                setDiplomaMajor1(objectURL);  // setDiplomaMajor1 là state lưu URL cho ảnh ngành 1
            } else {
                setDiplomaMajor2(objectURL);  // setDiplomaMajor2 là state lưu URL cho ảnh ngành 2
            }
            setFormErrors(prevErrors => ({
                ...prevErrors,
                [isMajor1 ? "imgDiplomaMajor1" : "imgDiplomaMajor2"]: validateField(
                    isMajor1 ? "imgDiplomaMajor1" : "imgDiplomaMajor2",
                    file,
                    tempImages,
                    formData
                ),
            }));
        } else {
            // Xử lý khi nhấn Cancel hoặc không có file được chọn
            setTempImages(prev => ({
                ...prev,
                [isMajor1 ? "imgDiplomaMajor1" : "imgDiplomaMajor2"]: null,
            }));

            // Xóa ảnh xem trước
            if (isMajor1) {
                setDiplomaMajor1(null); // Xóa ảnh ngành 1
            } else {
                setDiplomaMajor2(null); // Xóa ảnh ngành 2
            }

            // Xóa lỗi tương ứng
            setFormErrors(prevErrors => ({
                ...prevErrors,
                [isMajor1 ? "imgDiplomaMajor1" : "imgDiplomaMajor2"]: validateField(
                    isMajor1 ? "imgDiplomaMajor1" : "imgDiplomaMajor2",
                    null,
                    tempImages,
                    formData
                ),
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

    const handleChange = (e) => {
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

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [id]: validateField(id, updatedValue),
        }));
    };

    // Validate
    const validateField = (field, value, tempImages, formData) => {
        let error = "";
        const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"]; // Loại tệp cho phép

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
                } else if (!/^\d{9}$|^\d{12}$/.test(value)) {
                    error = "CCCD/CMND phải có 9 hoặc 12 chữ số.";
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
            case "phoneParents":
                const phoneRegex = /^[0-9]{10,11}$/;
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
            case "major1":
                if (!value) {
                    error = "Ngành học Nguyện vọng 1 không được để trống.";
                }
                break;

            case "typeOfDiplomaMajor1":
                if (!value) {
                    error = "Loại xét tuyển Nguyện vọng 1 không được để trống.";
                }
                break;
            case "academicTranscriptsMajor1":
                if (selectedAdmissionType1 === 3 || selectedAdmissionType1 === 5) {
                    displayedFields1.forEach(field => {
                        const transcript = academicTranscriptsMajor1.find(
                            item => item.name === field.name
                        );
                        const point = transcript?.subjectPoint;

                        if (!point && point !== 0) {
                            error = `Điểm của môn ${field.subject} không được để trống.`;
                        } else if (isNaN(point) || point < 0 || point > 10) {
                            error = `Điểm của môn ${field.subject} phải là số từ 0 đến 10.`;
                        }
                    });
                }
                break;
            // Thêm check NV2
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

            case "imgDiplomaMajor1":
                if (!tempImages?.imgDiplomaMajor1) {
                    error = "Ảnh bằng tốt nghiệp xét NV1 là bắt buộc.";
                } else if (!allowedFileTypes.includes(tempImages?.imgDiplomaMajor1?.type)) {
                    error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                }
                break;

            case "imgDiplomaMajor2":
                if (showGraduationImage2 && !tempImages?.imgDiplomaMajor2) {
                    error = "Ảnh bằng tốt nghiệp xét NV2 là bắt buộc.";
                } else if (
                    showGraduationImage2 &&
                    !allowedFileTypes.includes(tempImages?.imgDiplomaMajor2?.type)
                ) {
                    error = "Chỉ chấp nhận tệp ảnh (jpg, jpeg, png).";
                }
                break;
            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        const errors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field], tempImages, formData);
            if (error) errors[field] = error;
        });
        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
    };

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
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
        if (!validateForm()) {
            toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại các trường bị lỗi!");
            setIsLoading(false);
            return;
        }

        // Khởi tạo updatedFormData với dữ liệu ban đầu
        const updatedFormData = {
            ...formData,
            academicTranscriptsMajor1,
            academicTranscriptsMajor2
        };

        // Duyệt qua các ảnh trong tempImages và upload
        // for (const [key, file] of Object.entries(tempImages)) {
        //     if (file) {
        //         const folder = 'RegisterAdmission';
        //         try {
        //             // Upload ảnh và lấy URL
        //             const url = await uploadImage(file, folder);

        //             // Cập nhật updatedFormData với URL ảnh đã upload
        //             updatedFormData[key] = url;
        //         } catch (error) {
        //             console.error(`Error uploading ${key}:`, error);
        //         }
        //     }
        // }
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

        setLoadingMessage('Chuẩn bị thanh toán...');
        // Cập nhật lại formData với các URL ảnh và các điểm của academicTranscripts
        setFormData(updatedFormData);
        sessionStorage.setItem('formData', JSON.stringify(updatedFormData));

        const selectedCampusPost = {
            campus: selectedCampus.id
        };
        try {
            // Gửi yêu cầu thanh toán đến VNPAY
            const paymentResponse = await api.post('/VNPay/pay-register-admission', selectedCampusPost);
            // const paymentResponse = await axios.post(
            //     'https://roughy-finer-seemingly.ngrok-free.app/api/VNPay/pay-register-admission',
            //     selectedCampusPost
            // );
            const { paymentUrl } = paymentResponse.data;

            // Chuyển hướng người dùng đến trang thanh toán của VNPAY
            window.location.href = paymentUrl;
        } catch (error) {
            toast.error('Lỗi khi gửi yêu cầu thanh toán, vui lòng thử lại!');
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
                                <h6 className='mt-2'>Nguyện vọng 1</h6>
                                <Col md={3}>
                                    <Form.Group controlId="major1" className='mb-2'>
                                        <Form.Label>Ngành học Nguyện vọng 1</Form.Label>
                                        <Form.Control as="select" value={selectedMajor1} onChange={handleMajorChange1}>
                                            <option value="">Chọn ngành</option>
                                            {majors.map(major => (
                                                <option key={major.majorID} value={major.majorID}>
                                                    {major.majorName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        {formErrors.major1 && <p className="error">{formErrors.major1}</p>}
                                    </Form.Group>
                                </Col>

                                {typeAdmissions1.length > 0 && (
                                    <Col md={3}>
                                        <Form.Group controlId="typeOfDiplomaMajor1" className='mb-2'>
                                            <Form.Label>Loại xét tuyển Nguyện vọng 1</Form.Label>
                                            <Form.Control as="select"
                                                value={selectedAdmissionType1 !== null && selectedAdmissionType1 !== undefined ? selectedAdmissionType1 : ''}
                                                onChange={handleAdmissionTypeChange1}
                                            >
                                                <option value="">Chọn loại xét tuyển</option>
                                                {typeAdmissions1.map((admission, index) => (
                                                    <option key={index} value={admission.typeDiploma}>
                                                        {TypeOfDiploma[admission.typeDiploma]}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            {formErrors.typeOfDiplomaMajor1 && <p className="error">{formErrors.typeOfDiplomaMajor1}</p>}
                                        </Form.Group>
                                    </Col>
                                )}

                                {showSubjectSelection1 && (
                                    <Row>
                                        <Form.Label>Khối xét tuyển Nguyện vọng 1</Form.Label>
                                        <Col md={3}>
                                            <Form.Group controlId="subjectSelection1" className='mb-2'>
                                                <Form.Control as="select"
                                                    value={selectedGroupData1?.subjectGroup || ''}
                                                    onChange={handleSubjectGroupChange1}
                                                >
                                                    <option value="">Chọn khối</option>
                                                    {subjectGroups1.map(subject => (
                                                        <option key={subject.subjectGroup} value={subject.subjectGroup}>
                                                            {subject.subjectGroupName}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Group controlId="subjectScores1" className="mb-2">
                                                <div className="score-inputs" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                    {displayedFields1.map((field, index) => {
                                                        let transcript;
                                                        if (selectedAdmissionType1 === 5) {
                                                            // Xét điểm THPT
                                                            const [subject, index] = field.name.split("_");

                                                            transcript = academicTranscriptsMajor1.find(
                                                                item => item.typeOfAcademicTranscript === Number(index)
                                                            );
                                                        } else {
                                                            // Xét học bạ
                                                            const selectedSubjects = selectedGroupData1.subjectGroupName.split("–").map(sub => sub.trim());
                                                            const subjectIndex = selectedSubjects.indexOf(field.subject);
                                                            const fieldIndex = fieldMapping[typeOfTranscriptMajor1]?.indexOf(field.name.split("_")[1]);

                                                            // Tính toán typeOfAcademicTranscript
                                                            const typeOfAcademicTranscript =
                                                                subjectIndex !== -1 && fieldIndex !== -1 ? indexMap[subjectIndex][fieldIndex] : null;

                                                            transcript = academicTranscriptsMajor1.find(
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
                                            {formErrors.academicTranscriptsMajor1 && <p className="error">{formErrors.academicTranscriptsMajor1}</p>}
                                        </Col>
                                    </Row>
                                )}
                            </Row>
                            <Row className='mt-4'>
                                <h6 className='mt-2'>Nguyện vọng 2</h6>
                                <Col md={3}>
                                    <Form.Group controlId="majorSelection2" className='mb-2'>
                                        <Form.Label>Ngành học Nguyện vọng 2</Form.Label>
                                        <Form.Control as="select" value={selectedMajor2} onChange={handleMajorChange2}>
                                            <option value="">Chọn ngành</option>
                                            {majors.map(major => (
                                                <option key={major.majorID} value={major.majorID}>
                                                    {major.majorName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        {formErrors.major2 && <p className="error">{formErrors.major2}</p>}
                                    </Form.Group>
                                </Col>

                                {typeAdmissions2.length > 0 && (
                                    <Col md={3}>
                                        <Form.Group controlId="admissionTypeSelection2" className='mb-2'>
                                            <Form.Label>Loại xét tuyển Nguyện vọng 2</Form.Label>
                                            <Form.Control as="select"
                                                value={selectedAdmissionType2 !== null && selectedAdmissionType2 !== undefined ? selectedAdmissionType2 : ''}
                                                onChange={handleAdmissionTypeChange2}
                                            >
                                                <option value="">Chọn loại xét tuyển</option>
                                                {typeAdmissions2.map((admission, index) => (
                                                    <option key={index} value={admission.typeDiploma}>
                                                        {TypeOfDiploma[admission.typeDiploma]}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                )}
                                {showSubjectSelection2 && (
                                    <Row>
                                        <Form.Label>Khối xét tuyển Nguyện vọng 2</Form.Label>
                                        <Col md={3}>
                                            <Form.Group controlId="subjectSelection2" className='mb-2'>
                                                <Form.Control as="select"
                                                    value={selectedGroupData2?.subjectGroup || ''}
                                                    onChange={handleSubjectGroupChange2}
                                                >
                                                    <option value="">Chọn khối</option>
                                                    {subjectGroups2.map(subject => (
                                                        <option key={subject.subjectGroup} value={subject.subjectGroup}>
                                                            {subject.subjectGroupName}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Group controlId="subjectScores2" className="mb-2">
                                                <div className="score-inputs" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                    {displayedFields2.map((field, index) => {
                                                        let transcript2;
                                                        if (selectedAdmissionType2 === 5) {
                                                            // Xét điểm THPT cho nguyện vọng 2
                                                            const [subject, index] = field.name.split("_");

                                                            transcript2 = academicTranscriptsMajor2.find(
                                                                item => item.typeOfAcademicTranscript === Number(index)
                                                            );
                                                        } else {
                                                            // Xét học bạ cho nguyện vọng 2
                                                            const selectedSubjects2 = selectedGroupData2.subjectGroupName.split("–").map(sub => sub.trim());
                                                            const subjectIndex2 = selectedSubjects2.indexOf(field.subject);
                                                            const fieldIndex2 = fieldMapping[typeOfTranscriptMajor2]?.indexOf(field.name.split("_")[1]);

                                                            // Tính toán typeOfAcademicTranscript cho nguyện vọng 2
                                                            const typeOfAcademicTranscript2 =
                                                                subjectIndex2 !== -1 && fieldIndex2 !== -1 ? indexMap[subjectIndex2][fieldIndex2] : null;

                                                            transcript2 = academicTranscriptsMajor2.find(
                                                                item => item.typeOfAcademicTranscript === typeOfAcademicTranscript2
                                                            );
                                                        }

                                                        return (
                                                            <div key={index} className="score-input" style={{ width: `${field.columnWidthPercentage}%`, padding: '0 4px' }}>
                                                                <Form.Control
                                                                    className="mb-2"
                                                                    type="number"
                                                                    placeholder={`${field.subject} (${field.field})`}
                                                                    name={field.name}
                                                                    value={transcript2 ? transcript2.subjectPoint : ""}
                                                                    onChange={handleScoreChange2}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </Form.Group>
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
                                        onChange={handleChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Phụ huynh/Người bảo trợ"
                                        name="recipientResults"
                                        id="recipientResults"
                                        value="false"
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

                            {showGraduationImage1 && (
                                <Col md={3} className='mt-2'>
                                    <Form.Group>
                                        <Form.Label>Bằng tốt nghiệp xét NV1</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleGraduationCertificateChange(e, true)}
                                            required
                                        />
                                        {diplomaMajor1 && (
                                            <div className="image-preview-container mt-2">
                                                <img src={diplomaMajor1} alt="Bằng tốt nghiệp ngành 1" className="img-preview" />
                                            </div>
                                        )}
                                        {formErrors.imgDiplomaMajor1 && <p className="error">{formErrors.imgDiplomaMajor1}</p>}
                                    </Form.Group>
                                </Col>
                            )}

                            {showGraduationImage2 && (
                                <Col md={3} className='mt-2'>
                                    <Form.Group>
                                        <Form.Label>Bằng tốt nghiệp xét NV2</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleGraduationCertificateChange(e, false)}
                                            required
                                        />
                                        {diplomaMajor2 && (
                                            <div className="image-preview-container mt-2">
                                                <img src={diplomaMajor2} alt="Bằng tốt nghiệp ngành 2" className="img-preview" />
                                            </div>
                                        )}
                                        {formErrors.imgDiplomaMajor2 && <p className="error">{formErrors.imgDiplomaMajor2}</p>}
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