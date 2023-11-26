import React, { memo } from "react";
import { formatMonney, numberToStar } from "utils/helpers";

const ProductCart = ({ img, price, title, totalRatings }) => {
  return (
    <div className="w-[30%] flex-auto  mx-[10px] mb-[20px]">
      <div className="border flex w-full">
        <img src={img} alt="" className="w-[120px] object-contain" />
        <div className="flex-col flex">
          <span className="line-clamp-1 capitalize gap-1 text-xs w-full">
            {title.toLowerCase()}
          </span>
          <span className="flex h-4">
            {numberToStar(totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span>{`${formatMonney(price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCart);
