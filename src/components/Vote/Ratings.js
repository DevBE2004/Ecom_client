import React, { memo } from "react";
import icons from "utils/icons";
import { numberToStar } from "utils/helpers";
import { VoteBar } from "components";
const { FaStar } = icons;

const Ratings = ({ total, ratings }) => {
  return (
    <div className="flex p-4 borde ">
      <div className="w-2/5 p-4 flex flex-col items-center justify-center">
        <span className="flex items-center">
          {Math.round(total)}/5
          <FaStar color="orange" />
        </span>
        <span className="flex">
          {numberToStar(total)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}
        </span>
        <span>{`${ratings?.length} review`}</span>
      </div>
      <div className="w-3/5 flex flex-col p-4">
        {Array.from(Array(5).keys())
          .reverse()
          .map((el) => (
            <VoteBar
              key={el}
              star={el + 1}
              userVote={ratings?.filter((item) => item.star === el + 1)?.length}
              userVoteTotal={ratings?.length}
            />
          ))}
      </div>
    </div>
  );
};

export default memo(Ratings);
