import React, { memo } from "react";

const Selectoption = ({ icon }) => {
  return (
    <div
      className="w-10 h-10 bg-white rounded-full flex justify-center items-center border shadow-md hover:bg-gray-800 hover:text-white
    cursor-pointer hover:boder-gray-800"
    >
      {icon}
    </div>
  );
  
};

export default memo(Selectoption);
