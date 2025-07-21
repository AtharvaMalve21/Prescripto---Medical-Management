import React, { useContext, useEffect } from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import axios from "axios";
import { DoctorContext } from "../context/DoctorContext.jsx";
import TopDoctors from "../components/TopDoctors.jsx";
import Banner from "../components/Banner.jsx";

const Home = () => {
  const { setDoctors } = useContext(DoctorContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchDoctorDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/doctor");

      if (data.success) {
        setDoctors(data.data);
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
};

export default Home;
