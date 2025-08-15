const Koa = require('koa')
const app = new Koa()

const cors = require('@koa/cors')
const bodyParser = require('@koa/bodyparser').default
const userRouter = require('./router/user.js')
app.use(cors())//允许跨域
app.use(bodyParser())//辅助koa解析请求体

// 路由挂载
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})