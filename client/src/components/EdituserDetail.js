import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helper/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EdituserDetail = ({ onClose, user }) => {
  const [userData, setUserData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });
  const uploadphotoref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData((preve) => {
      return {
        ...preve,
        user,
      };
    });
  }, [user]);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadphotoref.current.click();
  };
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);

    setUserData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
      const response = await axios.post(URL, {"token": userData.user.token, "profile_pic": userData.profile_pic, "name": userData.name})
      console.log('response',response);
      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("Error",error);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Detail</h2>
        <p className="text-sm">Edit User Detail</p>
        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-primary border-0.5 "
            />
          </div>
          <div className="">
            <div className="">Photo : </div>
            <div className="my-1  flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={userData?.profile_pic}
                name={userData?.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="font-semibold"
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadphotoref}
                />
              </label>
            </div>
          </div>
          <Divider />
          <div className="flex gap-2 w-fit ml-auto ">
            <button
              onClick={onClose}
              className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="border-primary bg-primary border px-4 py-1 rounded text-white hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdituserDetail;
