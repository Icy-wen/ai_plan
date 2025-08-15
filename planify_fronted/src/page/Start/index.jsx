import React from 'react';
import { Button } from 'tdesign-mobile-react';
import styles from './index.module.less'; // 导入模块化样式
import logo from '@/assets/logo.png';
import { useNavigate } from 'react-router-dom';
export default function StartPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginheader}>
        <img src={logo} alt="" />
        <div>planify</div>
        <p>规划你的生活小目标</p>
      </div>
      {/* 登录按钮 */}
      <Button 
        className={styles.loginBtn}
        onClick={() => navigate('/login')}
      >
        登录
      </Button>

      
    </div>
  );
}
