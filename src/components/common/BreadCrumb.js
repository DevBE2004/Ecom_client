import React, { memo } from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import icons from "utils/icons";
import { capitalizedStr } from "utils/helpers";

const { AiFillCaretRight } = icons;

const BreadCrumb = ({ title, category }) => {
  const routes = [
    { path: "/:category/:pid/:title", breadcrumb: title },
    { path: "/:category", breadcrumb: capitalizedStr(category) },
    { path: "/", breadcrumb: "HOME" },
  ];
  const breadcrumbs = useBreadcrumbs(routes);
  return (
    <div className="flex bg-gray-100 gap-1">
      {breadcrumbs
        ?.filter((el) => !el.match.route === false)
        .map(({ match, breadcrumb }, index, self) => (
          <Link key={match.pathname} to={match.pathname}>
            <span className="flex justify-center items-center text-xs hover:text-main gap-1">
              {breadcrumb}
              {index !== self.length - 1 && <AiFillCaretRight />}
            </span>
          </Link>
        ))}
    </div>
  );
};

export default memo(BreadCrumb);
