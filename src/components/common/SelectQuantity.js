import React, { memo } from "react";

const SelectQuantity = ({ quantity, handleQuantity,handleChangeQuantity }) => {
  return (
    <div className="flex items-center justify-center">
      <span className="cursor-pointer p-2 border-r-2  border-black"
      onClick={()=>handleChangeQuantity('minus')}>-</span>
      <input
        type="text"
        className="py-2 outline-none w-[50px] text-center"
        value={quantity}
        onChange={(e) => handleQuantity(e.target.value)}
      />
      <span className="cursor-pointer p-2 border-l-2  border-black"
      onClick={()=>handleChangeQuantity('plus')}>+</span>
    </div>
  );
};

export default memo(SelectQuantity);
