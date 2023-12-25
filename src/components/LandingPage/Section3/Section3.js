import React from "react";
import "./Section3.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper";
import "swiper/css/pagination";

const Section3 = (props) => {
  const RenderSlider = props.ServerData.imgList.map((img) => {
    return (
      <SwiperSlide key={img.id} style={{ cursor: img.Link ? "pointer" : "" }}>
        <img
          onClick={() => {
            img.Link ? (window.location.href = img.Link) : "";
          }}
          src={img.url}
        />
      </SwiperSlide>
    );
  });
  return (
    <section className="Section3">
      {props.ServerData.title && (
        <h2 data-aos="fade-down">{props.ServerData.title}</h2>
      )}
      <div className="Swiper" data-aos="fade-up">
        <Swiper
          freeMode={true}
          loop={true}
          slidesPerView={3}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            900: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            250: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
          }}
          className="mySwiper"
        >
          {RenderSlider}
        </Swiper>
      </div>
    </section>
  );
};

export default Section3;
