import React, { useState } from "react";
import { HiUserCircle  } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Checkemail = () => {
  const [data, setData] = useState({
    
    email: "",
    
  });
 
  const navigate = useNavigate()
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  
const handleSubmit = async (e)=> {
  e.preventDefault()
  e.stopPropagation()

  const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

  try {
    const response = await axios.post(URL, data)
    toast.success(response?.data?.message)

    if(response.data.success){
      setData(
        {
          email: "",
        }
      )
      navigate("/password",{
        state : response?.data?.data
      })


    }

  } catch (err) {
    toast.error(err?.response?.data?.message)
    
    
  }

}
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md mx-2 rounded overflow-hidden p-4 md:mx-auto">

        <div className="w-fit mx-auto mb-2">
          <HiUserCircle size={90}  />
        </div>
        <h3>Welcome to Chat App</h3>
        <form className="grid gap-3 mt-5 " onSubmit={handleSubmit}>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-lg mt-2 font-bold text-white leading-relaxed tracking-wide">Let's talk</button>
        </form>
        <p className="my-3 text-center">New User ? <Link to={"/register"} className="hover:text-primary font-semibold">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Checkemail