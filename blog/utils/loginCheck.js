const { ResError } = require("../model/model.js")

const loginCheck = (req, res, next)=>{
    if(req.session.username){ // 已登录
        next()
    }else{
        res.json(new ResError("未登录"))
    }
}

module.exports = {
    loginCheck
}