import React, { memo, useEffect, useState } from "react";
import paymentGif from "assets/payment.gif";
import { useSelector } from "react-redux";
import { formatMonney } from "utils/helpers";
import Payment from "components/common/Payment";
import { Congrat, InputForm } from "components";
// import { useForm } from "react-hook-form";
import withBaseComponent from "hocs/withBaseComponent";
import { getUser } from "store/user/acsynAction";

const Checkout = ({ dispatch, navigate }) => {
  // const {
  //   register,
  //   formState: { errors },
  // } = useForm();
  const { currentCart, current } = useSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      dispatch(getUser());
    }
  }, [isSuccess]);

  return (
    <div className="p-8 w-full grid grid-cols-10 gap-6 h-full max-h-screen overflow-y-auto">
      {isSuccess && <Congrat />}
      <div className="w-full flex justify-center items-center col-span-4">
        <img
          src={paymentGif}
          alt="paymemt"
          className="h-[70%] object-contain"
        />
      </div>
      <div className="flex w-full flex-col gap-6 col-span-6 items-center">
        <h2 className="text-2xl font-bold uppercase">Checkout your order</h2>
        <div className="flex gap-6 w-full">
          <table className="table-auto flex-1">
            <thead>
              <tr className=" bg-yellow-500 p-2">
                <th className="border-2 border-black text-left">Products</th>
                <th className="border-2 border-black text-center">Quantity</th>
                <th className="border-2 border-black text-center">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentCart?.map((el) => (
                <tr key={el?._id}>
                  <td className="border border-black text-left">{el?.title}</td>
                  <td className="border border-black text-center">
                    {el?.quantity}
                  </td>
                  <td className="border border-black text-right">{`${formatMonney(
                    el?.price
                  )} VND`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex-1">
            <div className="w-full">
              <span className="font-semibold">Subtotal: </span>
              <span className="text-main font-bold">
                {`${formatMonney(
                  currentCart?.reduce(
                    (sum, el) => sum + +el?.price * el?.quantity,
                    0
                  )
                )} VND`}
              </span>
            </div>
            <div className="w-full">
              <span className="font-semibold">Address: </span>
              <span className="text-main font-bold">{current?.address}</span>
            </div>
            {/* <InputForm
              label="Address"
              register={register}
              errors={errors}
              id="address"
              fw
              validate={{ required: "Need fill this field" }}
              placeholder="Enter your address..."
            /> */}
          </div>
        </div>
        <div className="w-full mt-4">
          <Payment
            setIsSuccess={setIsSuccess}
            payload={{
              products: currentCart,
              total: Math.round(
                +currentCart?.reduce(
                  (sum, el) => sum + +el?.price * el?.quantity,
                  0
                ) / 23500
              ),
              address: current?.address,
            }}
            amount={Math.round(
              +currentCart?.reduce(
                (sum, el) => sum + +el?.price * el?.quantity,
                0
              ) / 23500
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(Checkout));
