import React, { useEffect, useState } from "react";

import ProjectCardPort from "../Cards/ProjectCardPort/ProjectCardPort";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper";
import "swiper/css/navigation";

const Template5 = ({ Data, FetchedProjects }) => {
  const [activeTab, setActiveTab] = React.useState("All");
  const [Projects, setProjects] = React.useState(FetchedProjects);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const uniqueCategories = new Set(categories); // Create a Set to store unique roles
    Projects.forEach((Project) => {
      uniqueCategories.add(Project.Category); // Add each person's role to the Set
    });

    const updatedRoles = Array.from(uniqueCategories); // Convert the Set back to an array

    setCategories(updatedRoles); // Update the roles state with the unique roles
  }, []);
  const renderCate = categories.map((cate, index) => {
    return (
      <li
        key={index}
        onClick={() => {
          setActiveTab(cate);
        }}
        className={`TabItem ${cate === activeTab ? "active" : ""}`}
      >
        {cate}
      </li>
    );
  });

  useEffect(() => {
    setProjects([]);
    const filteredProjects = FetchedProjects.filter((project) => {
      return project.Category == activeTab || activeTab === "All";
    });
    setProjects(filteredProjects);
  }, [activeTab]);

  const RenderProjects = Projects.map((project, index) => {
    return (
      <ProjectCardPort key={project.ProjectID} data={project} delay={index} />
    );
  });
  const RenderSlider = categories.map((cate) => {
    return (
      <SwiperSlide key={cate}>
        <li
          onClick={() => {
            setActiveTab(cate);
          }}
          className={`TabItem  Slider ${cate === activeTab ? "active" : ""}`}
        >
          {cate}
        </li>
      </SwiperSlide>
    );
  });
  return (
    <div className="Outsource Portfolio">
      {Data.Title && <h2>{Data.Title}</h2>}
      <ul className="Roles">
        <li
          className={`TabItem ${"All" === activeTab ? "active" : ""}`}
          onClick={() => {
            setActiveTab("All");
          }}
        >
          All
        </li>
        {categories.length < 5 ? (
          renderCate
        ) : (
          <Swiper
            navigation={true}
            slidesPerView={3}
            spaceBetween={10}
            modules={[Autoplay, Navigation]}
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
        )}
      </ul>
      <ul className="Projects-wrapper">{RenderProjects}</ul>
    </div>
  );
};

export default Template5;
