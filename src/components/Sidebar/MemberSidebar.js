import React, { Fragment, memo, useState } from "react";
import { memberSidebar } from "utils/contants";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import avt from "assets/avt.png";
import { useSelector } from "react-redux";
import path from "utils/path";
import { HiHome } from "react-icons/hi";

const activedStyle = "bg-main";
const notActivedStyle = "";
const MemberSideBar = () => {
  const { current } = useSelector((state) => state.user);
  return (
    <div className="flex w-full flex-col py-4">
      <Link
        to={`/${path.HOME}`}
        className="flex items-center hover:text-main cursor-pointer hover:underline gap-2"
      >
        <HiHome />
        Home
      </Link>
      <div className="flex-col justify-center flex items-center py-4 gap-2 w-full">
        <img
          src={current?.avatar || avt}
          alt="logo"
          className="w-[100px] h-[100px] rounded-full"
        />
        <span className="font-semibold text-[14px]">{`${current?.lastname} ${current?.firstname}`}</span>
      </div>
      <div className="flex flex-col">
        {memberSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    isActive ? activedStyle : notActivedStyle,
                    "hover:bg-main"
                  )
                }
                to={el.path}
              >
                <div className="flex items-center gap-2">
                  <span>{el.icon}</span>
                  <span>{el.text}</span>
                </div>
              </NavLink>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(MemberSideBar);
