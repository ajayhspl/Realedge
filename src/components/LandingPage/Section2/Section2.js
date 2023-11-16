import React from "react";
import "./Section2.css";
import Card from "../../Cards/Card/Card";
import CardMobile from "../../Cards/Card/CardMobile";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper";
import "swiper/css/pagination";
const Section2 = (props) => {
  const severData = props.ServerData;

  const renderDummyData = severData.Cards.map((Data, index) => {
    return <Card Data={Data} key={index} />;
  });
  const renderDummyDataSmall = severData.Cards.map((Data, index) => {
    return (
      <SwiperSlide key={index}>
        <CardMobile Data={Data} />
      </SwiperSlide>
    );
  });

  return (
    <section className="Section2">
      {severData.Title && <h2 data-aos="fade-down">{severData.Title}</h2>}
      <div className="Cards-wrapper" data-aos="fade-up">
        {props.screenWidth > 1000 ? (
          renderDummyData
        ) : (
          <Swiper
            freeMode={true}
            loop={true}
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
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
            modules={[Pagination, Autoplay]}
            className="Swiper-Testimonials"
          >
            {renderDummyDataSmall}
          </Swiper>
        )}
      </div>
    </section>
  );
};
export default Section2;
