const redis = require("redis");
const env = process.env.NODE_ENV

let config = {}
if(env ==="dev"){
    config = {
        port: "6379",
        host: "127.0.0.1"
    }
}
if(env ==="prd"){
    config = {
        port: "6379",
        host: "127.0.0.1"
    }
}

// 创建客户端
const { port,host } = config
const redisClient = redis.createClient(port, host)

// 监听异常
redisClient.on("error", err=>{
    console.log(err)
})


module.exports = {
    redisClient
}