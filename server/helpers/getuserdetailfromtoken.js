const jwt = require('jsonwebtoken')
const usermodel = require('../models/usermodel')



const getuserdetailfromtoken = async (token) =>{
    
    if(!token){
        return {
            message : "Session Out",
            logout : true,
        }
    }

    const decode = await jwt.verify(token,process.env.JWT_SECREAT_KEY)
    const user = await usermodel.findById(decode.id).select("-password")
    return user 

}
module.exports = getuserdetailfromtoken