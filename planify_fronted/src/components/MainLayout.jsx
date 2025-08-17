import React, { useState } from 'react';
import { Tabbar } from 'react-vant';
import { WapHomeO, Records, FriendsO, UserCircleO } from '@react-vant/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import style from './MainLayout.module.less';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('home');

  // 根据当前路径设置激活的标签
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('home')) setActiveKey('home');
    else if (path.includes('plan')) setActiveKey('plan');
    else if (path.includes('profile')) setActiveKey('profile');
  }, [location.pathname]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    switch (key) {
      case 'home':
        navigate('/home');
        break;
      case 'plan':
        navigate('/plan');
        break;

      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/home');
    }
  };

  return (
    <div className={style.container}>
      <div className={style.content}>{children}</div>
      <div className={style.footer}>
        <Tabbar value={activeKey} onChange={handleTabChange}>
          <Tabbar.Item name="home" icon={<WapHomeO />}>首页</Tabbar.Item>
          <Tabbar.Item name="plan" icon={<Records />}>规划</Tabbar.Item>
          <Tabbar.Item name="profile" icon={<UserCircleO />}>我的</Tabbar.Item>
        </Tabbar>
      </div>
    </div>
  );
}