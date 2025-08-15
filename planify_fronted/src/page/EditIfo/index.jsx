import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Image, Uploader, Toast, Cell, CellGroup } from 'react-vant';
import { Lock, Smile,  ArrowLeft } from "@react-vant/icons";
import style from './index.module.less';

export default function EditIfo() {
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigate = useNavigate();

  // 获取当前用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/user/info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
        setAvatarUrl(response.data.avatar || '');
        form.setFieldsValue({
          username: response.data.username,
          nickname: response.data.nickname
        });
      } catch (error) {
        Toast.fail('获取用户信息失败');
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, [navigate, form]);

  // 处理头像上传
  const handleAvatarUpload = async (file) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setAvatarUrl(response.data.url);
      setLoading(false);
      Toast.success('头像上传成功');
    } catch (error) {
      setLoading(false);
      Toast.fail('头像上传失败');
      console.error('Failed to upload avatar:', error);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = {
        username: values.username,
        nickname: values.nickname,
        ...(values.password && { password: values.password }),
        ...(avatarUrl && { avatar: avatarUrl })
      };

      await axios.put('/api/user/update', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Toast.success('用户信息更新成功');
      navigate('/profile');
    } catch (error) {
      Toast.fail('用户信息更新失败');
      console.error('Failed to update user info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/profile')}
          className={style.backButton}
          plain
        />
        <h2>编辑个人信息</h2>
      </div>

      <div className={style.avatarContainer}>
        <Uploader
          className={style.avatarUploader}
          accept="image/*"
          multiple={false}
          onUpload={handleAvatarUpload}
          loading={loading}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              className={style.avatar}
              round
              fit="cover"
            />
          ) : (
            <div className={style.avatarPlaceholder}>
              
            </div>
          )}
          <div className={style.uploadOverlay}>
            
            <span>更换头像</span>
          </div>
        </Uploader>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        className={style.form}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            
            placeholder="请输入用户名"
          />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input
            prefix={<Smile className={style.icon} />}
            placeholder="请输入昵称"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="新密码"
          rules={[{ required: false, message: '请输入新密码', min: 6 }]}
        >
          <Input
            prefix={<Lock className={style.icon} />}
            placeholder="不修改密码请留空"
            type="password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['password']}
          rules={[
            {
              required: false,
              message: '请确认新密码'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              }
            })
          ]}
        >
          <Input
            prefix={<Lock className={style.icon} />}
            placeholder="请确认新密码"
            type="password"
          />
        </Form.Item>

        <Form.Item className={style.submitButton}>
          <Button
            type="primary"
            loading={loading}
            block
            size="large"
            nativeType="submit"
          >
            保存修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}