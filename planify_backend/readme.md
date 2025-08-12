# 框架
koa  https://www.koajs.net/


# 跨域认证jwt
jwt https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html
 
npm i jsonwebtoken

- sign函数
生成JWT令牌
- verify 函数
验证请求中的 JWT 令牌
流程：
从请求头的 authorization 字段获取令牌
如果没有令牌，返回 401 状态和 "请重新登录" 消息
如果有令牌，尝试用密钥 '666' 验证
验证成功且包含 id 字段时，将 id 存入 ctx.userId，继续执行后续中间件
验证失败时，返回 401 状态和 "登录失败" 消息
- refreshVerify 函数
流程：
验证令牌并返回解码后的数据，用于令牌刷新场景
尝试用密钥 '666' 验证传入的令牌
验证成功且包含 id 字段时，返回解码后的数据
验证失败时返回 false

# 防sql注入
转译标签

# 数据库 
1. 建立
2. 配置
3. 修改数据 controller

# 路由

# index入口