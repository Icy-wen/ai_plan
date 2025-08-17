const jwt =require('jsonwebtoken')

function sign(options,time){
    return jwt.sign(options,'666',{
        expiresIn:time||'86400'
    })
}

function verify(){
    return async(ctx ,next)=>{
        const token=ctx.headers.authorization
        if(token){
            try{
                const decoded=jwt.verify(token,'666')
                if(decoded.id){
                    ctx.userId=decoded.id
                    await next()
                } else {
                    // 当decoded.id不存在时，提供明确的响应
                    ctx.status=401
                    ctx.body={
                        code:'0',
                        msg:'无效的用户信息'
                    }
                }
            }catch(error){
                ctx.status=401
                ctx.body={
                    code:'0',
                    msg:'登录失败'
                }
            }
        }else{
            ctx.status=401
            ctx.body={
                code:'0',
                msg:'请重新登录'
            }
        }
    }
}
function refreshVerify(token) {
    try {
      const decoded = jwt.verify(token, '666')
      if (decoded.id) {
        return decoded
      }
    } catch (error) {
      return false
    }
  }
  
  module.exports = {
    sign,
    verify,
    refreshVerify
  }