const usermodel = require("../models/usermodel")
const bcryptjs = require('bcryptjs')

async function registeruser (req,res){
    try {
        const { name, email, password, profile_pic } = req.body

        const checkemail = await usermodel.findOne({email})

        if(checkemail){
            return res.status(400).json({
                message : "Already User Exist",
                error : true,
            })
        }

        //password into hash
        const salt = await bcryptjs.genSalt(10)
        const hashpass = await bcryptjs.hash(password,salt)

        const payload ={
            name,
            email,
            profile_pic,
            password : hashpass,

        }

        const user = new usermodel(payload)
        const usersave = await user.save()

        return res.status(201).json({
            message : "User Created Successfully",
            data : usersave,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}
module.exports = registeruser