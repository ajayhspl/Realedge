import React from "react";
import "./Section7.css";
import SkillCard from "../../Cards/SkillCard/SkillCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper";
import "swiper/css/pagination";
const Section7 = (props) => {
  const renderDummyData = props.ServerData.Slider.map((skill) => {
    return (
      <SwiperSlide key={skill.id}>
        <SkillCard Data={skill} />
      </SwiperSlide>
    );
  });
  return (
    <section className="Section7">
      {props.ServerData.Title && (
        <h2 data-aos="fade-down">{props.ServerData.Title}</h2>
      )}
      {props.ServerData.paragraph && (
        <p data-aos="fade-up">{props.ServerData.paragraph}</p>
      )}
      <div className="Skill-wrapper">
        <Swiper
          freeMode={true}
          loop={true}
          slidesPerView={4}
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
              slidesPerView: 4,
              spaceBetween: 20,
            },
            250: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
          }}
          modules={[Pagination]}
          className="Swiper-Skills"
        >
          {renderDummyData}
        </Swiper>
      </div>
    </section>
  );
};

export default Section7;
