import React, { Fragment, memo, useState } from "react";
import logo from "assets/logo.png";
import { adminSidebar } from "utils/contants";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import icons from "utils/icons";
import path from "utils/path";
const { AiFillCaretLeft, AiFillCaretDown } = icons;

const activedStyle = "bg-main";
const notActivedStyle = "";
const AdminSidebar = () => {
  const [actived, setActived] = useState([]);
  const handleShowTab = (TabId) => {
    if (actived.some((el) => el === TabId))
      setActived((prev) => prev.filter((el) => el !== TabId));
    else setActived((prev) => [...prev, TabId]);
  };
  return (
    <div className="flex w-full flex-col py-4">
      <Link to={`/${path.HOME}`} className="flex-col justify-center flex items-center p-4 gap-2 w-full">
        <img src={logo} alt="logo" className="w-[200px] object-contain" />
        <span className="font-semibold text-[14px]">Admin Workspace</span>
      </Link>
      <div className="flex flex-col">
        {adminSidebar.map((el) => (
          <Fragment key={Element.id}>
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
            {el.type === "PARENT" && (
              <div>
                <div
                  onClick={() => handleShowTab(+el.id)}
                  className="flex items-center gap-2 hover:bg-main cursor-pointer justify-between"
                >
                  <div className="flex items-center "><span>{el.icon}</span>
                  <span>{el.text}</span></div>
                  {actived.some((id) => id === el.id) ? (
                    <AiFillCaretDown />
                  ) : (
                    <AiFillCaretLeft />
                  )}
                </div>
                {actived.some((id) => id === el.id) && (
                  <div>
                    {el.subMenu.map((item) => (
                      <div className="pl-6">
                        <NavLink
                          key={item.text}
                          to={item.path}
                          className={({ isActive }) =>
                            clsx(
                              isActive ? activedStyle : notActivedStyle,
                              "hover:bg-main"
                            )
                          }
                        >
                          {item.text}
                        </NavLink>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
