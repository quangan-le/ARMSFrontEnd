// src/pages/Homepage.js
import React from "react";
import { Container, Row, Col, Button, Card, Form, Carousel } from "react-bootstrap";
import { Link, useOutletContext } from 'react-router-dom';
import SliderBanner from "./SilderBanner";
import { useState, useEffect } from '../hooks/Hooks.js';
import api from "../../apiService.js";
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

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Đối tượng và hình thức');
  const { selectedCampus } = useOutletContext();

  // State để lưu danh sách banner tương ứng với campus được chọn
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  // Ngành học
  const [vocationalMajors, setVocationalMajors] = useState([]);
  const [collegeMajors, setCollegeMajors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCampus.id) {
        try {
          // Gọi API lấy danh sách banner
          const bannerResponse = await api.get(`/Campus/get-sliders?campusId=${selectedCampus.id}`);
          setBanners(bannerResponse.data);

          // Gọi API lấy danh sách ngành học
          const vocationalResponse = await api.get(`/Major/get-majors-vocational-school?campus=${selectedCampus.id}`);
          const collegeResponse = await api.get(`/Major/get-majors-college?campus=${selectedCampus.id}`);
          setVocationalMajors(vocationalResponse.data);
          setCollegeMajors(collegeResponse.data);
        } catch (error) {
          console.error("Có lỗi khi lấy dữ liệu:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [selectedCampus]);

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
        fullName: 'Nguyễn Thị Thúy Diễm',
        desciption: 'Là một người trẻ, năng động thích môi trường năng động và được học những kiến thức thực tế. Mình nhận thấy đây là môi trường hoàn hảo để chắp cánh ước mơ trở thành nhà quản trị khách sạn của mình!',
        specializeMajorName: 'Sinh viên ngành Quản trị khách sạn',
        campusName: 'Cơ sở Hồ Chí Minh',
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
  const [partners, setPartners] = useState([
    {
      "supplierId": 1,
      "supplierName": "Fpt Software",
      "img": "https://firebasestorage.googleapis.com/v0/b/arms-acdfc.appspot.com/o/Supplier%2FFptSoftware.png?alt=media&token=552c0a51-fdea-4795-acd7-fd10fe5cb45f"
    },
    {
      "supplierId": 2,
      "supplierName": "Tập đoàn bưu chính viễn thông",
      "img": "https://firebasestorage.googleapis.com/v0/b/arms-acdfc.appspot.com/o/Supplier%2FVNPT.png?alt=media&token=96d1f135-015a-4c8c-a8a3-dbd283cbd345"
    },
    {
      "supplierId": 3,
      "supplierName": "Base.vn",
      "img": "https://firebasestorage.googleapis.com/v0/b/arms-acdfc.appspot.com/o/Supplier%2FBase.vn.png?alt=media&token=be9f0ae0-8704-4cf5-b20c-d344d7d9ea3c"
    },
    {
      "supplierId": 4,
      "supplierName": "UniMedia",
      "img": "https://firebasestorage.googleapis.com/v0/b/arms-acdfc.appspot.com/o/Supplier%2FUniMedia.png?alt=media&token=8b223dea-5076-485c-95c8-467c39568c88"
    },
    {
      "supplierId": 5,
      "supplierName": "Avepoint Việt Nam",
      "img": "https://firebasestorage.googleapis.com/v0/b/arms-acdfc.appspot.com/o/Supplier%2FAvepoint.png?alt=media&token=ebbbdabb-d411-4a6b-a57b-a16b1c144a8c"
    },
    {
      "supplierId": 6,
      "supplierName": "CMC",
      "img": "https://firebasestorage.googleapis.com/v0/b/arms-acdfc.appspot.com/o/Supplier%2FCMC.jpg?alt=media&token=e37589d5-9907-44fd-abac-a1ace3537f27"
    },
    {
      "supplierId": 7,
      "supplierName": "Kaopiz",
      "img": "https://firebasestorage.googleapis.com/v0/b/arms-acdfc.appspot.com/o/Supplier%2FKaopiz.png?alt=media&token=b9d29e81-712e-4b78-b8c3-2d74144347f3"
    },
    {
      "supplierId": 8,
      "supplierName": "Viettel",
      "img": "https://firebasestorage.googleapis.com/v0/b/arms-acdfc.appspot.com/o/Supplier%2FViettel.png?alt=media&token=3493a983-26d0-4c41-967e-341c3cfcc269"
    }
  ]);

  // Đăng ký thông tin 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    linkFB: '',
    majorID: '',
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
        <div className="background-content">
          <h2 className="text-orange">Tại sao lại chọn chúng tôi?</h2>
        </div>
        <Row className="mt-4 fw-bold mx-2">
          {[
            { icon: "bi-briefcase", value: "90%", label: "Cơ hội việc làm" },
            { icon: "bi-people", value: "1000+", label: "Đối tác" },
            { icon: "bi-award", value: "1000+", label: "Học sinh & Cựu HS" },
            { icon: "bi-buildings", value: "4 Cơ sở", label: "Cơ sở" },
          ].map((item, index) => (
            <Col xs={6} md={3} className="d-flex align-items-center justify-content-center background-content" key={index}>
              <i className={`bi ${item.icon} display-4`}></i>
              <div className="text-left ms-3 mt-3">
                <h5 className="text-orange mb-0">{item.value}</h5>
                <p>{item.label}</p>
              </div>
            </Col>
          ))}
        </Row>
        <Row className="mt-5 mb-5 background-content text-center justify-content-center align-items-center text-white bg-orange p-3 mx-auto w-75 rounded">
          <Col xs={12} md={9}>
            <h4 className="text-black d-inline">Bạn đã sẵn sàng trở thành học sinh của trường?</h4>
            <Link to="/dang-ky" className="btn-no-underline text-white bg-orange p-2">
              ĐĂNG KÝ NGAY!
            </Link>
          </Col>
        </Row>
      </div>

      <Container className="py-5 majorSection">
        <div className="mt-3">
          <h2 className="text-center text-orange">Ngành đào tạo</h2>
          <Row className="mt-4">
            <Col xs={12} md={8}>
              <h4 className="text-center text-blue">Cao đẳng</h4>
              <Row>
                {collegeMajors.map((major) => (
                  <Col xs={6} md={4} key={major.majorID}>
                    <div className="major-item">
                      <Link to={`/nganh-hoc/${major.majorID}`} className="text-muted">
                        {major.majorName}
                      </Link>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col xs={12} md={4}>
              <h4 className="text-center text-blue">Trung cấp</h4>
              <div className="mx-5">
                {vocationalMajors.map((major) => (
                  <div key={major.majorID} className="major-item full-width">
                    <Link to={`/nganh-hoc/${major.majorID}`} className="text-muted">
                      {major.majorName}
                    </Link>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
        <div className="my-5">
          <h2 className="text-center mb-1 text-orange">Thông tin tuyển sinh 2024</h2>
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-center flex-wrap">
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
            <h4 className="text-center">ĐĂNG KÝ XÉT TUYỂN</h4>
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
                <label htmlFor="majorID" className="form-label">Chọn ngành học</label>
                <select
                  id="majorID"
                  name="majorID"
                  className="form-select"
                  value={formData.majorID}
                  onChange={handleChange}
                >
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
                      <Col md={7} className="d-flex align-items-center p-3">
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
                  md={3} sm={6}
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