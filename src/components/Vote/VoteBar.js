import React, { memo, useEffect, useRef } from "react";
import icons from "utils/icons";
const { FaStar } = icons;

const VoteBar = ({ star, userVote, userVoteTotal }) => {
  const percentRef = useRef();
  const percent = Math.round((userVote * 100) / userVoteTotal) || 0;
  useEffect(() => {
    percentRef.current.style.cssText = `right:${100 - percent}%`;
  }, [userVote, userVoteTotal]);
  return (
    <div className="flex-1 flex items-center gap-2 text-gray-500">
      <div className="flex items-center gap-1 text-sm">
        <span>{star}</span>
        <FaStar color="orange" />
      </div>
      <div className="flex-6 w-full h-[6px] bg-gray-300 rounded-md relative">
        <div
          ref={percentRef}
          className="absolute inset-0 bg-red-500 rounded-md"
        ></div>
      </div>
      <div className="flec-3">{`${userVote} votes`}</div>
    </div>
  );
};

export default memo(VoteBar);
