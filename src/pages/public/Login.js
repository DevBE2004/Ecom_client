import React, { useCallback, useEffect, useState } from "react";
import { InputField, Button, Loading } from "components";
import {
  apiRegister,
  apiLogin,
  apiForgotPassword,
  apiFinalRegister,
} from "apis/user";
import { showModal } from "store/app/appSlice";
import Swal from "sweetalert2";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import path from "utils/path";
import { login } from "store/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { validate } from "utils/helpers";
import loginsvg from "assets/login.svg"

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [searchParams] = useSearchParams();
  const resetPayload = () => {
    setPayload({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      mobile: "",
    });
  };
  const [isVeriFieldEmail, setIsVeriFieldEmail] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [email, setEmail] = useState([]);
  const [token, setToken] = useState("");
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) toast.success(response.message, { theme: "colored" });
    else toast.info(response.message, { theme: "colored" });
  };
  useEffect(() => {
    resetPayload();
  }, [isRegister]);
  //Submit
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    const invalids = isRegister
      ? validate(payload, setInvalidFields)
      : validate(data, setInvalidFields);
    if (invalids === 0) {
      if (isRegister) {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
        const response = await apiRegister(payload);
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        if (response.success) {
          setIsVeriFieldEmail(true);
        } else Swal.fire("Thất Bại", response.message, "error");
      } else {
        const rs = await apiLogin(data);
        if (rs.success) {
          dispatch(
            login({
              isLogin: true,
              token: rs.accessToken,
              userData: rs.userData,
            })
          );
          searchParams.get("redirect")
            ? navigate(searchParams.get("redirect"))
            : navigate(`/${path.HOME}`);
        } else {
          Swal.fire("Thất Bại", rs.message, "error");
        }
      }
    }
  }, [payload, isRegister]);
  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire("Thành Công", response.message, "success").then(() => {
        setIsRegister(false);
        resetPayload();
      });
    } else Swal.fire("Thất Bại", response.message, "error");
    setIsVeriFieldEmail(false);
    setToken("");
  };
  return (
    <div className="w-screen h-screen relative">
      {isVeriFieldEmail && (
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-overlay z-50 flex flex-col justify-center items-center">
          <div className="bg-green-400 w-[500px] rounded-md p-8">
            <h4 className="">Kiểm tra email của bạn, Nhập mã code:</h4>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="p-2 border outline-none rounded-md ml-4"
            ></input>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 font-semibold text-white rounded-md"
              onClick={finalRegister}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {isForgotPassword && (
        <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50">
          <div className="flex flex-col gap-4">
            <label htmlFor="email">Enter your email: </label>
            <input
              type="text"
              id="email"
              className="w-[800px] pb-2 border-b outline-none"
              placeholder="Example: email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex items-center justify-end w-full gap-4">
              <Button
                children="Submit"
                handleOnClick={handleForgotPassword}
                style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2"
              />
              <Button
                children="Back"
                handleOnClick={() => setIsForgotPassword(false)}
              />
            </div>
          </div>
        </div>
      )}
      <img
        src={loginsvg}
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute top-[200px] left-[500px]">
        <div className="flex flex-col p-8 bg-white rounded-md min-w-[500px] absolute gap-2">
          <h1 className="font-semibold flex items-center justify-center mb-8 uppercase text-[24px]">
            {isRegister ? "Register" : "Login"}
          </h1>
          {isRegister && (
            <div className="flex items-center justify-center">
              <InputField
                value={payload.firstname}
                setValue={setPayload}
                nameKey={"firstname"}
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey={"lastname"}
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
          )}
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey={"mobile"}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey={"email"}
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey={"password"}
            type="password"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <Button
            children={isRegister ? "Resgister" : "Login"}
            handleOnClick={handleSubmit}
            fw
          />
          {!isRegister && (
            <div className="flex justify-between">
              <span
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Forgot your account?
              </span>
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => setIsRegister(true)}
              >
                Create account
              </span>
            </div>
          )}
          {isRegister && (
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setIsRegister(false)}
            >
              Back
            </span>
          )}
          <Link
            className="flex justify-center items-center hover:underline text-blue-500 cursor-pointer"
            to={`/${path.HOME}`}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
