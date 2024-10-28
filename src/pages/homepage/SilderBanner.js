import React from 'react';
import { Carousel } from 'react-bootstrap';

const SliderBanner = ({ banners }) => {
    // Kiểm tra nếu không có banner hoặc dữ liệu đang trống
    if (!banners || banners.length === 0) {
      return (
        <div className="banner-placeholder">
          <span className="loading-text">Không có banner để hiển thị</span>
        </div>
      );
    }
    return (
      <Carousel>
        {banners.map((banner, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 banner-image"
              src={banner.img}
              alt={`Banner ${index}`}
              style={{ height: "600px", objectFit: "cover" }} 
            />
          </Carousel.Item>
        ))}
      </Carousel>
    );
  };
  
  export default SliderBanner;