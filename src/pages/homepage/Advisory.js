import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Advisory = () => {
    return (
        <div>
            <div className="background-overlay-advisory">
                <Row className="mt-5 background-content text-center bg-orange p-3 mx-auto w-75 rounded">
                    <div className="d-flex justify-content-center align-items-center">
                        <h4 className="text-black d-inline mb-0">Đăng ký nộp hồ sơ xét tuyển tại đây</h4>
                        <a href="/nop-ho-so" className="text-white d-inline ms-3 fs-4">ĐĂNG KÝ XÉT TUYỂN!</a>
                    </div>
                </Row>
            </div>
            
            <Container className='my-5'>
                <div>
                    <h4 className="text-section">ĐĂNG KÝ TƯ VẤN</h4>
                    <form className="w-50 mx-auto">
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
                            <button type="submit" className="btn btn-submit read-more-btn">Đăng ký</button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
};
export default Advisory;