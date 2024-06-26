async function logout(req,res){
    try {
        const cookioption = {
            http : true,
            secure : true
        }
        return res.cookie('token','',cookioption).status(200).json({
            message : "Session Out",
            seccess : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true 
        })
    }
}
module.exports = logout