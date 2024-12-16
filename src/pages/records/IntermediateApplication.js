import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { Link, useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadImage from '../../firebase/uploadImage.js';

const IntermediateApplication = () => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
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
        imgpriority: "",
        imgAcademicTranscript1: "",
        priorityDetailPriorityID: null,
        campusName: "",
        studentCode: "",
    });

    // Lưu trữ ảnh tạm thời
    const [tempImages, setTempImages] = useState({
        imgpriority: null,
        imgCitizenIdentification1: null,
        imgCitizenIdentification2: null,
        imgAcademicTranscript1: null,
    });

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

    const { selectedCampus } = useOutletContext();
    const [isWithinAdmissionTime, setIsWithinAdmissionTime] = useState(false);
    const [admissionTimes, setAdmissionTimes] = useState([]); // Lưu toàn bộ dữ liệu thời gian tuyển sinh

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

    // Ngành học
    const [majors, setMajors] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedMajorName, setSelectedMajorName] = useState('');
    // Cập nhật formData và ngành học khi selectedCampus thay đổi
    useEffect(() => {
        if (selectedCampus?.id) {
            setFormData((prevData) => ({
                ...prevData,
                campusId: selectedCampus.id,
                campusName: selectedCampus.name,
            }));
            setSelectedMajor('');
            const fetchMajors = async () => {
                try {
                    const response = await api.get(`/Major/get-majors-college-for-vocational-school?campus=${selectedCampus.id}`);
                    setMajors(response.data);
                } catch (error) {
                    console.error('Lỗi khi lấy giá trị ngành học', error);
                }
            };
            fetchMajors();
        }
    }, [selectedCampus]);

    // Khi người dùng chọn ngành cho nguyện vọng
    const handleMajorChange = async (e) => {
        const selectedMajorId = e.target.value;
        setSelectedMajor(selectedMajorId);
        setFormData(prevData => ({
            ...prevData,
            major: selectedMajorId
        }));

        const selectedMajor = majors.find((major) => major.majorID === selectedMajorId);
        setSelectedMajorName(selectedMajor ? selectedMajor.majorName : '')

        // Kiểm tra lỗi và cập nhật
        const fieldError = await validateField("major", selectedMajorId, tempImages, formData);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            major: fieldError, // Xóa lỗi nếu không có lỗi
        }));
    };

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
    const [imgAcademicTranscript1, setImgAcademicTranscript1] = useState(null);

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
    // Bảng điểm
    const handleAcademicTranscript = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImages(prev => ({
                ...prev,
                imgAcademicTranscript1: file
            }));
            setImgAcademicTranscript1(URL.createObjectURL(file));
        }
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
            setIsLoading(false);
            return;
        }

        // Validate dữ liệu trước khi submit
        const isValid = await validateForm();
        if (!isValid) {
            toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại thông tin!");
            setIsLoading(false);
            return;
        }

        const uploadPromises = Object.entries(tempImages).map(async ([key, file]) => {
            if (file) {
                const folder = 'RegisterAdmission';
                try {
                    // Upload ảnh và lấy URL
                    const url = await uploadImage(file, folder);

                    // Cập nhật updatedFormData với URL ảnh đã upload
                    formData[key] = url;
                } catch (error) {
                    console.error(`Lỗi cập nhật ảnh lên firebase ${key}:`, error);
                }
            }
        });
        await Promise.all(uploadPromises);

        //Cập nhật lại formData với các URL ảnh
        setFormData(formData);
        try {
            const response = await api.post('/RegisterAdmission/add-register-admission', formData);
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
            <div className=" background-overlay">
                <div className="overlay"></div>
                <Container>
                    <Row>
                        <Col md={12} className="background-content">
                            <h2>Nộp hồ sơ trực tuyến</h2>
                            <h4>1. Điền thông tin xét tuyển</h4>
                            <h4>2. Chụp CCCD/CMND 2 mặt</h4>
                            <h4>3. Bảng điểm tốt nghiệp trung cấp</h4>
                        </Col>
                    </Row>
                </Container>
                <Row className="mt-5 background-content text-center justify-content-center align-items-center text-white bg-orange p-3 mx-auto w-75 rounded">
                    <div className="d-flex justify-content-center align-items-center">
                        <h4 className="text-black d-inline mb-0">Đăng ký tư vấn ngay tại đây</h4>
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
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-2">
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="citizenIentificationNumber">
                                        <Form.Label>Số CMND/CCCD</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số CMND/CCCD"
                                            value={formData.citizenIentificationNumber}
                                            onChange={handleChange}
                                        />
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
                                            <option value="">Tỉnh/thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </Form.Control>
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
                                    </Form.Group>
                                </Col>

                                <Col md={3} xs={12} className="mb-2">
                                    <Form.Group controlId="specificAddress">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số nhà, đường, ngõ..."
                                            value={formData.specificAddress}
                                            onChange={handleChange}
                                        />
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
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h4 className='text-orange mt-4'>Thông tin thí sinh khi học trung cấp</h4>
                            <Row>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="schoolName">
                                        <Form.Label>Trường học</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Trường THPT FPT"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="mt-2">
                                    <Form.Group controlId="studentCode">
                                        <Form.Label>Mã sinh viên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập mã sinh viên"
                                            value={formData.studentCode}
                                            onChange={handleChange}
                                        />
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
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h4 className='text-orange mt-4'>Thông tin đăng ký cơ sở</h4>
                            <Row className="mt-2">
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
                                <Col md={3} className="mb-2">
                                    <Form.Group controlId="major">
                                        <Form.Label>Nguyện vọng</Form.Label>
                                        <Form.Control as="select" value={selectedMajor} onChange={handleMajorChange}>
                                            <option value="">Chọn ngành</option>
                                            {majors.map(major => (
                                                <option key={major.majorID} value={major.majorID}>
                                                    {major.majorName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h4 className='text-orange mt-3'>Thông tin ưu tiên (nếu có)</h4>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Row>
                                        <Form.Label>Chọn đối tượng ưu tiên</Form.Label>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId="prioritySelection">
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
                                <Col md={6}>
                                    <Form.Group controlId="priorityDocument">
                                        <Form.Label>Giấy tờ ưu tiên</Form.Label>
                                        <Form.Control type="file" onChange={handleFileChangePriority} />
                                    </Form.Group>
                                </Col>
                            </Row>
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
                                                    value={formData.addressRecipientResults !== undefined ? formData.addressRecipientResults : ''}
                                                    onChange={handleChange}
                                                />
                                            )}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h4 className='text-orange mt-3'>Tải lên giấy tờ xác thực hồ sơ đăng ký học</h4>
                            <Row>
                                <Col md={6}>
                                    <Row>
                                        <Col md={6} className='mt-2'>
                                            <Form.Group>
                                                <Form.Label>Ảnh CMND/CCCD mặt trước</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFrontCCCDChange}
                                                />
                                                {frontCCCD && (
                                                    <div className="image-preview-container mt-2">
                                                        <img src={frontCCCD} alt="Mặt trước CCCD" className="img-preview" />
                                                    </div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} className='mt-2'>
                                            <Form.Group>
                                                <Form.Label>Ảnh CMND/CCCD mặt sau</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleBackCCCDChange}
                                                />
                                                {backCCCD && (
                                                    <div className="image-preview-container mt-2">
                                                        <img src={backCCCD} alt="Mặt sau CCCD" className="img-preview" />
                                                    </div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={3} className='mt-2'>
                                    <Form.Group>
                                        <Form.Label>Bảng điểm</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleAcademicTranscript(e)}
                                        />
                                        {imgAcademicTranscript1 && (
                                            <div className="image-preview-container mt-2">
                                                <img src={imgAcademicTranscript1} alt="Bảng điểm tốt nghiệp" className="img-preview" />
                                            </div>
                                        )}
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
        </div>
    );
};

export default IntermediateApplication;