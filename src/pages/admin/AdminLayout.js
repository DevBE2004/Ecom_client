import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import path from "utils/path";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { AdminSidebar } from "components";


const AdminLayout = () => {
  const { isLogin, current } = useSelector((state) => state.user);
  if (!isLogin || !current || +current.role !== 1)
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  return (
    <div className="flex w-full min-h-screen">
      <div className="w-[300px] flex-none ">
        <AdminSidebar />
      </div>
      <div className="flex w-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
