// 加载环境变量
require('dotenv').config()

const Koa = require('koa')
const app = new Koa()

const cors = require('@koa/cors')
const bodyParser = require('@koa/bodyparser').default
const userRouter = require('./router/user.js')
const scheduleRouter = require('./router/schedules.js')
const aiRouter = require('./router/ai.js')

app.use(cors())//允许跨域
app.use(bodyParser())//辅助koa解析请求体

// 路由挂载
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
app.use(scheduleRouter.routes())
app.use(scheduleRouter.allowedMethods())
app.use(aiRouter.routes())
app.use(aiRouter.allowedMethods())

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})