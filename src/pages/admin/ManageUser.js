import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteUsers, apiGetUsers, apiUpdatedUsers } from "apis/user";
import { roles, block } from "utils/contants";
import moment from "moment";
import { InputField, InputForm, Pagination, Select, Button } from "components";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ManageUser = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    isBlocked: "",
    phone: "",
  });
  const [editElm, setEditElm] = useState(null);
  const [users, setUsers] = useState(null);
  const [params] = useSearchParams();
  const [updated, setUpdated] = useState(false);
  const [queries, setQueries] = useState({ q: "" });
  const fetchUsers = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });

    if (response?.success) setUsers(response);
  };

  const queriesDebounce = useDebounce(queries?.q, 800);
  const render = useCallback(() => {
    setUpdated(!updated);
  }, [updated]);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchUsers(queries);
  }, [queriesDebounce, params, updated]);
  const handleUpdate = async (data) => {
    const response = await apiUpdatedUsers(data, editElm?._id);
    if (response.success) {
      setEditElm(null);
      render();
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };
  const handleDelete = (uid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Bạn có muốn xóa không ?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUsers(uid);
        if (response.success) {
          toast.success(response.message);
        }
      }
    });
  };
  
  useEffect(() => {
    if (editElm)
      reset({
        role: editElm.role,
        isBlocked: editElm.isBlocked,
      });
  }, [editElm]);
  return (
    <div className="w-full bg-gray-200">
      <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold">
        <span className=" w-full text-center  text-[#c62828]">ManageUser</span>
      </h1>

      <div className="w-full p-4">
        <div className="flex justify-end py-4">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            placeholder={"Tìm theo tên hoặc theo email"}
            isHideLabel
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <table className="table-auto mb-6 text-left w-full mt-4">
            <thead className="font-bold bg-gray-800 text-[13px] text-center text-white">
              <tr>
                <th className="px-4 py-2 border-black border">#</th>
                <th className="px-4 py-2 border-black border">Email Address</th>
                <th className="px-4 py-2 border-black border">First name</th>
                <th className="px-4 py-2 border-black border">Last name</th>
                <th className="px-4 py-2 border-black border">Phone</th>
                <th className="px-4 py-2 border-black border">Role</th>
                <th className="px-4 py-2 border-black border">Status</th>
                <th className="px-4 py-2 border-black border">Create At</th>
                <th className="px-4 py-2 border-black border">Actions</th>
              </tr>
            </thead>
            <tbody className="boder">
              {users?.userDatas?.map((el, idx) => (
                <tr key={el._id}>
                  <td className="border-black border text-center">{idx + 1}</td>
                  <td className="border-black border text-center">
                    {editElm?._id === el?._id ? (
                      <InputForm
                        register={register}
                        defaultValue={editElm?.email}
                        fw
                        errors={errors}
                        id={"email"}
                        validate={{
                          required: true,
                          pattern: {
                            value:
                              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "invalid email address",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="border-black border text-center">
                    {editElm?._id === el?._id ? (
                      <InputForm
                        register={register}
                        defaultValue={editElm?.firstname}
                        fw
                        errors={errors}
                        id={"firstname"}
                        validate={{ required: "Require fields" }}
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className="border-black border text-center">
                    {editElm?._id === el?._id ? (
                      <InputForm
                        register={register}
                        defaultValue={editElm?.lastname}
                        fw
                        errors={errors}
                        id={"lastname"}
                        validate={{ required: "Require fields" }}
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className="border-black border text-center">
                    {editElm?._id === el?._id ? (
                      <InputForm
                        register={register}
                        defaultValue={editElm?.mobile}
                        fw
                        errors={errors}
                        id={"mobile"}
                        validate={{
                          required: "Require fields",
                          pattern: {
                            value: /^(0(?:\d\W*){0,9})$/,
                            message: "invalid phone",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className="border-black border text-center">
                    {editElm?._id === el?._id ? (
                      <Select
                        register={register}
                        defaultValue={+el.role}
                        fw
                        options={roles}
                        errors={errors}
                        id={"role"}
                        validate={{
                          required: "Require fields",
                        }}
                      />
                    ) : (
                      <span>
                        {roles.find((role) => +role.code === +el.role)?.value}
                      </span>
                    )}
                  </td>
                  <td className="border-black border text-center">
                    {editElm?._id === el?._id ? (
                      <Select
                        register={register}
                        defaultValue={el.isBlocked ? "Blocked" : "Active"}
                        fw
                        errors={errors}
                        id={"isBlocked"}
                        options={block}
                      />
                    ) : (
                      <span>{el.isBlocked ? "Blocked" : "Active"}</span>
                    )}
                  </td>
                  <td className="border-black border text-center">
                    {moment(el.createdAt)?.format("DD/MM/YYYY")}
                  </td>
                  <td className="border-black border text-center">
                    {editElm?._id === el._id ? (
                      <span
                        onClick={() => setEditElm(null)}
                        className="hover:underline cursor-pointer px-2 text-blue-600"
                      >
                        back
                      </span>
                    ) : (
                      <span
                        onClick={() => setEditElm(el)}
                        className="hover:underline cursor-pointer px-2 text-blue-600"
                      >
                        Sửa
                      </span>
                    )}
                    <span
                      onClick={() => handleDelete(el._id)}
                      className="hover:underline cursor-pointer px-2 text-blue-600"
                    >
                      Xóa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editElm && <Button type="submit" children={"Update"} />}
        </form>

        <div className="w-full flex items-center">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
