const getuserdetailfromtoken = require("../helpers/getuserdetailfromtoken")

async function userdetail(req,res){
    try {
        const token = req.cookies.token || ""

        const user = await getuserdetailfromtoken(token)

        return res.status(200).json({
            message : "User Detail",
            data : user
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}
module.exports = userdetail