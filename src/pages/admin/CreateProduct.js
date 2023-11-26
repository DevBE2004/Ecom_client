import React, { useEffect, useState } from "react";
import { Button, InputForm, Markdown, Select, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { apiCreateProduct } from "apis/product";
import { showModal } from "store/app/appSlice";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const { register, formState: {errors}, handleSubmit, reset, watch } = useForm();
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const [payload, setPayload] = useState({
    description: "",
  });
  const [hoverElm, setHoverElm] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const { categories } = useSelector((state) => state.app);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );
  const handlePreviewThumb = async (file) => {
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpg") {
        const thumbBase64 = await getBase64(file);
        setPreview((prev) => ({ ...prev, thumb: thumbBase64 }));
      }
    }
  };
  const handlePreviewImage = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpg") {
        toast.warning("file not supported");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };
  useEffect(() => {
    if (watch("thumb")) handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);
  useEffect(() => {
    handlePreviewImage(watch("images"));
  }, [watch("images")]);

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    const finallPayload = { ...data, ...payload };
    if (invalids === 0) {
      if (data.category) {
        finallPayload.category = categories?.find(
          (el) => el._id === data.category
        )?.title;
      }
      const formData = new FormData();
      for (let i of Object.entries(finallPayload)) formData.append(i[0], i[1]);

      if (finallPayload.thumb) formData.append("thumb", finallPayload.thumb[0]);
      if (finallPayload.images) {
        for (let image of finallPayload.images)
          formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiCreateProduct(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      // Swal.fire("Thành công!", "Tạo sản phẩm thành công", "success");
      if (response.success) {
        toast.success(response.message);
        reset();
        setPayload({
          thumb: "",
          images: [],
        });
      } else toast.error(response.message);
    }
  };
  return (
    <div className="w-full bg-gray-200">
      <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold">
        <span className=" w-full text-center  text-[#c62828]">
          Create Product
        </span>
      </h1>
      <div className="p-4 flex w-full">
        <form className="w-full" onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label="Name product"
            register={register}
            errors={errors}
            id="title"
            style="flex-1"
            fw
            validate={{ required: "Need fill this field" }}
            placeholder="Name of new product"
          />
          <div className="w-full flex gap-4 mt-10">
            <InputForm
              label="Price"
              register={register}
              errors={errors}
              id="price"
              style="w-full"
              validate={{ required: "Need fill this field" }}
              placeholder="Price of new product"
              type="number"
            />
            <InputForm
              label="Quantity"
              register={register}
              errors={errors}
              id="quantity"
              style="w-full"
              validate={{ required: "Need fill this field" }}
              placeholder="Quantity of new product"
              type="number"
            />
            <InputForm
              label="Color"
              register={register}
              errors={errors}
              id="color"
              style="w-full"
              validate={{ required: "Need fill this field" }}
              placeholder="Color of new product"
            />
          </div>
          <div className="flex mt-10 w-full gap-4">
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
              register={register}
              id="category"
              style="w-full"
              errors={errors}
              validate={{ required: "Need fill this field" }}
            />
            <Select
              label="Brand"
              options={categories
                ?.find((el) => el._id === watch("category"))
                ?.brand?.map((el) => ({ code: el, value: el }))}
              register={register}
              errors={errors}
              id="brand"
              style="w-full"
              validate={{ required: "Need fill this field" }}
            />
          </div>
          <Markdown
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="thumb">
              Upload thumb
            </label>
            <input
              type="file"
              id="thumb"
              {...register("thumb", { required: "Need fill" })}
            />
            {errors["thumb"] && (
              <small className="text-xs text-main">
                {errors["thumb"]?.message}
              </small>
            )}
          </div>
          {preview.thumb && (
            <div className="my-4">
              <img
                src={preview.thumb}
                alt="thumbnail"
                className="w-[200px] object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="products">
              Upload image of products
            </label>
            <input
              type="file"
              id="products"
              multiple
              {...register("images", { required: "Need fill" })}
            />
            {errors["images"] && (
              <small className="text-xs text-main">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preview.images.length > 0 && (
            <div className="my-4 flex w-full gap-2">
              {preview.images.map((el, idx) => (
                <div key={idx} className="w-fit relative">
                  <img
                    src={el.path}
                    alt="images"
                    className="w-[200px] object-contain"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center">
            <Button type={"submit"} children={"Create new product"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
