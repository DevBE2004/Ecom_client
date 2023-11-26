import { apiGetProducts } from "apis/product";
import { InputForm, Pagination, CustomizeVariants } from "components";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiDelete } from "apis/product";
import { useForm } from "react-hook-form";
import { formatMonney } from "utils/helpers";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import UpdateProduct from "./UpdateProduct";
import icons from "utils/icons";
const { AiFillDelete, RxUpdate, MdOutlineDashboardCustomize } = icons;
const ManageProduct = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [editProduct, setEditProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const render = useCallback(() => {
    setUpdate(!update);
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(0);
  const [customizeVariants, setCustomizeVariants] = useState(null);
  const fetchProduct = async (param) => {
    const response = await apiGetProducts({
      ...param,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setProduct(response.productDatas);
      setCount(response.counts);
    }
  };
  const [params] = useSearchParams();
  const currentpage = +params.get("page");
  const queryDebounce = useDebounce(watch("q"), 800);
  const handleDelete = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Bạn có muốn xóa không ?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDelete(pid);
        if (response.success) {
          toast.success(response.message);
          render();
        } else toast.error(response.message);
      }
    });
  };

  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDebounce }).toString(),
      });
    } else
      navigate({
        pathname: location.pathname,
      });
  }, [queryDebounce]);
  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProduct(searchParams);
  }, [params, update]);
  return (
    <div className="w-full flex flex-col relative h-full">
      {editProduct && (
        <div className="bg-gray-100 absolute inset-0 h-full">
          <UpdateProduct
            editProduct={editProduct}
            render={render}
            setEditProduct={setEditProduct}
          />
        </div>
      )}
      {customizeVariants && (
        <div className="bg-gray-100 absolute inset-0 h-full">
          <CustomizeVariants
            customizeVariants={customizeVariants}
            setCustomizeVariants={setCustomizeVariants}
          />
        </div>
      )}
      <div className="w-full flex items-center justify-center text-main">
        <h1 className="text-3xl font-bold tracking-tight ">Manage Product</h1>
      </div>
      <div className="p-4 flex w-full justify-end items-center">
        <form>
          <InputForm
            id="q"
            name="q"
            register={register}
            errors={errors}
            fw
            placeholder="Search Product ...."
          />
        </form>
      </div>
      <div className="w-full">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="uppercase bg-main ">Stt</th>
              <th className="uppercase bg-main ">Thumb</th>
              <th className="uppercase bg-main ">Title</th>
              <th className="uppercase bg-main ">brand</th>
              <th className="uppercase bg-main ">category</th>
              <th className="uppercase bg-main ">price</th>
              <th className="uppercase bg-main ">quantity</th>
              <th className="uppercase bg-main ">sold</th>
              <th className="uppercase bg-main ">rating</th>
              <th className="uppercase bg-main ">Variants</th>
              <th className="uppercase bg-main ">color</th>
              <th className="uppercase bg-main ">updated</th>
              <th className="uppercase bg-main " colspan="3">
                actions
              </th>
            </tr>
          </thead>
          <tbody>
            {product?.map((el, idx) => (
              <tr key={el._id}>
                <td className=" text-center ">
                  {currentpage
                    ? (currentpage - 1) * process.env.REACT_APP_LIMIT + idx + 1
                    : idx + 1}
                </td>
                <td className="  flex items-center justify-center">
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className=" w-[40px] h-[50px] object-contain"
                  />
                </td>
                <td className=" text-center ">{el.title}</td>
                <td className=" text-center ">{el.brand}</td>
                <td className=" text-center ">{el.category}</td>

                <td className=" text-center ">{`${formatMonney(
                  el.price
                )} VND`}</td>
                <td className=" text-center ">{el.quantity}</td>
                <td className=" text-center ">{el.sold}</td>
                <td className=" text-center ">{el.totalRatings}</td>
                <td className=" text-center ">{el?.variants.length||0}</td>
                <td className=" text-center ">{el.color}</td>
                <td className=" text-center ">
                  {moment(el.createdAt).format("DD/MM/YY")}
                </td>
                <td
                  onClick={() => setEditProduct(el)}
                  className="text-blue-400 hover:text-orange-500 hover:underline cursor-pointer"
                >
                  <RxUpdate />
                </td>
                <td
                  onClick={() => handleDelete(el._id)}
                  className="text-blue-400 hover:text-orange-500 hover:underline cursor-pointer"
                >
                  <AiFillDelete />
                </td>
                <td
                  onClick={() => setCustomizeVariants(el)}
                  className="text-blue-400 hover:text-orange-500 hover:underline cursor-pointer"
                >
                  <MdOutlineDashboardCustomize />
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

export default ManageProduct;
