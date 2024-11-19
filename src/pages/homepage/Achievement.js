import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Spinner } from 'react-bootstrap';
import api from '../../apiService';
import { Link, useOutletContext } from 'react-router-dom';

const Achievement = () => {
    const { selectedCampus } = useOutletContext();
    const [achievementData, setAchievementData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await api.get(`/Campus/get-achievements?campusId=${selectedCampus.id}`);
                setAchievementData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCampus.id) {
            fetchAchievements();
        }
    }, [selectedCampus]);

    return (
        <div>
            <div className="homeguest-banner position-relative">
                <div className="banner-overlay"></div>
                <h1 className="banner-title">Thành tích</h1>
            </div>
            <Container className="mt-4">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Trang chủ</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-orange">Thành tích</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container className="homeguest-description py-3 px-5">
                {loading && <Spinner animation="border" />}
                {error && <p className="text-danger">Lỗi: {error.message}</p>}
                {achievementData && <p>{achievementData}</p>}
            </Container>
        </div>
    );
};

export default Achievement;
