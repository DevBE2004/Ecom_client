import { apiGetOrders, apiGetUserOrder } from "apis/product";
import { CustomSelect, InputForm, Pagination } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { statusOptions } from "utils/contants";

const History = ({ navigate, location }) => {
  const [order, setOrder] = useState(null);
  const { register, formState: errors, watch, setValue } = useForm();
  const [count, setCount] = useState(0);
  const q = watch("q");
  const status = watch("status");
  const fetchOrder = async (param) => {
    const response = await apiGetUserOrder({
      ...param,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setOrder(response?.order);
      setCount(response?.counts);
    }
  };
  const [params] = useSearchParams();
  const currentpage = +params.get("page");
  useEffect(() => {
    const pr = Object.fromEntries([...params]);
    fetchOrder(pr);
  }, [params]);
  const handleSearchStatus = ({ value }) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString(),
    });
  };
  return (
    <div className="w-full">
      <header className="text-3xl text-center text-main font-semibold p-4 border-b-2 border-b-main">
        Persional
      </header>
      <div className="p-4 flex w-full justify-end items-center">
        <form className="w-[45%] gap-4 flex">
          <div className="w-full">
            <InputForm
              register={register}
              errors={errors}
              id="q"
              fw
              placeholder="Search order by status..."
            />
          </div>
          <div className="mt-10 w-full">
            <CustomSelect
              options={statusOptions}
              value={status}
              onChange={(val) => handleSearchStatus(val)}
              wrapClassname={"w-full"}
            />
          </div>
        </form>
      </div>
      <div className="w-full my-10">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="uppercase bg-main ">Stt</th>
              <th className="uppercase bg-main ">Products</th>
              <th className="uppercase bg-main ">Total</th>
              <th className="uppercase bg-main ">Status</th>
              <th className="uppercase bg-main ">created At</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((el, idx) => (
              <tr key={el._id}>
                <td className=" border border-black text-center border-b  ">
                  {currentpage
                    ? (currentpage - 1) * process.env.REACT_APP_LIMIT + idx + 1
                    : idx + 1}
                </td>
                <td className=" border border-black flex items-center">
                  <span className="flex flex-col items-center">
                    {el?.products?.map((item) => (
                      <span
                        className="flex flex-col items-start w-full"
                        key={item._id}
                      >
                        <span className="flex items-center">
                          <img
                            src={item?.thumbnail}
                            className="w-10 h-10"
                            alt="thumb"
                          />

                          <span className="flex flex-col">
                            <span>{`${item?.title} - ${item?.color}`}</span>
                            Quantity: {item?.quantity}
                          </span>
                        </span>
                      </span>
                    ))}
                  </span>
                </td>
                <td className=" border border-black text-center ">
                  {el?.total + " 💲"}
                </td>
                <td className=" border border-black text-center ">
                  {el?.status}
                </td>
                <td className=" border border-black text-center ">
                  {moment(el?.createdAt).format("DD/MM/YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end w-full">
        <Pagination totalProductCount={count} />
      </div>
    </div>
  );
};

export default withBaseComponent(memo(History));
