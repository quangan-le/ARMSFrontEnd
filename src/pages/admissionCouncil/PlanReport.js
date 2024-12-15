import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Link, useParams } from 'react-router-dom';
import api from "../../apiService.js";
// Đăng ký các module cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,BarElement );

const PlanReport = () => {
    const { AI, ATId } = useParams();
    const [lineChartData, setLineChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const generateRandomColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
          const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
          colors.push(color);
        }
        return colors;
      };
    useEffect(() => {
      // Hàm gọi API và xử lý dữ liệu
      const fetchData = async () => {
        try {
          const response = await api.get('/admission-council/Major/get-majors_admission_and_register/'+ ATId);
          const data = response.data;
  
          // Dữ liệu Line Chart
          const labels = data.map(major => major.majorName);
          const registeredData = data.map(major => major.registeredCount);
          const targetData = data.map((major) => major.target);
          const registerCountPass = data.map((major) => major.registerCountPass);
  
          setLineChartData({
            labels,
            datasets: [
              {
                label: 'Số lượng đã đăng ký',
                data: registeredData,
                fill: false,
                borderColor: 'orange',
                tension: 0.1,
              }
            ],
          });
  
          const colors = generateRandomColors(registeredData.length); // Tạo màu cho từng mục

        // Cập nhật dữ liệu biểu đồ
        setPieChartData({
          labels,
          datasets: [
            {
              data: registeredData,
              backgroundColor: colors, // Màu cho từng mục
            },
          ],
        });
        setChartData({
            labels,
            datasets: [
              {
                label: 'Hồ sơ đã hoàn thành nhập học',
                data: registerCountPass,
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Màu xanh
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
              {
                label: 'Chỉ tiêu tuyển sinh',
                data: targetData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Màu đỏ
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    // Hiển thị khi dữ liệu chưa tải xong
    if (!lineChartData || !pieChartData) {
      return <div>Loading...</div>;
    }
  
    return (
        <Container className="my-3">
            <h2 className="text-center text-orange fw-bold">Thống kê</h2>
            <p className="text-center mb-4 text-orange fw-bold">Thống kê kết quả tuyển sinh</p>
            <Row className="equal-height">
                <Col md={8}>
                    <Card className="p-3 bg-light h-100">
                    <h5>Xu hướng tuyển sinh</h5>
                    <Line data={lineChartData} />
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 bg-light h-100">
                    <h5>Hồ sơ đăng ký</h5>
                    <Pie data={pieChartData} />
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                <Card className="p-3 bg-light">
                    <h5 className="text-center">Hồ sơ nhập học thành công so với chỉ tiêu</h5>
                    <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                        legend: {
                            position: 'top',
                        },
                        },
                    }}
                    />
                </Card>
                </Col>
            </Row>
                <Link to={`/admissions-council/chi-tiet-ke-hoach-tuyen-sinh/${AI}`}>
                    <button className="btn btn-orange my-3">Quay lại</button>
                </Link>
                <Link to={`/admin-council/ke-hoach-tuyen-sinh/danh-sach-dang-ky/${AI}/${ATId}`}>
                    <button className="btn btn-primary mx-3">Hồ sơ xét tuyển </button>
                </Link>
        </Container>
    );
  };
  

export default PlanReport;
