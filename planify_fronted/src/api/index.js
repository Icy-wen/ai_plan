import axios from 'axios'
import { Toast } from 'tdesign-mobile-react';

axios.defaults.baseURL = 'http://127.0.0.1:3000'
// 告诉浏览器，如果发送的是 post请求，那么后端一定会返回 json 格式的数据，让浏览器以解析 json 的方式来解析响应提体
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器 -- 所有的请求都会先被这个函数拦截下来
axios.interceptors.request.use(requset => {
  // 从浏览器的本地存储中获取令牌
  const access_token = localStorage.getItem('access_token')
  // 如果令牌存在，那么就将令牌添加到请求头中
  if (access_token) {
    requset.headers.Authorization = access_token
  }
  return requset  // 请求放行
})



// 响应拦截器
axios.interceptors.response.use(
  (response) => {  // http 的状态吗为 200时才走进第一个回调
    if (response.status == 200) {

      if (response.data.code !== '1') {  // 逻辑性错误

        Toast({ message: response.data.msg, theme: 'error', direction: 'column' });
        return Promise.reject(response)
      }

      return Promise.resolve(response.data)
    }
  },
  (res) => { // 状态吗不为 2xx
    if (res.status === 401) {
      // toast.error(res.response.data.msg)
      // setTimeout(() => {
      //   window.location.href = '/login'
      // }, 2000)


      const originalRequest = res.config;

      // 重新请求新的短 token和长 token
      const refresh_token = localStorage.getItem('refresh_token')
      if (refresh_token) {
        axios.post('/user/refresh', {
          refresh_token: refresh_token
        }).then(res => {
          if (res.code === '1') {
            localStorage.setItem('access_token', res.access_token)
            localStorage.setItem('refresh_token', res.refresh_token)
            // 将之前没有发送成功的请求再次发送
            // 更新原始请求的 Authorization 头
            originalRequest.headers.Authorization = res.access_token;
            // 重新发送原始请求
            return axios(originalRequest);
          }
        })
      }
    }
    if (res.status === 416) {  // 长 token 也失效
      Toast({ message: res.response.data.msg, theme: 'error', direction: 'column' });
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    }
  }
)



export default axios