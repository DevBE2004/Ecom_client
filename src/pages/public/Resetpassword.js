import React, { useState } from "react";
import { Button } from "components";
import { useNavigate, useParams } from "react-router-dom";
import { apiResetPassword } from "apis/user";
import {toast} from 'react-toastify'

const Resetpassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token });
    if (response.success) {toast.success(response.message, { theme: "colored" })
  navigate('/login')}
    else toast.info(response.message, { theme: "colored" });
  };
  return (
    <div className=" animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50">
      <div className="flex flex-col gap-4">
        <label htmlFor="password">Enter your password: </label>
        <input
          type="password"
          id="password"
          className="w-[800px] pb-2 border-b outline-none"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center justify-end w-full gap-4">
          <Button
            name="Submit"
            handleOnClick={handleResetPassword}
            style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Resetpassword;
