var express = require('express');
var router = express.Router();

const { ResSuccess,ResError } = require("../model/model.js")
const { getList,getDetail,addBlog,updateBlog,deleteBlog } = require("../controller/blog.js")
const { loginCheck } = require("../utils/loginCheck.js")

router.get('/list', function(req, res, next) {
    let keyword = req.query.keyword || ""
    let author = req.query.author || ""

    if(req.query.isadmin){
        if(req.session.username ==null){
            res.json(new ResError("未登录"))
        }else{
            author = req.session.username
        }
    }

    getList(author, keyword).then(listData=>{
        let result = new ResSuccess(listData, "OK")
        res.json(result)
    })
});

router.get('/detail', function(req, res, next) {
    let id = req.query.id || ""
    getDetail(id).then(detailData=>{
        let result = new ResSuccess(detailData, "OK")
        res.json(result)
    })
});

router.post('/add', loginCheck, function(req, res, next) {
    req.body.author = req.session.username
    addBlog(req.body).then(blogData=>{
        let result = new ResSuccess(blogData, "OK")
        res.json(result)
    })
});

router.post('/delete', loginCheck, function(req, res, next) {
    let id = req.query.id || ""
    let author = req.session.username
    deleteBlog(id, author).then(deleteResult=>{
        if(deleteResult){
            res.json(new ResSuccess())
        }else{
            res.json(new ResError("删除失败"))
        }
    })
});

router.post('/update', loginCheck, function(req, res, next) {
    let id = req.query.id || ""
    updateBlog(id, req.body).then(updateResult=>{
        if(updateResult){
            res.json(new ResSuccess())
        }else{
            res.json(new ResError("更新失败"))
        }
    })
});

module.exports = router;
