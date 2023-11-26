import React, { memo } from "react";
import { navigation } from "utils/contants";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="w-main h-[48px] py-2 border-y text-sm flex items-center p-2">
      {navigation.map((el, index, self) => (
        <div
          key={el.id}
          className={index !== self.length - 5 && "border-l-2 pl-4"}
        >
          <NavLink
            to={el.path}
            className={({ isActive }) =>
              isActive
                ? "pr-12 hover:text-main text-main"
                : "pr-12 hover:text-main"
            }
          >
            {el.value}
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default memo(Navigation);
