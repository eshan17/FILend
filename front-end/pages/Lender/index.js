/** @format */

import React from "react";
import Navbar from "@/components/Navbar";
import Fade from "react-reveal/Fade";
const index = () => {
  return (
    <>
      <Fade top>
        <Navbar button={false} />
      </Fade>
    </>
  );
};

export default index;
