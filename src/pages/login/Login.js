import React from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

function Login() {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={5}>
                    <h2 className="text-center" style={{ color: 'orange' }}>Đăng nhập</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="campus">
                            <Form.Label>Chọn cơ sở</Form.Label>
                            <Form.Control as="select">
                                <option value="campus1">Hà Nội</option>
                                <option value="campus2">Hồ Chí Minh</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập địa chỉ email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu" />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button style={{ backgroundColor: 'orange', borderColor: 'orange' }} type="submit" className="btn-block">Đăng nhập</Button>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <Button variant="outline-primary" className="btn-block">Đăng nhập bằng Google</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;