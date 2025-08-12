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
                const decode=jwt.verify(token,'666')
                if(decoded.id){
                    ctx.userId=decode.id
                    await next()
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