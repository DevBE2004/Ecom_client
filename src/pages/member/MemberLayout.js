import React, { memo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import path from "utils/path";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { MemberSidebar } from "components";

const MemberLayout = () => {
  const { isLogin, current } = useSelector((state) => state.user);
  if (!isLogin || !current)
    return <Navigate to={`/${path.HOME}`} replace={true} />;
  return (
    <div className="flex w-full min-h-screen">
      <div className="w-[300px] flex-none ">
        <MemberSidebar />
      </div>
      <div className="flex w-full bg-gray-200">
        <Outlet />
      </div>
    </div>
  );
};

export default memo(MemberLayout);
