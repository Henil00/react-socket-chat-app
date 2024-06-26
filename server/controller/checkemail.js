const usermodel = require("../models/usermodel")

async function checkemail(req,res){
    try {
        const { email } = req.body
        const checkemail = await usermodel.findOne({email}).select("-password")
        if(!checkemail){
            return res.status(400).json({
                message : "User Not Exist",
                error : true
            })
        }
        return res.status(200).json({
            message : "Email Verify",
            success : true,
            data : checkemail
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkemail