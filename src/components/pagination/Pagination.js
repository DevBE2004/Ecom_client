import React, { memo, useState } from "react";
import usePagination from "hooks/usePagination";
import { PagiItem } from "components";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalProductCount }) => {
  const [params] = useSearchParams();
  const page = params.get("page") || 1;
  const pageSize = process.env.REACT_APP_LIMIT || 10;
  const [currentPage, setCurrentPage] = useState(1);
  const pagination = usePagination(totalProductCount, currentPage);
  const showProductText = () => {
    const startProduct = (page - 1) * pageSize + 1;
    const endProduct = Math.min(pageSize * page, totalProductCount);
    return `Show Product: ${startProduct}-${endProduct} of ${totalProductCount}`;
  };

  return (
    <div className="flex w-full justify-between items-center">
      {params.get("page") &&
        +params.get("page") !== +Math.ceil(totalProductCount / pageSize) &&
        totalProductCount !== 0 && (
          <span className="text-sm italic">{showProductText()}</span>
        )}
      {params.get("page") &&
        +params.get("page") === +Math.ceil(totalProductCount / pageSize) && (
          <span className="text-sm italic">{showProductText()}</span>
        )}

      {totalProductCount === 0 && (
        <span className="text-[20px] font-bold italic ">
          Không có sản phẩm nào!
        </span>
      )}
      <div className="flex items-center">
        {pagination?.map((el) => (
          <button key={el} onClick={() => setCurrentPage(el)}>
            <PagiItem children={el} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(Pagination);
