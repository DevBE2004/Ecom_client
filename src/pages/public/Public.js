import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Navigation, Footer, Topheader } from "components";

const Public = () => {
  return (
    <div className="w-full max-h-screen overflow-y-auto flex flex-col items-center">
      <Topheader />
      <Header />
      <Navigation />
      <div className="w-main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Public;
