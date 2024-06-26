import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Usercard = ({user,onClose}) => {
  const onlineUser = useSelector(state => state?.user?.onlineUser)
  const isOnline = onlineUser.includes(user?._id)

  return (
    <Link to={"/"+user?._id} onClick={onClose} className='flex items-center gap-3 p-2 lg:p-3 border border-transparent border-b-slate-300 hover:border hover:border-primary rounded cursor-pointer'>
      <div className="">
        <Avatar 
          width={50}
          height={50}
          name={user?.name}
          imageUrl={user?.profile_pic}
          userId={user?._id}
        />
      </div>
      <div className="">
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
      {
        isOnline ? (
          <span class="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span class="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                Online
            </span>
        ) : (
          <span class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                <span class="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
                Offline
            </span>
        )
      }
      
    </Link>
  )
}

export default Usercard