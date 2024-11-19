import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Spinner } from 'react-bootstrap';
import { Link, useOutletContext } from 'react-router-dom';
import api from '../../apiService';

const WhyChoose = () => {
    const { selectedCampus } = useOutletContext();
    const [whyChooseData, setWhyChooseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWhyChooseUs = async () => {
            try {
                const response = await api.get(`/Campus/get-whychooseus?campusId=${selectedCampus.id}`);
                setWhyChooseData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCampus.id) {
            fetchWhyChooseUs();
        }
    }, [selectedCampus]);

    return (
        <div>
            <div className="homeguest-banner position-relative">
                <div className="banner-overlay"></div>
                <h1 className="banner-title">Vì sao chọn chúng tôi</h1>
            </div>
            <Container className="mt-4">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Trang chủ</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-orange">Vì sao chọn chúng tôi</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container className="homeguest-description py-3 px-5">
                {loading && <Spinner animation="border" />}
                {error && <p className="text-danger">Lỗi: {error.message}</p>}
                {whyChooseData && <p>{whyChooseData}</p>}
            </Container>
        </div>
    );
};

export default WhyChoose;
