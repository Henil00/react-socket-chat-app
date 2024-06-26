import React from 'react'
import { HiUserCircle  } from "react-icons/hi2";
import { useSelector } from 'react-redux';

const Avatar = ({userId,name,imageUrl,width,height}) => {

    

    let avatarName = ''

    if(name){
        const splitname = name?.split(" ")
        if(splitname.length > 1){
            avatarName = splitname[0][0] + splitname[1][0]
        }else{
            avatarName = splitname[0][0]
        }
    }

    const bgColor =[
        "bg-rose-300",
        "bg-green-300",
        "bg-blue-300",
        "bg-red-300",
        "bg-teal-300"
    ]
const randomnum = Math.floor(Math.random() * 5 ) 



  return (
    <div className={`text-slate-800 overflow-hidden  rounded-full font-bold relative`} style={{width : width+"px" , height : height+"px"}}>
        {
            imageUrl ? (
                <img 
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className="overflow-hidden rounded-full "
                />
            ) : (
                name ? (
                    <div className={`overflow-hidden rounded-full flex justify-center items-center text-3xl  ${bgColor[randomnum]}  `} style={{width : width+"px" , height : height+"px"}}>
                        {avatarName}
                    </div>
                ) : (
                    <HiUserCircle size={width}  />
                )
            )
        }
        
    </div>
  )
}

export default Avatar