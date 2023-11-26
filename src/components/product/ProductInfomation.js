import React, { useState, memo, useCallback, useEffect } from "react";
import { description } from "utils/contants";
import { Button, Ratings, VoteOption, Comment } from "components";
import { apiRatings } from "apis/product";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "store/app/appSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "utils/path";

const ProductInfomation = ({ total, ratings, nameProduct, pid, reRender }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activated, setActivated] = useState(1);
  const { isLogin } = useSelector((state) => state.user);
  const [payload, setPayload] = useState({
    comment: "",
    score: "",
  });
  const handleSubmitVote = async (value) => {
    if (!pid || !value.comment || !value.score) {
      alert("Bạn cần phải đánh giá sản phẩm!");
      return;
    }
    const { score, comment } = value;
    const response = await apiRatings({
      star: score,
      comment: comment,
      pid,
      updatedAt: Date.now(),
    });
    reRender();
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
  };
  const handleVoteNow = () => {
    if (!isLogin) {
      Swal.fire({
        text: "Đăng nhập để đánh giá sản phẩm",
        cancelButtonText: "Cancel",
        confirmButtonText: "Login",
        showCancelButton: true,
        title: "Thất bại!",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate(`/${path.LOGIN}`);
        }
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOption
              nameProduct={nameProduct}
              handleSubmitVote={handleSubmitVote}
            />
          ),
        })
      );
    }
  };
  return (
    <div>
      <div className="flex items-center gap-2 relative bottom-[-1px]">
        {description.map((el, id) => (
          <span
            className={`p-2 px-4 bg-gray-200 cursor-pointer ${
              activated === el.id && "bg-white border border-b-0"
            }`}
            key={id}
            onClick={() => setActivated(el.id)}
          >
            {el.title}
          </span>
        ))}
      </div>
      <div className="w-full border p-4">
        {description.some((el) => el.id === activated) &&
          description.find((el) => el.id === activated)?.content}
      </div>
      <div>
        <div>
          <Ratings total={total} ratings={ratings} />
          <div className="w-full flex flex-col items-center justify-center p-4 text-sm gap-2">
            <span>Mời bạn đánh giá sản phẩm này</span>
            <Button
              handleOnClick={() => dispatch(handleVoteNow)}
              children="Submit"
            />
          </div>
          <div className="flex flex-col gap-4">
            {ratings?.map((el) => (
              <Comment
                ratings={ratings}
                key={el.id}
                updatedAt={el.updatedAt}
                comment={el.comment}
                name={`${ratings[0]?.postBy?.lastname} ${ratings[0]?.postBy?.firstname}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductInfomation);
