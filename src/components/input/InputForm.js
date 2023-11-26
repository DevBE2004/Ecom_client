import clsx from "clsx";
import React, { memo, useEffect, useState } from "react";

const InputForm = ({
  label,
  disabled,
  register,
  errors,
  id,
  validate,
  type = "text",
  placeholder,
  fw,
  defaultValue,
  style,
  readOnly,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className={clsx("flex flex-col h-[42px] gap-2 mt-10", style)}>
      {label && (
        <label className="font-semibold" htmlFor={id}>
          {label+ ":"}
        </label>
      )}
      <input
        min="1"
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disabled}
        placeholder={placeholder}
        value={inputValue}
        readOnly={readOnly}
        onChangeCapture={handleInputChange}
        className={clsx("form-input", fw && "w-full", style)}
      />
      {errors[id] && (
        <small className="text-xs text-main">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(InputForm);
