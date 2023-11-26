import React from "react";
import { Blogs } from "utils/contants";

const Blog = () => {
  return (
    <div className="flex py-6 px-4">
      <div className="flex flex-col w-3/4 gap-6">
        {Blogs.map((el) => (
          <div key={el.id}>
            <div className="flex">
              <img src={el.image} alt="blog" className="w-[378px] h-[252px]" />
              <span className="flex flex-col">
                <span className="hover:text-main cursor-pointer">{el.title}</span>
                <span className="py-4">
                  {el.byUser} - {el.createAt}
                </span>
                <span className="text-gray-400">{el.content}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[150px] ">
        <h3 className="bg-main p-2 text-white flex items-center justify-center">
          RECENT ARTICLES
        </h3>
        {Blogs.map((el) => (
          <div className="flex flex-col p-2 border">
            <span className="text-[10px] hover:text-main cursor-pointer">{el.title}</span>
            <span className="text-gray-400">{el.createAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
