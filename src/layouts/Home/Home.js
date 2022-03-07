import React from "react";

import SearchForm from "components/SearchForm/SearchForm";
import Footer from "components/Footer/Footer";

const HomeLayout = () => {
  return (
    <>
      <div className="container" style={{ paddingTop: 25 }}>
        <blockquote className="blockquote text-center">
          <h1 className="mb-2">Inter-IIT Tech Meet 10.0</h1>
          <h3 className="mb-0">
            Digital Alpha's SEC Filing Analyzer for SaaS Companies
          </h3>
          <footer className="blockquote-footer">
            IIT Kanpur
          </footer>
        </blockquote>
        <div className="wrapper wrapper-full-page" style={{paddingTop: 25}}>
          <h1 className="h1 text-white">Search Company</h1>
          <SearchForm />
        </div>
      </div>
      <Footer fluid />
    </>
  );
};

export default HomeLayout;
