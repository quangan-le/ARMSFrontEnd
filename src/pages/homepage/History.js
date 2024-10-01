import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Spinner } from 'react-bootstrap';
import api from '../../apiService';
import { useOutletContext } from 'react-router-dom';

const History = () => {
    const { selectedCampus } = useOutletContext();
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(`/Campus/get-history?campusId=${selectedCampus.id}`);
                setHistoryData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCampus.id) {
            fetchHistory();
        }
    }, [selectedCampus]);

    return (
        <div>
            <div className="homeguest-banner position-relative">
                <div className="banner-overlay"></div>
                <h1 className="banner-title">Lịch sử thành lập</h1>
            </div>
            <Container className="mt-4">
                <Breadcrumb>
                    <Breadcrumb.Item href="/" className="text-orange">Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-orange">Lịch sử thành lập</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container className="homeguest-description py-3 px-5">
                {loading && <Spinner animation="border" />}
                {error && <p className="text-danger">Error: {error.message}</p>}
                {historyData && <p>{historyData}</p>} 
            </Container>
        </div>
    );
};

export default History;