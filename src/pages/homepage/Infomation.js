import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Information = () => {
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const response = await axios.get('API_URL_HERE');
                setDescription(response.data.description);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu mô tả:', error);
            }
        };
    
        fetchDescription();
    }, []);

    return (
        <Container className="my-3">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active className='text-orange'>Thông tin tuyển sinh</Breadcrumb.Item>
            </Breadcrumb>

            <div className="description-section">
                <h2>Thông tin tuyển sinh</h2>
                <p>{description}</p>
            </div>

            <div className="mt-4 d-flex align-items-center">
                <h5 className="mb-0">Nộp hồ sơ đăng ký</h5>
                <Link to="/nop-ho-so" className="ms-2">
                    <Button variant="light" className="read-more-btn">Nộp hồ sơ ngay</Button>
                </Link>
            </div>
        </Container>
    );
};

export default Information;