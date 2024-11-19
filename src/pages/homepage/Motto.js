import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Spinner } from 'react-bootstrap';
import { Link, useOutletContext } from 'react-router-dom';
import api from '../../apiService';

const Motto = () => {
    const { selectedCampus } = useOutletContext();
    const [mottoData, setMottoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrainingMotto = async () => {
            try {
                const response = await api.get(`/Campus/get-trainingmotto?campusId=${selectedCampus.id}`);
                setMottoData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCampus.id) {
            fetchTrainingMotto();
        }
    }, [selectedCampus]);

    return (
        <div>
            <div className="homeguest-banner position-relative">
                <div className="banner-overlay"></div>
                <h1 className="banner-title">Phương châm đào tạo</h1>
            </div>
            <Container className="mt-4">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Trang chủ</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-orange">Phương châm đào tạo</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container className="homeguest-description py-3 px-5">
                {loading && <Spinner animation="border" />}
                {error && <p className="text-danger">Lỗi: {error.message}</p>}
                {mottoData && <p>{mottoData}</p>}
            </Container>
        </div>
    );
};

export default Motto;
