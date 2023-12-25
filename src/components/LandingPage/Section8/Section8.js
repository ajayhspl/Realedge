import React from "react";
import "./Section8.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper";
import WhyUs from "../../Cards/WhyUs/WhyUs";
import "swiper/css/pagination";

const Section8 = (props) => {
  const severData = props.ServerData;

  const renderDummyData = severData.Cards.map((data) => {
    return (
      <SwiperSlide key={data.id}>
        <WhyUs Data={data} />
      </SwiperSlide>
    );
  });

  return (
    <div
      className="Section8"
      style={{ backgroundColor: props.ServerData.sectionColor }}
    >
      {severData.Title && <h2 data-aos="fade-down">{severData.Title}</h2>}
      {severData.Paragraph && <p data-aos="fade-up">{severData.Paragraph}</p>}
      <div className="Slider-wrapper">
        <Swiper
          freeMode={true}
          loop={true}
          slidesPerView={props.screenWidth > 1000 ? 3 : 1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            900: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            250: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="Swiper-Why"
        >
          {renderDummyData}
        </Swiper>
      </div>
    </div>
  );
};

export default Section8;
