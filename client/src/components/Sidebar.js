import React, { useEffect, useState } from 'react'
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { PiUserCirclePlusBold } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router-dom';
import Avatar from './Avatar'
import {useDispatch, useSelector} from 'react-redux'
import EdituserDetail from './EdituserDetail';
import Divider from './Divider';
import { BsArrow90DegLeft } from "react-icons/bs";
import SearchUser from './SearchUser';
import { IoImages } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { logout } from '../redux/userSlice';

const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [userEditOpen,setUserEditOpen] = useState(false)
    const [Alluser,setAlluser] = useState([])
    const [openSearchUser,setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=> {
        if(socketConnection){
            socketConnection.emit('sidebar',user._id)
            socketConnection.on('conversation',(data)=>{
                console.log('conversation',data);
                const conversationUserData = data.map((conversationuser,index)=>{
                    if(conversationuser?.sender?._id === conversationuser?.receiver?._id){
                        return {
                            ...conversationuser,
                            userDetail : conversationuser?.sender
                        }
                    }
                    else if(conversationuser?.receiver?._id !== user?._id){
                        return {
                            ...conversationuser,
                            userDetail : conversationuser.receiver
                        }
                    }
                    else {
                        return {
                            ...conversationuser,
                            userDetail : conversationuser.sender
                        }
                    }
                    
                })
                setAlluser(conversationUserData)
            })
        }
    },[socketConnection,user])
    const handlelogout = ()=> {
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
    }

    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr]'>
            <div className="bg-slate-200 w-12 h-full rounded-r-lg py-5 text-slate-700 flex flex-col justify-between">
                <div className="">
                    <NavLink className={({ isActive }) => ` w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-300 ${isActive && "bg-slate-300"} `} title='chat'>

                        <BsFillChatLeftTextFill size={28} />

                    </NavLink>
                    <div className={`w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-300 `} onClick={()=>setOpenSearchUser(true)} title='Add Friend'>
                        <PiUserCirclePlusBold size={28} />
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <button className='mx-auto' title={user.name} onClick={()=>setUserEditOpen(true)}>
                        <Avatar width={40} height={40} name={user.name} imageUrl={user?.profile_pic} userId={user?._id} />
                    </button>
                    <button  title='Logout' onClick={handlelogout} className={`w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-300 `}>
                        <span>

                        <CiLogout size={28} />
                        </span>
                    </button>
                    
                </div>
            </div>
            <div className="w-full ">
                <div className="h-16 flex items-center">

                <h2 className='text-xl font-bold p-2 text-slate-800'>Message</h2>
                </div>
                <div className="bg-slate-200 p-[0.5px]"></div>
                <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
                    {
                        Alluser.length === 0 && (
                            <div className="mt-3">
                                <div className="flex justify-center items-center my-4 text-slate-500">
                                    <BsArrow90DegLeft size={50}/>
                                </div>
                                <p className='text-lg text-center text-slate-400'>Make Friend To Start Conversition.</p>
                            </div>
                        )
                    }

                    {
                        Alluser.map((conv,index)=> {
                            return(
                                <NavLink to={"/"+conv?.userDetail?._id} key={conv?._id} className="flex items-center gap-2 py-3 px-2 border-slate-200 border-b-2 border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer">
                                    <div className="">
                                        
                                            <Avatar imageUrl={conv?.userDetail?.profile_pic} 
                                            name={conv?.userDetail?.name}
                                            width={40}
                                            height={40}
                                            />
                                        
                                    </div>
                                    <div className="">
                                        <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv.userDetail.name}</h3>
                                        <div className="text-slate-500 text-xs flex items-center gap-1">
                                           <div className="flex items-center gap-1">
                                            {
                                                conv.lastMsg.imageUrl && (
                                                    <div className="flex items-center gap-1">
                                                        <span><IoImages /></span>
                                                        { !conv?.lastMsg?.text && <span>Image</span> } 
                                                    </div>
                                                )
                                            }
                                            {
                                                conv.lastMsg.videoUrl && (
                                                    <div className="flex items-center gap-1">
                                                        <span><FaVideo /></span>
                                                        { !conv?.lastMsg?.text && <span>Video</span> }
                                                    </div>
                                                )
                                            }
                                           </div>
                                            <p className='text-ellipsis line-clamp-1 '>{conv?.lastMsg?.text}</p>
                                        </div>  
                                    </div>
                                    {
                                        Boolean(conv?.unseenMsg) && (
                                            <p className='text-xs flex justify-center items-center h-6 w-6 ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                        )
                                    }
                                        
                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>
                {/* edituser detail  */}
                {
                    userEditOpen && (
                        <EdituserDetail onClose = {()=> setUserEditOpen(false)} user = {user} />
                    )
                }

                {/* search user */}
                {
                    openSearchUser && (
                        <SearchUser onClose = {()=> setOpenSearchUser(false)} />
                    )
                }

        </div>
    )
}

export default Sidebar