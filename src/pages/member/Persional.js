import { Button, InputForm } from "components";
import React, { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import avt from "assets/avt.png";
import { apiUpdatedCurrent } from "apis/user";
import { getUser } from "store/user/acsynAction";
import { toast } from "react-toastify";
import { redirect, useSearchParams } from "react-router-dom";
import withBaseComponent from "hocs/withBaseComponent";

const Persional = ({ navigate }) => {
  const {
    reset,
    formState: { errors, isDirty },
    handleSubmit,
    register,
  } = useForm();
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const handleUpdateInfo = async (data) => {
    const formData = new FormData();
    if (data?.avatar?.length > 0) formData.append("avatar", data?.avatar[0]); //"avatar" phải giống trong router
    delete data?.avatar;
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);
    const response = await apiUpdatedCurrent(formData);
    if (response.success) {
      dispatch(getUser());
      toast.success(response.message);
      if (searchParams.get("redirect")) navigate(searchParams.get("redirect"));
    } else toast.error(response.message);
  };
  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      email: current?.email,
      mobile: current?.mobile,
      avatar: current?.avatar,
      address: current?.address,
    });
  }, []);
  return (
    <div className="w-full">
      <header className="text-3xl text-center text-main font-semibold p-4 border-b-2 border-b-main">
        Persional
      </header>
      <form onSubmit={handleSubmit(handleUpdateInfo)} className="w-4/5 mx-auto">
        <InputForm
          label="Firstname"
          register={register}
          errors={errors}
          id="firstname"
          style="w-full"
          validate={{ required: "Need fill this field" }}
        />
        <InputForm
          label="Lastname"
          register={register}
          errors={errors}
          id="lastname"
          style="w-full"
          validate={{ required: "Need fill this field" }}
        />
        <InputForm
          label="Email"
          register={register}
          errors={errors}
          id="email"
          style="w-full"
          validate={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Enter a valid e-mail address",
            },
          }}
        />
        <InputForm
          label="Phone"
          register={register}
          errors={errors}
          id="mobile"
          style="w-full"
          validate={{
            required: "Phone is required",
            pattern: {
              value: /^(0|\+)[0-9]{9}$/,
              message: "Enter a valid Phone address",
            },
          }}
        />
        <InputForm
          label="Address"
          register={register}
          errors={errors}
          id="address"
          style="w-full"
          validate={{
            required: "address is required",
          }}
        />
        <div className="mt-10">
          <span className="font-semibold">Account status:</span>
          <span>{current?.isBlocked ? " Blocked" : " Active"}</span>
        </div>
        <div>
          <span className="font-semibold">Account Role:</span>
          <span>{+current?.role === 1 ? " Admin" : " User"}</span>
        </div>
        <div>
          <span className="font-semibold">Account Created:</span>
          <span> {moment(current?.createdAt).toNow()}</span>
        </div>
        <div>
          <span className="font-semibold">Profile image:</span>
          <label htmlFor="file">
            <img
              src={current?.avatar || avt}
              className="w-10 h-10 rounded-full"
            />
          </label>
          <input type="file" {...register("avatar")} id="file" hidden />
        </div>
        {isDirty && (
          <div className="flex items-center justify-center gap-4">
            <Button type={"submit"} children={"Updated Information"} />
          </div>
        )}
      </form>
    </div>
  );
};

export default withBaseComponent(memo(Persional));
