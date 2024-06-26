import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { TiAttachmentOutline } from "react-icons/ti";
import { IoImages } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import uploadFile from '../helper/uploadFile';
import { MdOutlineClose } from "react-icons/md";
import Loading from './Loading';
import background from '../assets/chat-app-background.jpg'
import { AiOutlineSend } from "react-icons/ai";
import moment from 'moment'


const MessagePage = () => {
  const parems = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [dataUser,setDataUser] = useState({
    name : '',
    email : '',
    profile_pic : '',
    online : false,
    _id : ''
    
  })

  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false)
  const [message,setMessage] = useState({
    text : '',
    imageUrl : '',
    videoUrl : ''
  })
  const [loading,setLoading] = useState(false)
  const [allMessage,setAllMessage] = useState([])
  const currentMessage = useRef(null)

  useEffect(()=> {
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior : 'smooth',block : 'end'})
    }
  },[allMessage])

  const handleimagevideoupload = ()=>{
    setOpenImageVideoUpload ( preve => !preve)
  }
  const handleImage =async (e) => {
    const file = e.target.files[0];
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(preve =>{
      return {
        ...preve,
        imageUrl : uploadPhoto.url
      }
    })
  
  }
const handleclearuploadimage = () =>{
  setMessage(preve =>{
    return {
      ...preve,
      imageUrl : ''
    }
  })
}


  const handleVideo = async(e) => {
    const file = e.target.files[0];
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(preve =>{
      return {
        ...preve,
        videoUrl : uploadPhoto.url
      }
    })
  }
  const handleclearuploadvideo = () =>{
    setMessage(preve =>{
      return {
        ...preve,
        videoUrl : ''
      }
    })
  }


  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit("message-page",parems.userId)

      socketConnection.emit('seen',parems.userId)

      socketConnection.on("message-user",(data)=>{
        setDataUser(data)
      })
      socketConnection.on('message',(data) => {
        console.log('message',data);
        setAllMessage(data)
      })
    }

  },[socketConnection,parems?.userId,user])

  const handleonchange = (e) => {
    const { name, value } = e.target

    setMessage(preve => {
      return{
        ...preve,
        text : value
      }
    })
  }

  const handlesendmessage = (e) => {
    e.preventDefault()

    if(message.text || message.imageUrl || message.videoUrl) {
      if(socketConnection){
        socketConnection.emit('new message',{
          sender : user?._id,
          receiver : parems.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserid : user._id
        })
        setMessage({
          text : '',
          imageUrl : '',
          videoUrl : ''
        })
      }
    }
  }
  return (
    <div style={{ background : `url(${background})` }} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4' >
        <div className="flex items-center gap-4">
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25}/>
          </Link>
          <div className="">
            <Avatar
            width={50}
            height={50}
            imageUrl={dataUser?.profile_pic}
            name={dataUser?.name}
            userId={dataUser?._id}
             />
          </div>
          <div className="">
            <h3 className='font-semibold text-xl my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='text-xs -mt-1'>
              {
                dataUser?.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>
        <div className="">
              <button className='cursor-pointer hover:text-primary'>
              < BsThreeDotsVertical/>
              </button>
        </div>
      </header>
      {/* show all message */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
        

        {/* all msg here  */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {
            allMessage.map((msg,index)=>{
              return(
                <div  className={` p-1 py-1  rounded-lg w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserid ? "ml-auto bg-teal-100" : "bg-white"}`}>
                 <div className="w-full">{
                    msg?.imageUrl &&  (
                     <img src={msg?.imageUrl}  className='w-full h-full object-scale-down' alt=''/>
                    )
                  }
                  {
                    msg?.videoUrl &&  (
                     <video src={msg?.videoUrl}  className='w-full h-full object-scale-down' controls alt=''/>
                    )
                  }</div>
                  
                  <p className='px-2'>
                    {msg.text}
                  </p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                </div>

              )
            })
          }
        </div>

        {/* upload image display */}
        {
          message.imageUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-500 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div className="w-fit p-2 absolute top-0 right-0 rounded hover:text-primary cursor-pointer " onClick={handleclearuploadimage} >
                <MdOutlineClose size={30} />
              </div>
          <div className="bg-white rounded-2xl p-3">
            <img src={message.imageUrl} alt="UploadImages" className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'/>
          </div>
          </div>
          )
        }

        {/* upload video display */}
         
         {
          message.videoUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-500 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div className="w-fit p-2 absolute top-0 right-0 hover:text-primary cursor-pointer " onClick={handleclearuploadvideo} >
                <MdOutlineClose size={30} />
              </div>
          <div className="bg-white rounded-2xl p-3">
            <video src={message.videoUrl}  className='aspect-video w-full h-full max-w-sm m-2 object-scale-down' controls muted autoPlay/>
          </div>
          </div>
          )
        }
        {
          loading && (
           <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
             <Loading />
           </div>
          )
        }
      </section>

              {/* send message */}
      <section className='h-16 bg-white flex items-center px-4'>
        <div  className='relative '>
         <button onClick={handleimagevideoupload} className='flex justify-center items-center h-11 w-11 rounded-md hover:bg-primary hover:text-white'>
          <TiAttachmentOutline size={20}/>
         </button>
         {/* video and images  */}
         {
          openImageVideoUpload && (
            <div className="bg-white shadow rounded-2xl absolute bottom-12 w-36 p-2">
            <form>
              <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                <div className="text-primary">
                    <IoImages size={20}/>
                </div>
                <p>Image</p>
              </label>
              <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                <div className="text-violet-700">
                    <FaVideo size={20}/>
                </div>
                <p>Video</p>
              </label>
              <input type="file" id="uploadImage" className='hidden' onChange={handleImage}/>
              <input type="file" id="uploadVideo" className='hidden' onChange={handleVideo}/>
            </form>
       </div>
          )
         }
         
         </div>

         {/* input box */}
         <form className="h-full w-full flex gap-2" onSubmit={handlesendmessage}>
          
              <input type="text" placeholder='type a message....' className='py-1 px-4 outline-none w-full h-full' value={message.text} onChange={handleonchange}/>
      
              <button className=' hover:text-secondary text-primary'>
                <AiOutlineSend size={20}/>
              </button>
         </form>
         
      </section>
    </div>
  )
}

export default MessagePage