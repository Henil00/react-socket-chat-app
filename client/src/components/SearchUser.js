import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import Loading from './Loading';
import Usercard from './Usercard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { MdOutlineClose } from "react-icons/md";


const SearchUser = ({onClose}) => {
  const [searchUser,setSearchUser] = useState([])
  const [loading,setLoading] = useState(false)
  const [search,setSearch] = useState("")

  const handelSearchUser = async()=>{
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`

    try {
      setLoading(true)
      const response = await axios.post(URL,{
        search : search
      })
      setLoading(false)
      setSearchUser(response.data.data)
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }
  useEffect(()=>{
    handelSearchUser()
  },[search])


  console.log("Search user",searchUser);

  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
        <div className="w-full max-w-lg mx-auto mt-10">
            {/* search user input */}
            <div className="bg-white h-12 rounded-2xl overflow-hidden flex">
                <input type="text" placeholder='Search User By Name,Email.....' className='w-full outline-none py-1 h-full px-4' onChange={(e)=>setSearch(e.target.value)} value={search} />
                <div className="h-12 w-12 flex justify-center items-center">
                  <IoSearchOutline size={25}/>
                </div>
            </div>
            {/* search user display  */}
            <div className="bg-white mt-2 w-full p-4 rounded ">
              {/* no user found */}
              {
                searchUser.length === 0 && !loading && (
                  <p className='text-center text-slate-500'>no user found!</p>
                )
              }
              {
                loading && (
                  <p><Loading /></p>
                )
              }
              {
                searchUser.length !== 0 && !loading && (
                  searchUser.map((user,index)=>{
                    return (
                      <Usercard key={user._id} user={user} onClose={onClose} />
                    )
                  })
                ) 
              }

            </div>
        </div>
        <div className="absolute top-0 right-0 text-2xl lg:text-4xl hover:text-primary cursor-pointer" onClick={onClose}>
          <MdOutlineClose />
        </div>
    </div>
  )
}

export default SearchUser