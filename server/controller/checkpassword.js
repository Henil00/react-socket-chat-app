const usermodel = require("../models/usermodel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkpassword(req,res){
    try {
        const { password,userId } = req.body

        const user = await usermodel.findById(userId)

        const verifypassword = await bcryptjs.compare(password,user.password)
        
        if(!verifypassword){
            return res.status(400).json({
                message : "Please Check Password",
                error : true
            })
        }
        const tokendata = {
            id : user._id,
            email : user.email
        }
        const token = await jwt.sign(tokendata,process.env.JWT_SECREAT_KEY,{ expiresIn : '30d' })
        
        const cookioption = {
            http : true,
            secure : true,
            sameSite: 'None'
        }

        return res.cookie('token',token,cookioption).status(200).json({
            message : "Login Successfully",
            token : token,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}
module.exports = checkpassword
