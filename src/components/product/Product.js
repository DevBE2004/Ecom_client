import React, { memo, useState } from "react";
import { formatMonney, numberToStar } from "utils/helpers";
import news from "assets/new.png";
import seller from "assets/seller.png";
import { Selectoption } from "components";
import icons from "utils/icons";
import withBaseComponent from "hocs/withBaseComponent";
import { showModal } from "store/app/appSlice";
import { DetalProduct } from "pages/public";
import { BsFillCartCheckFill, BsFillCartPlusFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { getUser } from "store/user/acsynAction";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "utils/path";
import { FaHeart } from "react-icons/fa";
import { apiUpdateCart, apiUpdateWishlist } from "apis/user";
import clsx from "clsx";

const { AiFillEye, AiOutlineHeart, AiOutlineMenu } = icons;
const Product = ({ productData, isNew, normal, navigate, dispatch, className }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  const { current } = useSelector((state) => state.user);
  const handleClickOption = async (e, flag) => {
    e.stopPropagation();
    if (flag === "CART") {
      if (!current)
        return Swal.fire({
          title: "Almost...",
          text: "Please login first",
          icon: "info",
          cancelButtonText: "Not now",
          showCancelButton: true,
          confirmButtonText: "GO login page",
        }).then((rs) => {
          if (rs.isConfirmed) navigate(`/${path.LOGIN}`);
        });
      const response = await apiUpdateCart({
        pid: productData?._id,
        color: productData?.color,
        price: productData?.price,
        thumbnail: productData?.thumb,
        title: productData?.title,
      });
      if (response.success) {
        toast.success(response.message);
        dispatch(getUser());
      } else toast.error(response.message);
    }
    if (flag === "WISHLIST") {
      const response = await apiUpdateWishlist(productData?._id);
      if (response.success) {
        dispatch(getUser());
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
    if (flag === "QUICKVIEW") {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: <DetalProduct isQuickView data={productData} />,
        })
      );
    }
  };
  return (
    <div className={clsx("w-full text-base px[7px]",className)}>
      <div
        onClick={(e) =>
          navigate(
            `/${productData?.category?.toLowerCase()}/${productData?._id}/${
              productData?.title
            }`
          )
        }
        className="w-full  flex flex-col justify-center items-center border"
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-0 flex  left-0 right-0 items-center justify-center animate-slide-top">
              {current?.cart?.some((el) => el.product?._id === productData?._id) ? (
                <span>
                  <Selectoption
                    title="Added to cart"
                    icon={<BsFillCartCheckFill color="green" />}
                  />
                </span>
              ) : (
                <span onClick={(e) => handleClickOption(e, "CART")}>
                  <Selectoption
                    title="Add to cart"
                    icon={<BsFillCartPlusFill />}
                  />
                </span>
              )}
              <span onClick={(e) => handleClickOption(e, "QUICKVIEW")}>
                <Selectoption title="Quick View" icon={<AiFillEye />} />
              </span>
              <span onClick={(e) => handleClickOption(e, "WISHLIST")}>
              {current?.wishlist?.find(el=> el?._id === productData?._id)
                ?<Selectoption title="remove wishlist" icon={<FaHeart color="red" />} />
                :<Selectoption title="Add wishlist" icon={<AiOutlineHeart />} />}
              </span>
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "https://th.bing.com/th/id/OIP.wyS54dWv02tzWeNTGgM8KgHaFW?w=241&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            }
            alt="product"
            className="w-[240px] h-[243px] object-cover "
          />
          {!normal && (
            <img
              src={isNew ? news : seller}
              className="absolute top-[-7px] right-[0px] h-[35px] w-[70px] object-cover"
              alt="label"
            />
          )}
        </div>
        <div className=" flex flex-col items-start w-full gap-1 mt-[15px]">
          <span className="line-clamp-1">{productData?.title}</span>
          <span className="flex">
            {numberToStar(productData?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span>{`${formatMonney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(Product));
