import React, { memo, useRef, useState, useEffect } from "react";
import icons from "utils/icons";
import logo from "assets/logo.png";
import { voteStar } from "utils/contants";
import { capitalizedStr } from "utils/helpers";
import {Button} from "components";

const { FaStar } = icons;

const VoteOption = ({ nameProduct, handleSubmitVote }) => {
  const modalRef = useRef();
  const [chosenScore, setChosenScore] = useState(null);
  const [comment, setComment] = useState("");
  const [score, setScore] = useState(null);
  useEffect(() => {
    modalRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={modalRef}
      className="w-[700px] bg-white flex flex-col justify-center items-center gap-4 p-4"
    >
      <img src={logo} alt="" className="w-[300px] object-contain my-8" />
      <h2 className="text-center text-medium text-lg">{`Đánh giá sản phẩm ${nameProduct} `}</h2>
      <textarea
        className="form-textarea w-full  outline-none"
        placeholder="Nhập ý kiến đánh giá của bạn vào đây..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div>
        <p className="text-center">Bạn cảm thấy sản phẩm này thế nào ?</p>
        <div className="gap-4 flex justify-center items-center mb-[20px]">
          {voteStar.map((el) => (
            <div className="bg-gray-200 rounded-md ">
              <span
                className="line-clamp-1 w-[100px] text-center flex flex-col items-center justify-center"
                key={el.id}
                onClick={() => {
                  setChosenScore(el.id);
                  setScore(el.id);
                }}
              >
                {Number(chosenScore) && chosenScore >= el.id ? (
                  <FaStar color="orange" />
                ) : (
                  <FaStar color="gray" />
                )}
                {capitalizedStr(el.text)}
              </span>
            </div>
          ))}
        </div>
        <Button
          handleOnClick={() => handleSubmitVote({ comment, score })}
          children="Submit"
          fw
        />
      </div>
    </div>
  );
};

export default memo(VoteOption);
