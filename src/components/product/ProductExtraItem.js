import React, { memo } from "react";

const ProductExtraItem = ({ icon, title, sub }) => {
  return (
    <div className="flex mb-[10px] border items-center p-4 gap-4">
      <span className="p-2 text-gray-100 bg-gray-600 rounded-full items-center justify-center">{icon}</span>
      <div className="flex flex-col text-sm text-gray-500">
        <span className="font-medium">{title}</span>
        <span>{sub}</span>
      </div>
    </div>
  );
};

export default memo(ProductExtraItem);
