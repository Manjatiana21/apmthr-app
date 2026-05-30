import React from "react";
import Slider from "react-slick";
import "../styles/CarouselClient.css";

import img1 from "../assets/savony.png";
import img2 from "../assets/photo 7.png";
import img3 from "../assets/photo 8.png";
import img4 from "../assets/savony.png";
import img5 from "../assets/photo 7.png";
import img6 from "../assets/photo 8.png";

function CarouselClient() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "0px"
  };

  const images = [img1, img2, img3, img4, img5, img6];

  return (
    <div className="carousel-client">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className="carousel-slide">
            <img src={src} alt={`Slide ${index}`} className="carousel-image" id="carousel-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CarouselClient;
