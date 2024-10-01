// src/pages/Homepage.js
import React from "react";
import Slider from "./Slider";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from '../hooks/Hooks.js';
import api from "../../apiService.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const content = {
  'Đối tượng và hình thức': 'Thông tin về đối tượng tuyển sinh.',
  'Thời gian': 'Thông tin về thời gian tuyển sinh.',
  'Chuyên ngành': 'Thông tin về các chuyên ngành.',
  'Hồ sơ nhập học': 'Thông tin về hồ sơ nhập học.',
  'Học phí': 'Thông tin về học phí.'
};

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Đối tượng');
  const { selectedCampus } = useOutletContext();

  // State để lưu danh sách banner tương ứng với campus được chọn
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy danh sách banner dựa trên `selectedCampus`
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        if (selectedCampus.id) {
          const response = await api.get(`/Campus/get-banners?campusId=${selectedCampus.id}`);
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

  // Lưu bút
  const [testimonials, setTestimonials] = useState([]);

  // Lấy danh sách lưu bút sinh viên
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/Campus/get-alumi');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
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

  return (
    <div>
      {loading ? (
        <div className="banner-placeholder">
          <span className="loading-text">Đang tải...</span>
        </div>
      ) : (
        <Slider banners={banners} />
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

      <Container className="my-4">
        <div className="m-5">
          <h2 className="text-center text-orange">Ngành đào tạo</h2>
          <Row className="mt-4">
            <Col md={3} className="d-flex mb-4">
              <div className="bg-light py-3 px-4 rounded border flex-fill d-flex flex-column justify-content-between">
                <h5 className="text-center">Công nghệ thông tin</h5>
                <ul className="list-unstyled">
                  <li>Ngành nhỏ 1</li>
                  <li>Ngành nhỏ 2</li>
                  <li>Ngành nhỏ 3</li>
                </ul>
              </div>
            </Col>
            <Col md={3} className="d-flex mb-4">
              <div className="bg-light py-3 px-4 rounded border flex-fill d-flex flex-column justify-content-between">
                <h5 className="text-center">Công nghệ ô tô</h5>
                <ul className="list-unstyled">
                  <li>Ngành nhỏ 1</li>
                  <li>Ngành nhỏ 2</li>
                  <li>Ngành nhỏ 3</li>
                </ul>
              </div>
            </Col>
            <Col md={3} className="d-flex mb-4">
              <div className="bg-light py-3 px-4 rounded border flex-fill d-flex flex-column justify-content-between">
                <h5 className="text-center">Làm đẹp</h5>
                <ul className="list-unstyled">
                  <li>Ngành nhỏ 1</li>
                  <li>Ngành nhỏ 2</li>
                  <li>Ngành nhỏ 3</li>
                </ul>
              </div>
            </Col>
            <Col md={3} className="d-flex mb-4">
              <div className="bg-light py-3 px-4 rounded border flex-fill d-flex flex-column justify-content-between">
                <h5 className="text-center">Ngành khác</h5>
                <ul className="list-unstyled">
                  <li>Ngành nhỏ 1</li>
                  <li>Ngành nhỏ 2</li>
                  <li>Ngành nhỏ 3</li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div class="m-5">
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
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Họ và tên</label>
                <input type="text" className="form-control" id="name" placeholder="Nhập họ và tên" />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                <input type="text" className="form-control" id="phone" placeholder="Nhập số điện thoại" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Nhập email" />
              </div>
              <div className="mb-3">
                <label htmlFor="field" className="form-label">Chọn ngành học</label>
                <select id="field" className="form-select">
                  <option value="">Chọn ngành học</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="facebook" className="form-label">Link Facebook</label>
                <input type="text" className="form-control" id="facebook" placeholder="Nhập link Facebook" />
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
                <Col md={3} className="mb-4" key={partner.supplierId}>
                  <img src={partner.img} alt={partner.supplierName} className="img-fluid" />
                  <p className="mt-2">{partner.supplierName}</p>
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
