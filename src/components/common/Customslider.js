import React, { memo } from "react";
import Slider from "react-slick";
import { Product } from "components";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const Customslider = ({ product, activedTab, normal }) => {
  return (
    <>
      {product && (
        <Slider className="custom-slider" {...settings}>
          {product?.map((el, index) => (
            <Product
              key={index}
              pid={el._id}
              productData={el}
              isNew={activedTab === 1 ? false : true}
              normal={normal}
            />
          ))}
        </Slider>
      )}
    </>
  );
};

export default memo(Customslider);
