import { Button, InputForm, Markdown, Select, Loading } from "components";
import React, { memo, useState, useEffect, useCallback } from "react";
import { set, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import { apiUpdate } from "apis/product";

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm();
  const [invalidFields, setInvalidFields] = useState([]);
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const [payload, setPayload] = useState({
    description: "",
  });
  const { categories } = useSelector((state) => state.app);

  const handlePreviewThumb = async (file) => {
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpg") {
        const thumbBase64 = await getBase64(file);
        setPreview((prev) => ({ ...prev, thumb: thumbBase64 }));
      }
    } else {
      setPreview((prev) => ({ ...prev, thumb: null }));
    }
  };

  const handlePreviewImage = async (files) => {
    if (files) {
      const imagesPreview = [];
      for (let file of files) {
        if (file.type !== "image/png" && file.type !== "image/jpg") {
          toast.warning("file not supported");
          return;
        }
        const base64 = await getBase64(file);
        imagesPreview.push(base64);
      }
      setPreview((prev) => ({ ...prev, images: imagesPreview }));
    }
  };

  const changeValue = useCallback((e) => {
    setPayload(e);
  }, []);

  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      const finallPayload = { ...data, ...payload, preview };
      if (finallPayload.category) finallPayload.category = data.category;
      const formData = new FormData();
      for (let i of Object.entries(finallPayload)) formData.append(i[0], i[1]);
      if (finallPayload?.thumb && finallPayload?.thumb?.length > 0)
        formData.append("thumb", finallPayload.thumb[0]);
      if (finallPayload?.images) {
        const images =
          finallPayload?.thumb?.length === 0
            ? preview.images
            : Array.from(finallPayload.images);
        for (let image of images) formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdate(formData, editProduct._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        toast.success(response.message);
        render();
        setEditProduct(null);
      } else toast.error(response.message);
    }
  };

  useEffect(() => {
    reset({
      title: editProduct?.title || "",
      price: editProduct?.price || "",
      quantity: editProduct?.quantity || "",
      color: editProduct?.color || "",
      category: editProduct?.category || "",
      brand: editProduct?.brand || "",
    });
    setPayload({
      description:
        typeof editProduct?.description === "object"
          ? editProduct?.description?.join(",")
          : editProduct?.description,
    });
    setPreview({
      thumb: editProduct?.thumb || "",
      images: editProduct?.images || [],
    });
  }, [editProduct]);

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
      handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0)
      handlePreviewImage(watch("images"));
  }, [watch("images")]);
  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <div className="p-4 -b flex w-full flex-col items-center justify-center text-main">
        <h1 className="text-3xl font-bold tracking-tight ">Update Product</h1>
      </div>
      <div className="p-4 flex w-full">
        <form className="w-full" onSubmit={handleSubmit(handleUpdateProduct)}>
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
                code: el.title,
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
                ?.find((el) => el.title === watch("category"))
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
            value={payload.description}
          />
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="thumb">
              Upload thumb
            </label>
            <input type="file" id="thumb" {...register("thumb")} />
            {errors["thumb"] && (
              <small className="text-xs text-main">
                {errors["thumb"]?.message}
              </small>
            )}
          </div>
          {preview?.thumb && (
            <div className="my-4">
              <img
                src={preview?.thumb}
                alt="thumbnail"
                className="w-[100px] object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="products">
              Upload image of products
            </label>
            <input type="file" id="products" multiple {...register("images")} />
            {errors["images"] && (
              <small className="text-xs text-main">
                {errors["images"]?.message}
              </small>
            )}
          </div>

          {preview?.images.length > 0 && (
            <div className="my-4 flex w-full gap-2">
              {preview?.images?.map((el, idx) => (
                <div key={idx} className="w-fit relative">
                  <img
                    src={el}
                    alt="images"
                    className="w-[100px] object-contain"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <span
              onClick={() => setEditProduct(null)}
              className="text-white bg-main rounded-md cursor-pointer h-10 w-[60px] flex items-center justify-center "
            >
              Cancel
            </span>
            <Button type={"submit"} children={"Updated"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);
