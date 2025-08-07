import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button, Form, Input } from 'tdesign-mobile-react';
import styles from './index.module.less'; // 导入模块化样式
import logo from '@/assets/logo.png';
export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制登录框显示/隐藏
  const formRef = useRef(null);
  const isInit = useRef(false);

  const rules = useMemo(
    () => ({
      username: [{ required: true, message: '请输入用户名' }],
      password: [
        { required: true, message: '请输入密码' },
        { validator: (val) => val?.length >= 6, message: '密码长度至少6个字符' }
      ],
    }),
    [],
  );

  useEffect(() => {
    if (isInit.current) {
      return;
    }
    formRef.current?.setValidateMessage(rules);
    isInit.current = true;
  }, [rules]);

  const onSubmit = (e) => {
    console.log('登录提交:', e);
    // 这里添加登录逻辑
  };

  const onRegister = () => {
    console.log('跳转到注册页');
    // 这里添加跳转到注册页的逻辑
    setIsModalOpen(false);
  };

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
        onClick={() => setIsModalOpen(true)}
      >
        登录
      </Button>

      {/* 登录模态框 */}
      {isModalOpen && (
        <div className={styles.loginModal} onClick={() => setIsModalOpen(false)}>
          <div className={styles.loginBox} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>

            <div className={styles.loginHeader}>
              <div className={styles.title}>登录</div>
            </div>

            <div className={styles.loginForm}>
              <Form
                ref={formRef}
                showErrorMessage
                resetType="initial"
                labelAlign="left"
                scrollToFirstError="auto"
                rules={rules}
                onSubmit={onSubmit}
                labelWidth="3rem"
              >
                <Form.FormItem label="用户名" name="username" className={styles.formItem}>
                  <Input placeholder="请输入用户名" />
                </Form.FormItem>

                <Form.FormItem label="密码" name="password" className={styles.formItem}>
                  <Input type="password" placeholder="请输入密码" />
                </Form.FormItem>

                <Button type="submit" className={styles.submitBtn}>登录</Button>
              </Form>

              <div className={styles.registerLink}>
                还没有账号？<a href="#" onClick={onRegister}>立即注册</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
