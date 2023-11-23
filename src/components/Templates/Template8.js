import React, { useEffect, useState } from "react";
import TeamCard from "../Cards/Team/TeamCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper";
import "swiper/css/navigation";

const Template8 = ({ Teams }) => {
  const [activeTab, setActiveTab] = React.useState("All");
  const [renderedPeople, setRenderedPeople] = useState(Teams);
  const [roles, setRoles] = useState([]);
  const renderTeam = renderedPeople.map((Person, index) => {
    const delayString = (index * 0.05).toString() + "s";

    return (
      <TeamCard
        key={Person.id}
        Data={Person}
        delayString={delayString}
        admin={false}
      />
    );
  });
  useEffect(() => {
    const uniqueRoles = new Set(roles); // Create a Set to store unique roles
    Teams.forEach((Person) => {
      uniqueRoles.add(Person.Role); // Add each person's role to the Set
    });

    const updatedRoles = Array.from(uniqueRoles); // Convert the Set back to an array

    setRoles(updatedRoles); // Update the roles state with the unique roles
  }, []);

  const RenderRoles = roles.map((Role) => {
    return (
      <li
        onClick={() => {
          setActiveTab(Role);
        }}
        key={Role}
        className={`TabItem ${Role === activeTab ? "active" : ""}`}
      >
        {Role}
      </li>
    );
  });
  useEffect(() => {
    setRenderedPeople([]);
    const filteredProjects = Teams.filter((Person) => {
      return Person.Role == activeTab || activeTab === "All";
    });
    setRenderedPeople(filteredProjects);
  }, [activeTab]);
  const RenderSlider = roles.map((Role) => {
    return (
      <SwiperSlide key={Role}>
        <li
          onClick={() => {
            setActiveTab(Role);
          }}
          className={`TabItem  Slider ${Role === activeTab ? "active" : ""}`}
        >
          {Role}
        </li>
      </SwiperSlide>
    );
  });
  return (
    <div className="Outsource">
      <ul className="Roles">
        <li
          className={`TabItem ${"All" === activeTab ? "active" : ""}`}
          onClick={() => {
            setActiveTab("All");
          }}
        >
          All
        </li>
        {roles.length < 5 ? (
          RenderRoles
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
            className="Category-swiper"
          >
            {RenderSlider}
          </Swiper>
        )}
      </ul>
      <ul className="Team-wrapper">{renderTeam}</ul>
    </div>
  );
};

export default Template8;
