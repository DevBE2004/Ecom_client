import React, { memo } from "react";
import avt from "assets/avt.png";
import moment from "moment";
import { numberToStar } from "utils/helpers";

const Comment = ({
  image = avt,
  name = "Anonymous",
  comment,
  ratings,
  updatedAt,
}) => {
  return (
    <div classname="flex">
      <div className="p-4 flex items-center ">
        <img
          src={image}
          alt="avatar"
          className="w-[40px] h-[40px] rounded-full object-cover"
        />
        <div className="flex-col flex justify-center mt-2">
          <h3 className="font-bold">{name}</h3>
          <span className="text-xs mr-3">{moment(updatedAt)?.fromNow()}</span>
        </div>
      </div>
      <div className="pl-[50px] border bg-gray-200 mt-0">
        <span className="flex items-center">
          <span className="font-semibold">Đánh giá: </span>
          <span className="flex">
            {numberToStar(ratings[0]?.star)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
        </span>
        <span>
          <span className="font-semibold">Comment: </span>
          <span>{comment}</span>
        </span>
      </div>
    </div>
  );
};

export default memo(Comment);
