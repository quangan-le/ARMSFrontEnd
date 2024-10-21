import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

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

// Dummy Data for Charts
const lineChartData = {
  labels: ['Làm đẹp', 'Quản trị kinh doanh', 'Công nghệ thông tin', 'Ngôn ngữ', 'Khác'],
  datasets: [
    {
      label: 'Xu hướng tuyển sinh',
      data: [30, 20, 50, 90, 120],
      fill: false,
      borderColor: 'orange',
      tension: 0.1,
    },
  ],
};

const pieChartData = {
  labels: ['Công nghệ thông tin', 'Kinh doanh', 'Ngôn ngữ', 'Làm đẹp', 'Khác'],
  datasets: [
    {
      data: [170, 187, 240, 260, 160],
      backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF'],
    },
  ],
};

const Dashboard = () => {
  return (
    <Container fluid className="my-4 px-4">
      <Row className="mb-4">
        <Col>
          <Card className="p-3 bg-light">
            <h5>Hồ sơ đăng ký</h5>
            <h4>1400</h4>
          </Card>
        </Col>
        <Col>
          <Card className="p-3 bg-light">
            <h5>Tỷ lệ phê duyệt</h5>
            <h4>70%</h4>
          </Card>
        </Col>
        <Col>
          <Card className="p-3 bg-light">
            <h5>Hồ sơ hoàn tất</h5>
            <h4>1100</h4>
          </Card>
        </Col>
        <Col>
          <Card className="p-3 bg-light">
            <h5>Xu hướng chính</h5>
            <h4>Công nghệ thông tin</h4>
          </Card>
        </Col>
        <Col>
          <Card className="p-3 bg-light">
            <h5>Hồ sơ đăng ký trong ngày</h5>
            <h4>200</h4>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="p-3 bg-light">
            <h5>Xu hướng tuyển sinh</h5>
            <Line data={lineChartData} />
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 bg-light">
            <h5>Hồ sơ đăng ký</h5>
            <Pie data={pieChartData} />
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="p-3 bg-light">
            <h5>Thống kê hồ sơ hoàn tất</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Ngành</th>
                  <th>Hồ sơ đăng ký tư vấn</th>
                  <th>Hồ sơ đăng ký xét tuyển</th>
                  <th>Hồ sơ hoàn tất thủ tục</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>IT</td>
                  <td>400</td>
                  <td>400</td>
                  <td>400</td>
                </tr>
                <tr>
                  <td>Kinh tế</td>
                  <td>400</td>
                  <td>400</td>
                  <td>400</td>
                </tr>
                <tr>
                  <td>Làm đẹp</td>
                  <td>400</td>
                  <td>400</td>
                  <td>400</td>
                </tr>
                <tr>
                  <td>Ngôn ngữ</td>
                  <td>400</td>
                  <td>400</td>
                  <td>400</td>
                </tr>
                <tr>
                  <td>Khác</td>
                  <td>400</td>
                  <td>400</td>
                  <td>400</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 bg-light">
            <h5>Tỷ lệ phê duyệt</h5>
            <div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
