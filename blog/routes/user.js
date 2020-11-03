var express = require('express');
var router = express.Router();

const { ResSuccess,ResError } = require("../model/model.js")
const { login } = require("../controller/user.js")

router.post('/login', function(req, res, next) {
    let { username,password } = req.body
    login(username, password).then(result=>{
        if(result.username){
            req.session.username = result.username
            req.session.realname = result.realname
            res.json(new ResSuccess())
        }else{
            res.json(new ResError("登录失败"))
        }
    })
});

module.exports = router;
