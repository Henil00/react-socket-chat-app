const getuserdetailfromtoken = require("../helpers/getuserdetailfromtoken")
const usermodel = require("../models/usermodel")

async function updateuserdetails (req,res){
    try {
        const user = await getuserdetailfromtoken(req.body.token)
        const { name, profile_pic } = req.body
        const updateuser = await usermodel.updateOne({_id : user._id } , {name,profile_pic})

        const userinformation = await usermodel.findById(user._id)

        return res.status(200).json({
            message : "User Update Successfully",
            data : userinformation,
            success : true,
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = updateuserdetails