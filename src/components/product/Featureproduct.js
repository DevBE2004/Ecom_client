import React, { useState, useEffect, memo } from "react";
import { ProductCart } from "components";
import { apiGetProducts } from "apis/product";
import { Link } from "react-router-dom";

const Featureproduct = () => {
  const [product, setProduct] = useState(null);
  const fetchProduct = async () => {
    const response = await apiGetProducts({ limit: 9, sort: "-totalRatings" });
    if (response?.success) setProduct(response.productDatas);
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="w-full">
      <h3 className="font-bold uppercase text-20 py-15 border-b-2 border-main">
        Feature product
      </h3>
      <div className="flex flex-wrap px-[-10px] mt-4">
        {product?.map((el) => (
          <Link
            key={el._id}
            className="w-1/3 flex"
            to={`/${el.category}/${el._id}/${el.title}`}
          >
            <ProductCart
              img={el.thumb}
              title={el.title}
              totalRatings={el.totalRatings}
              price={el.price}
            />
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-4">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-2 row-span-2"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-2"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        />
      </div>
    </div>
  );
};

export default memo(Featureproduct);
