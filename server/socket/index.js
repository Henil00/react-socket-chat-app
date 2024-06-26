const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const getuserdetailfromtoken = require('../helpers/getuserdetailfromtoken')
const usermodel = require('../models/usermodel')
const { conversationmodel , messagemodel } = require('../models/conversationmodel')
const { log } = require('console')
const getConversation = require('../helpers/getConversation')
const app = express()



// socket connection

const server = http.createServer(app)
const io = new Server(server,{
    cors : {
        origin : process.env.FRONTEND_URL,
        credentials : true
    }
})

// socket running on 
// http://localhost:8080/


//online user

const onlineUser = new Set()

io.on("connection",async(socket)=>{
    console.log("Connected User",socket.id)

    const token = socket.handshake.auth.token

    // current user detail

    const user = await getuserdetailfromtoken(token)
    
    //create room 
    socket.join(user?._id?.toString())
    onlineUser.add(user?._id?.toString())

    io.emit('onlineUser',Array.from(onlineUser))

    socket.on('message-page',async (userId)=>{
        console.log("userId",userId);
        const userDetail = await usermodel.findById(userId).select("-password")

        const payload = {
            _id : userDetail?._id,
            name : userDetail?.name,
            email : userDetail?.email,
            profile_pic : userDetail?.profile_pic,
            online : onlineUser.has(userId)
        }
        socket.emit("message-user",payload)
        //get previous msg
        const getconversationmessage = await conversationmodel.findOne({
            "$or" : [
                { sender : user?._id, receiver : userId },
                { sender : userId, receiver : user?._id}
            ]
          }).populate('messages').sort({updatedAt : -1})
         
            socket.emit('message',getconversationmessage?.messages || [])
    })


    //new message

    socket.on('new message', async (data) => {
        //checking message avaliable both side or not 
    let conversation = await conversationmodel.findOne({
        "$or" : [
            { sender : data?.sender, receiver : data?.receiver },
            { sender : data?.receiver, receiver :  data?.sender}
        ]
    })
        //if conversation is not avaliable
        if(!conversation){
            const createconversation = await conversationmodel({
                sender : data?.sender , 
                receiver : data?.receiver
            })
            conversation = await createconversation.save()
        }

        const message = await messagemodel({
            
          text : data.text,
          imageUrl : data.imageUrl,
          videoUrl : data.videoUrl,
          msgByUserid : data?.msgByUserid
          
        })

        const savemessage = await message.save()
        const updateconversation = await conversationmodel.updateOne({_id : conversation?._id},{
            "$push" : { messages : savemessage?._id }
        })
      const getconversationmessage = await conversationmodel.findOne({
        "$or" : [
            { sender : data?.sender, receiver : data?.receiver },
            { sender : data?.receiver, receiver :  data?.sender}
        ]
      }).populate('messages').sort({updatedAt : -1})
      io.to(data?.sender).emit('message',getconversationmessage?.messages || [])
      io.to(data?.receiver).emit('message',getconversationmessage?.messages || [])
      
      //send conversation

      const conversationSender = await getConversation(data?.sender)
      const conversationreceiver = await getConversation(data?.receiver)

      io.to(data?.sender).emit('conversation',conversationSender)
      io.to(data?.receiver).emit('conversation',conversationreceiver)
      
    })
    //sidebar

    socket.on('sidebar', async(currentUserId) => {
        console.log('current user',currentUserId);
        
        const conversation = await getConversation(currentUserId)
        socket.emit('conversation',conversation)
        
    })
    socket.on('seen',async(msgByUserid)=>{
        let conversation = await conversationmodel.findOne({
            "$or" : [
                { sender : user?._id, receiver : msgByUserid },
                { sender : msgByUserid, receiver :  user?._id}
            ]
        })
        const conversationMessageId = conversation?.messages || []

        const updateMessage = await messagemodel.updateMany(
            {_id : {"$in" : conversationMessageId}, msgByUserid : msgByUserid},
            {"$set" : { seen : true }}
        )

        //send conversation

      const conversationSender = await getConversation(user?._id?.toString())
      const conversationreceiver = await getConversation(msgByUserid)

      io.to(user?._id?.toString()).emit('conversation',conversationSender)
      io.to(msgByUserid).emit('conversation',conversationreceiver)
    })

    //disconnect 
    socket.on("disconnect",()=>{
        onlineUser.delete(user?._id?.toString())
        console.log("Disconnected User",socket.id);
    })
})

module.exports = {
    app,
    server
}