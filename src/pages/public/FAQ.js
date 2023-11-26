import clsx from "clsx";
import React, { useState } from "react";
import { FAQS } from "utils/contants";

const FAQ = () => {
  const [activate, setActivate] = useState({});

  const toggleActivate = (id) => {
    setActivate((prevActivate) => ({
      ...prevActivate,
      [id]: !prevActivate[id]
    }));
  };

  return (
    <div>
      <h3>FAQS</h3>

      {FAQS.map((el) => (
        <div
          key={el.id}
          onClick={() => toggleActivate(el.id)}
          className="border p-4"
        >
          <span
            className={clsx(
              "flex items-center justify-between",
              activate[el.id] && "bg-main"
            )}
          >
            <span>{el.Q}</span>
            {activate[el.id] ? <span>-</span> : <span>+</span>}
          </span>
          {activate[el.id] && <span className="text-gray-500">{el.A}</span>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;