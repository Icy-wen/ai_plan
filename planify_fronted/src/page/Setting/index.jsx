import React, { useState } from 'react'
import { Button ,Navbar,Dialog} from 'tdesign-mobile-react';

import { Toast } from 'tdesign-mobile-react';
import { useNavigate } from 'react-router-dom'
import axios from '../../api'
import style from './index.module.less'

export default function Setting() {
  const navigate = useNavigate()

  // 退出登录处理函数
  const handleLogout = () => {
    // 发送退出登录请求到后端
    axios.post('/user/logout').then(res => {
      // 清除本地存储中的用户信息和token
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      
      // 显示退出成功提示
      Toast({ message: '退出登录成功', theme: 'success', direction: 'column' });
      
      // 延迟跳转到登录页面，确保用户能看到提示
      setTimeout(() => {
        navigate('/login')
      }, 1000)
    }).catch(err => {
      console.error('退出登录失败:', err)
      // 即使请求失败，也清除本地数据并跳转
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      navigate('/login')
    })
  }
const [alertProps, setAlertProps] = useState({ visible: false } );
  return (
    <div className={style.settingContainer}>
      <Navbar
      title="设置"
      leftArrow
      fixed={false}
      onLeftClick={()=>{
        navigate(-1)
      }}
    />
      <div className={style.settingItem}>

      <Button
        variant="outline"
        size="large"
        theme="primary"
        block
        onClick={() => {
          setAlertProps({
            visible: true,
            content: '确认退出账号吗',
            confirmBtn: '确认',
            cancelBtn: '取消',
          });
        }}
        style={{marginTop:'500px'}}
      >
      退出登录
      </Button>
      <Dialog
        {...alertProps}
        onClose={() => {
          setAlertProps({ ...alertProps, visible: false });
        }}
        onConfirm={handleLogout}
      />
      </div>
    </div>
  )
}


