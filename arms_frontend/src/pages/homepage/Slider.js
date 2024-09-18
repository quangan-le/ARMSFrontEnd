import React from "react";
import { Carousel } from "react-bootstrap";

const Slider = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://caodang.fpt.edu.vn/wp-content/uploads/2024/09/1_1900x750_KhongLogo-1.jpg"
          alt="Slide 1"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://caodang.fpt.edu.vn/wp-content/uploads/2024/09/1900x750-scaled.jpg"
          alt="Slide 2"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
