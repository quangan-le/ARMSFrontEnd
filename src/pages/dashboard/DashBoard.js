import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Line, Pie } from 'react-chartjs-2';
import { useOutletContext } from 'react-router-dom';
import api from "../../apiService.js";

// Register the components for the charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [countRegister, setCountRegister] = useState(0); 
  const [countRegisterToday, setCountRegisterToday] = useState(0);
  const [calculatePassRate, setCalculatePassRate] = useState(0);
  const [countRegisterDone, setCountRegisterDone] = useState(0); 
  const [FindMostSubmittedMajor, setFindMostSubmittedMajor] = useState(0); 
  const [registerAdmission, setRegisterAdmission] = useState(0); 
  const [lineChartData, setLineChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const { campusId } = useOutletContext();
  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      colors.push(color);
    }
    return colors;
  };
  useEffect(() => {
    const fetchCountRegister = async () => {
      try {
        const response = await api.get(`/user/RegisterAdmission/count-register?campus=${campusId}`);
        setCountRegister(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };
    fetchCountRegister();

    const fetchCountRegisterToday = async () => {
      try {
        const response = await api.get(`/user/RegisterAdmission/count-register-today?campus=${campusId}`);
        setCountRegisterToday(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      } 
    };
    fetchCountRegisterToday();
    
    const fetchCalculatePassRate = async () => {
      try {
        const response = await api.get(`/user/RegisterAdmission/calculate-pass-rate?campus=${campusId}`);
        setCalculatePassRate(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };
    fetchCalculatePassRate();

    const fetchCountRegisterDone = async () => {
      try {
        const response = await api.get(`/user/RegisterAdmission/count-register-done?campus=${campusId}`);
        setCountRegisterDone(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };
    fetchCountRegisterDone();

    const fetchFindMostSubmittedMajor = async () => {
      try {
        const response = await api.get(`/user/RegisterAdmission/find-most-submitted-major?campus=${campusId}`);
        setFindMostSubmittedMajor(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };
    fetchFindMostSubmittedMajor();
    const fetchRegisterAdmission = async () => {
      try {
        const response = await api.get(`/user/RegisterAdmission/report-register-admission?campus=${campusId}`);
        setRegisterAdmission(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };
    fetchRegisterAdmission();
    const fetchChartData = async () => {
      try {
        const response = await api.get(`/user/RegisterAdmission/report-admission?campus=${campusId}`); // Replace with your API endpoint
        const data = response.data;

        // Dữ liệu Line Chart
        const labels = data.map(a => a.majorName);
        const registeredData = data.map(a => a.registeredCount);
        const targetData = data.map((a) => a.target);

        setLineChartData({
          labels,
          datasets: [
            {
              label: 'Số lượng đã đăng ký',
              data:registeredData,
              fill: false,
              borderColor: 'orange',
              tension: 0.1,
            }
          ],
        });

        const colors = generateRandomColors(registeredData.length);

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
      setLineChartData({
          labels,
          datasets: [
            {
              label: 'Hồ sơ đăng ký',
              data: registeredData,
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Màu xanh
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            }
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchChartData();
  }, [campusId]);
  return (
    <Container fluid className="my-4 px-4">
    <Row className="mb-4">
      <Col>
        <Card className="p-3 bg-light h-100 d-flex flex-column">
          <h5>Hồ sơ đăng ký</h5>
          <h4>{countRegister}</h4>
        </Card>
      </Col>
      <Col>
        <Card className="p-3 bg-light h-100 d-flex flex-column">
          <h5>Tỷ lệ phê duyệt</h5>
          <h4>{calculatePassRate} %</h4>
        </Card>
      </Col>
      <Col>
        <Card className="p-3 bg-light h-100 d-flex flex-column">
          <h5>Hồ sơ hoàn tất</h5>
          <h4>{countRegisterDone}</h4>
        </Card>
      </Col>
      <Col>
        <Card className="p-3 bg-light h-100 d-flex flex-column">
          <h5>Xu hướng chính</h5>
          <h4>{FindMostSubmittedMajor}</h4>
        </Card>
      </Col>
      <Col>
        <Card className="p-3 bg-light h-100 d-flex flex-column">
          <h5>Hồ sơ nộp trong ngày</h5>
          <h4>{countRegisterToday}</h4>
        </Card>
      </Col>
    </Row>


    <Row className="align-items-stretch">
      <Col md={8}>
        <Card className="p-3 bg-light h-100 d-flex flex-column">
          <h5>Xu hướng tuyển sinh</h5>
          <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            {lineChartData ? <Line data={lineChartData} /> : <p>Đang tải...</p>}
          </div>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="p-3 bg-light h-100 d-flex flex-column">
          <h5>Hồ sơ đăng ký</h5>
          <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            {pieChartData ? <Pie data={pieChartData} /> : <p>Đang tải...</p>}
          </div>
        </Card>
      </Col>
    </Row>

      <Row className="mt-4">
      <Col md={12}>
        <Card className="p-3 bg-light">
          <h5>Thống kê hồ sơ hoàn tất</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Ngành</th>
                <th>Hồ sơ đăng ký tư vấn</th>
                <th>Hồ sơ đăng ký xét tuyển</th>
                <th>Hồ sơ hoàn tất thủ tục</th>
                <th>Tỷ lệ phê duyệt (%)</th>
              </tr>
            </thead>
            <tbody>
              {registerAdmission.length > 0 ? (
                registerAdmission.map((item, index) => {
                  // Tính tỷ lệ phê duyệt
                  const approvalRate =
                    item.registeredCount > 0
                      ? ((item.registerCountPass / item.registeredCount) * 100).toFixed(2)
                      : 0;

                  return (
                    <tr key={index}>
                      <td>{item.majorName}</td>
                      <td>{item.registerConsultationCount}</td>
                      <td>{item.registeredCount}</td>
                      <td>{item.registerCountPass}</td>
                      <td>{approvalRate}%</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </Col>

      </Row>
    </Container>
  );
};

export default Dashboard;
