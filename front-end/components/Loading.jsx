/** @format */

import React from "react";
import { BounceLoader } from "react-spinners";
const Loading = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <BounceLoader size={100} color="#0190FF" />
      </div>
    </div>
  );
};
export default Loading;
