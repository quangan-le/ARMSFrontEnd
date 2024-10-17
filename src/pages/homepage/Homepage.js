// src/pages/Homepage.js
import React from "react";
import { Container, Row, Col, Button, Card, Form, Carousel } from "react-bootstrap";
import { Link, useOutletContext } from 'react-router-dom';
import SliderBanner from "./SilderBanner";
import { useState, useEffect } from '../hooks/Hooks.js';
import api from "../../apiService.js";
import MultiCarousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const content = {
  "Đối tượng và hình thức": (
    <div>
      <h4>Đối tượng</h4>
      <p>
        Thí sinh thuộc một trong các đối tượng sau sẽ đủ điều kiện trở thành học sinh của trường:
      </p>
      <ul>
        <li><strong>Hệ chính thức:</strong></li>
        <li>Tốt nghiệp THCS hoặc tương đương;</li>
        <li>Sinh viên đã hoàn thành chương trình Trung cấp.</li>
      </ul>

      <h4>Hình thức tuyển sinh</h4>
      <p>Xét tuyển hồ sơ</p>

      <h4>Thời gian đào tạo</h4>
      <p>2 năm, gồm 6 học kỳ liên tục.</p>
    </div>
  ),
  "Thời gian": "Thời gian tuyển sinh sẽ diễn ra từ tháng 3 đến tháng 9 năm 2024, với các đợt xét tuyển khác nhau tùy theo từng ngành.",
  "Chuyên ngành": "Danh sách các chuyên ngành đào tạo: Công nghệ thông tin, Quản trị kinh doanh, Ngôn ngữ Anh, Marketing, Kỹ thuật phần mềm, và nhiều ngành khác.",
  "Hồ sơ nhập học": "Hồ sơ nhập học cần bao gồm: bản sao công chứng bằng tốt nghiệp, bảng điểm, giấy khai sinh, và các giấy tờ liên quan khác.",
  "Học phí": "Học phí sẽ được tính theo tín chỉ, với các mức khác nhau cho từng ngành học. Trung bình từ 500,000 VND đến 1,200,000 VND một tín chỉ."
};

const mockData = [
  {
    "majorID": "A",
    "majorName": "Ngôn ngữ",
    "specializeMajorDTOs": [
      { "specializeMajorID": "EA", "specializeMajorName": "Ngôn ngữ anh" },
      { "specializeMajorID": "JA", "specializeMajorName": "Ngôn ngữ nhật" },
      { "specializeMajorID": "KA", "specializeMajorName": "Ngôn ngữ hàn" }
    ]
  },
  {
    "majorID": "B",
    "majorName": "Làm đẹp",
    "specializeMajorDTOs": [
      { "specializeMajorID": "BS", "specializeMajorName": "Chăm sóc da và massage" },
      { "specializeMajorID": "BT", "specializeMajorName": "Phum xăm thẩm mỹ" }
    ]
  },
  {
    "majorID": "E",
    "majorName": "Công nghệ thông tin",
    "specializeMajorDTOs": [
      { "specializeMajorID": "GE", "specializeMajorName": "Lập trình game" },
      { "specializeMajorID": "ME", "specializeMajorName": "Lập trình mobile" },
      { "specializeMajorID": "TE", "specializeMajorName": "Kiểm thử" },
      { "specializeMajorID": "WE", "specializeMajorName": "Lập trình web" }
    ]
  },
  {
    "majorID": "O",
    "majorName": "Ngành khác",
    "specializeMajorDTOs": [
      { "specializeMajorID": "AO", "specializeMajorName": "Kiểm toán" },
      { "specializeMajorID": "FO", "specializeMajorName": "Kỹ thuật chế biến món ăn" },
      { "specializeMajorID": "SO", "specializeMajorName": "Thư ký văn phòng" }
    ]
  },
  {
    "majorID": "S",
    "majorName": "Quản trị kinh doanh",
    "specializeMajorDTOs": [
      { "specializeMajorID": "HM", "specializeMajorName": "Quản trị khách sạn" },
      { "specializeMajorID": "RM", "specializeMajorName": "Quản trị nhà hàng" },
      { "specializeMajorID": "SM", "specializeMajorName": "Marketing" }
    ]
  }
];


const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Đối tượng và hình thức');
  const { selectedCampus } = useOutletContext();

  // State để lưu danh sách banner tương ứng với campus được chọn
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy danh sách banner dựa trên `selectedCampus`
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        if (selectedCampus.id) {
          const response = await api.get(`/Campus/get-sliders?campusId=${selectedCampus.id}`);
          setBanners(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách banner:", error);
        setLoading(false);
      }
    };

    if (selectedCampus.id) {
      fetchBanners();
    }
  }, [selectedCampus]);

  // Ngành học
  const [majors, setMajors] = useState([]);
  // useEffect(() => {
  //   if (selectedCampus.id) {
  //     const fetchData = async () => {
  //       try {
  //         const response = await api.get(`/Major/get-majors?campus=${selectedCampus.id}`);
  //         setMajors(response.data);
  //       } catch (error) {
  //         console.error('Có lỗi xảy ra khi lấy danh sách ngành học:', error);
  //       }
  //     };
  //     fetchData();
  //   }
  // }, [selectedCampus]);
  useEffect(() => {
    setMajors(mockData);
  }, []);
  // Carousel settings for majors
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // Lưu bút
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    const fixedTestimonials = [
      {
        alumiStudentId: 1,
        img: 'https://iap-poly.s3.ap-southeast-1.amazonaws.com/wallpaper/hero3.JPG?fbclid=IwAR15AUsvOgZGnip3gywPuPnaCXlsypsu4tgjlLmppM_ZQti_TGh8MWaynIU',
        fullName: 'Nguyễn Văn A',
        desciption: 'Thật tuyệt vời khi được học tại đây!',
        specializeMajorName: 'Lập trình web',
        campusName: 'Cơ sở Hà Nội',
      },
      {
        alumiStudentId: 2,
        img: 'https://iap-poly.s3.ap-southeast-1.amazonaws.com/wallpaper/hero3.JPG?fbclid=IwAR15AUsvOgZGnip3gywPuPnaCXlsypsu4tgjlLmppM_ZQti_TGh8MWaynIU',
        fullName: 'Trần Thị B',
        desciption: 'Một trải nghiệm học tập đáng nhớ!',
        specializeMajorName: 'Marketing',
        campusName: 'Cơ sở TP.HCM',
      },
      {
        alumiStudentId: 3,
        img: 'https://iap-poly.s3.ap-southeast-1.amazonaws.com/wallpaper/hero3.JPG?fbclid=IwAR15AUsvOgZGnip3gywPuPnaCXlsypsu4tgjlLmppM_ZQti_TGh8MWaynIU',
        fullName: 'Phạm Văn C',
        desciption: 'Giảng viên rất tận tình và hỗ trợ.',
        specializeMajorName: 'Lập trình game',
        campusName: 'Cơ sở Đà Nẵng',
      },
      {
        alumiStudentId: 4,
        img: 'https://iap-poly.s3.ap-southeast-1.amazonaws.com/wallpaper/hero3.JPG?fbclid=IwAR15AUsvOgZGnip3gywPuPnaCXlsypsu4tgjlLmppM_ZQti_TGh8MWaynIU',
        fullName: 'Lê Thị D',
        desciption: 'Cơ sở vật chất hiện đại và tiện nghi.',
        specializeMajorName: 'Ngôn ngữ anh',
        campusName: 'Cơ sở Cần Thơ',
      },
      {
        alumiStudentId: 5,
        img: 'https://iap-poly.s3.ap-southeast-1.amazonaws.com/wallpaper/hero3.JPG?fbclid=IwAR15AUsvOgZGnip3gywPuPnaCXlsypsu4tgjlLmppM_ZQti_TGh8MWaynIU',
        fullName: 'Ngô Văn E',
        desciption: 'Chương trình học rất phong phú và bổ ích.',
        specializeMajorName: 'Phum xăm thẩm mỹ',
        campusName: 'Cơ sở Thanh Hoá',
      },
    ];

    setTestimonials(fixedTestimonials);
  }, []);

  // Cấu hình cho chuyển tiếp lưu bút
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  // Đối tác
  const [partners, setPartners] = useState([]);
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.get('/Supplier/get-suplliers');
        setPartners(response.data);
      } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách đối tác!', error);
      }
    };
    fetchPartners();
  }, []);

  // Đăng ký thông tin 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    linkFB: '',
    specializeMajorID: '',
    campusId: selectedCampus.id,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/StudentConsultation', {
        ...formData,
        dateReceive: new Date().toISOString(),
      });

      if (response.status === 200) {
        alert('Đăng ký thành công!');
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };
  return (
    <div>
      {loading ? (
        <div className="banner-placeholder">
          <span className="loading-text">Đang tải...</span>
        </div>
      ) : (
        <SliderBanner banners={banners} />
      )}
      <div className="text-center background-overlay">
        <div className="overlay"></div>
        <Row className="text-center">
          <Col md={12} className="background-content">
            <h2 className="text-orange">Tại sao lại chọn chúng tôi?</h2>
          </Col>
        </Row>
        <Row className="mt-4 fw-bold ">
          <Col
            md={3}
            className="d-flex align-items-center justify-content-center background-content"
          >
            <i className="bi-briefcase display-4"></i>
            <div className="text-left ms-3 mt-3">
              <h5 className="text-orange mb-0">90%</h5>
              <p>Cơ hội việc làm</p>
            </div>
          </Col>
          <Col
            md={3}
            className="d-flex align-items-center justify-content-center background-content"
          >
            <i className="bi bi-people display-4"></i>
            <div className="text-left ms-3 mt-3">
              <h4 class="text-orange mb-0">1000+</h4>
              <p>Đối tác</p>
            </div>
          </Col>
          <Col
            md={3}
            className="d-flex align-items-center justify-content-center background-content"
          >
            <i className="bi bi-award display-4"></i>
            <div className="text-left ms-3 mt-3">
              <h4 class="text-orange mb-0">1000+</h4>
              <p>Học sinh & Cựu HS</p>
            </div>
          </Col>
          <Col
            md={3}
            className="d-flex align-items-center justify-content-center background-content"
          >
            <i className="bi bi-buildings display-4"></i>
            <div className="text-left ms-3 mt-3 ">
              <h4 class="text-orange mb-0">4 Cơ sở</h4>
              <p>Cơ sở</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-5 background-content text-center justify-content-center align-items-center text-white bg-orange p-3 mx-auto w-75 rounded">
          <Col md={9}>
            <h4 className="text-black d-inline">Bạn đã sẵn sàng trở thành học sinh của trường?</h4>
            <Link to="/dang-ky" className="btn-no-underline text-white bg-orange p-2">
              ĐĂNG KÝ NGAY!
            </Link>
          </Col>
        </Row>
      </div>

      <Container className="py-5">
        <div className="mt-3">
          <h2 className="text-center text-orange">Ngành đào tạo</h2>
          <MultiCarousel
            responsive={responsive}
            infinite={true}
            className="my-carousel"
          >
            {majors.map((major, index) => (
              <div key={index} className="p-2">
                <div
                  className="bg-light rounded border shadow-sm d-flex flex-column"
                  style={{ width: '100%', height: '180px' }}
                >
                  <div className="pt-3">
                    <h5 className="text-center">{major.majorName}</h5>
                  </div>
                  <div className="flex-grow-1 pb-2 d-flex align-items-center justify-content-center">
                    <ul className="list-unstyled mb-0 ">
                      {major.specializeMajorDTOs.map((subMajor, subIndex) => (
                        <li key={subIndex}>{subMajor.specializeMajorName}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </MultiCarousel>
        </div>
        <div class="my-5">
          <h2 className="text-center mb-1 text-orange">Thông tin tuyển sinh 2024</h2>
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-center">
                {Object.keys(content).map(category => (
                  <button
                    key={category}
                    className={`custom-button mx-2 ${selectedCategory === category ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="p-3 border border-gray border-1">
                <Card.Body>
                  {content[selectedCategory]}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
      <div className="registration-section">
        <div className="registration-overlay"></div>
        <div className="registration-content d-flex justify-content-between align-items-center p-5">
          <div className="text-section text-orange">
            <h2 className="fw-bold">ĐĂNG KÝ XÉT TUYỂN NGAY!</h2>
          </div>
          <div className="form-section bg-orange p-4 text-white">
            <h4 className="text-section">ĐĂNG KÝ XÉT TUYỂN</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Nhập số điện thoại"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="specializeMajorID" className="form-label">Chọn ngành học</label>
                <select
                  id="specializeMajorID"
                  name="specializeMajorID"
                  className="form-select"
                  value={formData.specializeMajorID}
                  onChange={handleChange}
                >
                  {majors.map((major) => (
                    <optgroup key={major.majorID} label={major.majorName}>
                      {major.specializeMajorDTOs.map((specialize) => (
                        <option key={specialize.specializeMajorID} value={specialize.specializeMajorID}>
                          {specialize.specializeMajorName}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="linkFB" className="form-label">Link Facebook</label>
                <input
                  type="text"
                  className="form-control"
                  id="linkFB"
                  name="linkFB"
                  placeholder="Nhập link Facebook"
                  value={formData.linkFB}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-submit px-5">Đăng ký</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={10}>
            {testimonials.length > 0 ? (
              <Slider {...sliderSettings}>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.alumiStudentId}>
                    <Row className="m-5 align-items-center">
                      <Col md={5}>
                        <img
                          src={testimonial.img}
                          alt={testimonial.fullName}
                          className="img-fluid rounded"
                        />
                      </Col>
                      <Col md={7} className="d-flex align-items-center ps-5">
                        <div>
                          <p>"{testimonial.desciption}"</p>
                          <p>
                            <strong>
                              {testimonial.fullName} - {testimonial.specializeMajorName} - {testimonial.campusName}
                            </strong>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Slider>
            ) : (
              <p>Đang tải dữ liệu...</p>
            )}
          </Col>
        </Row>
        <div className="text-center mt-5">
          <h2 className="text-orange">Đối tác</h2>
          <Row className="justify-content-center mx-4">
            {partners.length > 0 ? (
              partners.map((partner, index) => (
                <Col
                  md={3}
                  className="d-flex justify-content-center align-items-center"
                  key={partner.supplierId}
                >
                  <div className="partner-logo-container">
                    <img
                      src={partner.img}
                      alt={partner.supplierName}
                      className="img-fluid partner-logo"
                    />
                  </div>
                </Col>
              ))
            ) : (
              <p>Đang tải dữ liệu...</p>
            )}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Homepage;