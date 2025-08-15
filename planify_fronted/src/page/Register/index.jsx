import React from 'react';
import { Button, Input, Form } from 'react-vant'
import styles from './index.module.less'; // 导入模块化样式
import logo from '@/assets/logo.png';
import axios from '../../api';
import { Toast } from 'tdesign-mobile-react';
import { useNavigate } from 'react-router';

export default function Register() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const onFinish = async values => {
      //console.log(values)
      const res = await axios.post('/user/register', values);
      if (res.code == '1') {
        Toast({ message: '注册成功', theme: 'success', direction: 'column' });
        setTimeout(() => {
            //navigate(`/login?username=${values.username}&password=${values.password}`)
            navigate(`/login`,{state:{username:values.username,password:values.password}})
        }, 1000);
          
      } else {
        
        Toast({ message: 'res.msg', theme: 'error', direction: 'column' });
      }
  }

  return (
      <div className={styles.login}>
          <h1 className={styles.title}>注册</h1>
          <div className={styles['login-wrapper']}>
              <div className={styles.avater}>
                  <img className={styles['avater-img']} src={logo} alt="logo" />
              </div>
              <Form
                  form={form}
                  onFinish={onFinish}
                  footer={
                      <div style={{ margin: '16px 16px 0' }}>
                          <Button round nativeType='submit' type='info' block>
                              注册
                          </Button>
                      </div>
                  }
              >
                  <Form.Item
                      rules={[{ required: true, message: '请填写用户名' }]}
                      name='username'
                      label='用户名'
                      labelWidth={50}
                  >
                      <Input placeholder='请输入用户名' />
                  </Form.Item>
                  <Form.Item
                      rules={[{ required: true, message: '请填写密码' }]}
                      name='password'
                      label='密码'
                      labelWidth={50}
                  >
                      <Input placeholder='请输入密码' />
                  </Form.Item>
                  <Form.Item
                      rules={[{ required: true, message: '请填写昵称' }]}
                      name='nickname'
                      label='昵称'
                      labelWidth={50}
                  >
                      <Input placeholder='请输入昵称' />
                  </Form.Item>
              </Form>
          </div>


          <p className={styles['login-tip']} onClick={() => {
              navigate('/login')
          }}>
              已注册，去登录
          </p>
      </div>
  )
}
