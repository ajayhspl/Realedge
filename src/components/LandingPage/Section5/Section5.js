import React from "react";
import "./Section5.css";
import Testimonial from "../../Cards/Testimonial/Testimonial";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper";
import "swiper/css/pagination";
import { generate as GenerateID } from "shortid";
const Section5 = (props) => {
  const RenderTestimonials = props.ServerData.Testimoinals.map(
    (testimonial) => {
      const targetProject = props.Projects.find((Project) => {
        return Project.ProjectID == testimonial.ProjectID;
      });
      return (
        <SwiperSlide key={GenerateID()}>
          <Testimonial
            Project={targetProject}
            Testimonial={testimonial.Testimonial}
          />
        </SwiperSlide>
      );
    }
  );
  return (
    <section className="Section5">
      <div className="Top">
        {props.ServerData.Title && (
          <h2 data-aos="fade-down">{props.ServerData.Title}</h2>
        )}
        {props.ServerData.paragraph && (
          <p data-aos="fade-up">{props.ServerData.paragraph}</p>
        )}
      </div>

      <div className="Bottom" data-aos="fade">
        <Swiper
          freeMode={true}
          loop={true}
          slidesPerView={1}
          spaceBetween={10}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay]}
          className="Swiper-Testimonials"
        >
          {RenderTestimonials}
        </Swiper>
      </div>
    </section>
  );
};

export default Section5;
