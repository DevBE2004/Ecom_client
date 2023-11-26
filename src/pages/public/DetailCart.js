import { current } from "@reduxjs/toolkit";
import { BreadCrumb, Button, OrderItem } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Link, createSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { formatMonney } from "utils/helpers";
import path from "utils/path";

const DetailCart = ({ location, navigate }) => {
  const { currentCart, current } = useSelector((state) => state.user);
  const handleSubmit = () => {
    if (!current?.address)
      return Swal.fire({
        icon: "info",
        title: "Thiếu địa chỉ mua hàng!",
        text: "Bạn cần cập nhật địa chỉ mua hàng của mình!",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Update now",
        cancelButtonText: "Cancel",
      }).then((rs) => {
        if (rs.isConfirmed)
          navigate({
            pathname: `/${path.MEMBER}/${path.PERSIONAL}`,
            search: createSearchParams({ redirect: location.pathname }).toString()
          });
      });
    else window.open(`/${path.CHECKOUT}`, "_blank");
  };
  return (
    <div className="w-full">
      <div className="bg-gray-100">
        <h3 className="text-3xl font-bold tracking-tight">MY CART</h3>
        {/* <BreadCrumb
          category={location.pathname?.replace("/", "")?.split("-")?.join(" ")}
        /> */}
      </div>
      <div className="flex flex-col border mt-8">
        <div className="font-semibold flex bg-main text-white p-4">
          <span className="w-3/6 text-center uppercase font-bold">Product</span>
          <span className="w-1/6 text-center uppercase font-bold">
            quantity
          </span>
          <span className="w-2/6 text-center uppercase font-bold">price</span>
        </div>
        {currentCart?.map((el) => (
          <OrderItem key={el._id} el={el} defautQuantity={el?.quantity} />
        ))}
      </div>
      <div className="w-full border flex flex-col items-end justify-center">
        <span className="flex gap-10">
          <span>Subtotal: </span>
          <span className="text-main font-bold">
            {`${formatMonney(
              currentCart?.reduce(
                (sum, el) => sum + +el?.price * el?.quantity,
                0
              )
            )} VND`}
          </span>
        </span>
        <span>Shipping, taxes, and discounts calculated at checkout.</span>
        <Button children={"Checkout"} handleOnClick={handleSubmit} />
        {/* <Link
          target="_blank"
          className="bg-main text-white p-2 rounded-md"
          to={`/${path.CHECKOUT}`}
        >
          Checkout
        </Link> */}
      </div>
      <div className="w-full bg-gray-700 text-white mb-8">
        All orders are processed in USD. While the content of your cart is
        currently displayed in VND, you will checkout using USD at the most
        current exchange rate.
      </div>
    </div>
  );
};

export default withBaseComponent(memo(DetailCart));
