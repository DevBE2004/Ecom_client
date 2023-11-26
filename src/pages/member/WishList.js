import { Button, Product } from "components";
import React, { memo } from "react";
import { useSelector } from "react-redux";

const WishList = () => {
  const { current } = useSelector((state) => state.user);
  console.log(current);
  return (
    <div className="w-full">
      <header className="text-3xl text-center text-main font-semibold p-4 border-b-2 border-b-main">
        My Wishlist
      </header>
      <div className="p-4 flex flex-wrap w-full">
        {current?.wishlist?.map((el) => (
          <div
            className="bg-white rounded-md drop-shadow min-w-[250px]"
            key={el?._id}
          >
            <Product pid={el._id} productData={el} normal />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WishList);
