import style from './index.module.less'
import logo from '../../assets/logo.png'
import { Button, Input, Form } from 'react-vant'
import { Toast } from 'tdesign-mobile-react';
import axios from '../../api'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
export default function Login() {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const  {state}= useLocation()//从注册页传过来的参数
    //console.log(state)
    const onFinish = values => {
        //console.log(values)
        axios.post('/user/login',values).then(res=>{
          Toast({ message: '登录成功', theme: 'success', direction: 'column' });
          localStorage.setItem('user',JSON.stringify(res.data))
          localStorage.setItem('access_token',res.access_token)  // 修改这里，使用与拦截器相同的键名
          localStorage.setItem('refresh_token',res.refresh_token)
          navigate('/home')
        })
    }

    return (
        <div className={style.login}>
            <h1 className={style.title}>planify</h1>
            <h1 className={style.title}>登录</h1>
            <div className={style['login-wrapper']}>
                <div className={style.avater}>
                    <img className={style['avater-img']} src={logo} alt="logo" />
                </div>
                <Form
                    form={form}
                    onFinish={onFinish}
                    footer={
                        <div style={{ margin: '16px 16px 0' }}>
                            <Button round nativeType='submit' type='primary' color='#7bd4e6' block>
                                登录
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        rules={[{ required: true, message: '请填写用户名' }]}
                        name='username'
                        label='用户名'
                        labelWidth={50}
                        initialValue={state?.username}
                    >
                        <Input placeholder='请输入用户名' />
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: true, message: '请填写密码' }]}
                        name='password'
                        label='密码'
                        labelWidth={50}
                        initialValue={state?.password}
                    >
                        <Input placeholder='请输入密码' />
                    </Form.Item>
                </Form>
            </div>


            <p className={style['login-tip']} onClick={()=>{
                navigate('/register')
            }}>
                没有账号？去注册
            </p>
        </div>
    )
}
