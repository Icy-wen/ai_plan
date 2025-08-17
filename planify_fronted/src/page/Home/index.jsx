// 修改导入语句，移除外部组件导入
import React, { useEffect, useState } from "react";
import { Navbar, Popup, Button, Checkbox ,Toast} from "tdesign-mobile-react";
import { useNavigate } from 'react-router-dom';

import { Collapse, DatetimePicker, Input, Cell } from 'react-vant';
import { CalendarO, Add, ChatO } from "@react-vant/icons";
import style from "./index.module.less";
import Clander from '@/components/clandar/Calendar.jsx';
import dayjs from 'dayjs';
import axios from '../../api';

export default function Home() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  // 添加时间选择相关状态
  const [value, setValue] = useState(() => {
    const now = new Date();
    return now;
  });
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    return now;
  });
  const [selectedTime, setSelectedTime] = useState(formatDate(new Date()));
  const [inputValue, setInputValue] = useState('');
  // 添加日程列表状态
  const [schedules, setSchedules] = useState([]);
  // 添加编辑状态
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(formatDate(new Date()));
  // 添加当前选中日期的状态
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  // 添加加载状态
  const [loading, setLoading] = useState(false);
  // 添加所有日程日期列表（用于日历标记）
  const [scheduleDates, setScheduleDates] = useState([]);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  
  // 优化日期格式化函数，增加防御性检查
  function formatDate(date) {
    if (!date) return '选择日期时间';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // 检查是否为有效日期
    if (isNaN(dateObj.getTime())) return '选择日期时间';
    return dateObj.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 重新获取所有日程列表（用于初始化和日历标记）
  const fetchAllSchedules = () => {
    axios.get('/schedule-list').then(res => {
      if (res.code === "1" && res.data && Array.isArray(res.data)) {
        // 格式化日程时间
        const formattedSchedules = res.data.map(schedule => ({
          ...schedule,
          formattedStartTime: formatDate(schedule.start_time),
          formattedEndTime: formatDate(schedule.end_time)
        }));
        
        // 更新日程日期列表（用于日历标记）
        updateScheduleDates(formattedSchedules);
      }
    }).catch(error => {
      console.error('获取所有日程失败:', error);
    });
  };

  // 获取指定日期的日程
  const fetchSchedulesByDate = (date) => {
    setLoading(true);
    axios.get(`/schedule-by-date/${date}`).then(res => {
      if (res.code === "1" && res.data && Array.isArray(res.data)) {
        // 格式化日程时间
        const formattedSchedules = res.data.map(schedule => ({
          ...schedule,
          formattedStartTime: formatDate(schedule.start_time),
          formattedEndTime: formatDate(schedule.end_time)
        }));
        setSchedules(formattedSchedules);
      } else {
        setSchedules([]);
      }
    }).catch(error => {
      console.error('获取指定日期日程失败:', error);
      setSchedules([]);
    }).finally(() => {
      setLoading(false);
    });
  };

  // 更新日程日期列表（用于日历标记）
  const updateScheduleDates = (allSchedules) => {
    const dates = new Set();
    allSchedules.forEach(schedule => {
      if (schedule.start_time && schedule.end_time) {
        const startDate = dayjs(schedule.start_time).startOf('day');
        const endDate = dayjs(schedule.end_time).startOf('day');
        
        // 如果是同一天的日程，直接添加
        if (startDate.isSame(endDate)) {
          dates.add(startDate.format('YYYY-MM-DD'));
        } else {
          // 如果是跨天日程，计算并添加所有日期
          let currentDate = startDate;
          while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
            dates.add(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
          }
        }
      }
    });
    setScheduleDates(Array.from(dates));
  };

  // 优化日期选择处理函数
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // 获取选中日期的日程
    fetchSchedulesByDate(date);
    
    // 如果不是编辑状态，重置时间选择器为选中日期的0点
    if (editingScheduleId === null) {
      try {
        const selectedDateTime = new Date(`${date}T00:00:00`);
        // 确保创建的是有效日期
        if (!isNaN(selectedDateTime.getTime())) {
          setValue(selectedDateTime);
          setEndTime(selectedDateTime);
          setSelectedTime(formatDate(selectedDateTime));
          setSelectedEndTime(formatDate(selectedDateTime));
        }
      } catch (error) {
        console.error('日期格式化错误:', error);
        // 设置默认日期
        const now = new Date();
        setValue(now);
        setEndTime(now);
        setSelectedTime(formatDate(now));
        setSelectedEndTime(formatDate(now));
      }
    }
  };

  // 处理开始日期时间变化
  const handleStartTimeChange = (newValue) => {
    setValue(newValue);
    setSelectedTime(formatDate(newValue));
    // 确保结束时间不早于开始时间
    if (newValue > endTime) {
      setEndTime(newValue);
      setSelectedEndTime(formatDate(newValue));
    }
  };

  // 处理结束日期时间变化
  const handleEndTimeChange = (newValue) => {
    setEndTime(newValue);
    setSelectedEndTime(formatDate(newValue));
  };

  // 切换日程完成状态
  const toggleComplete = async (id, completed, e) => {
    e.stopPropagation(); // 阻止事件冒泡到li元素
    
    try {
      // 先更新本地状态
      setSchedules(schedules.map(schedule => 
        schedule.id === id
          ? { ...schedule, completed: !completed }
          : schedule
      ));
      
      // 再调用API更新服务器状态
      const res = await axios.patch(`/schedule/${id}/status`, {
        completed: !completed
      });
      
      if (res.code !== "1") {
        // 如果更新失败，回滚本地状态
        setSchedules(schedules.map(schedule => 
          schedule.id === id
            ? { ...schedule, completed }
            : schedule
        ));
        Toast({ message: '更新状态失败', theme: 'danger', direction: 'column' });
      }
    } catch (error) {
      // 出错时回滚本地状态
      setSchedules(schedules.map(schedule => 
        schedule.id === id
          ? { ...schedule, completed }
          : schedule
      ));
      Toast({ message: '更新状态失败', theme: 'danger', direction: 'column' });
      console.error('更新状态失败:', error);
    }
  };

  // 提交日期事件
  // 修改 SubmitDateEvent 函数，确保发送ISO 8601格式的时间字符串
  const SubmitDateEvent = async () => {
    if (!inputValue.trim()) {
      Toast({ message: '请输入日程内容', theme: 'warning', direction: 'column' });
      return;
    }
    
    try {
      // 确保时间对象有效
      if (!value || isNaN(value.getTime()) || !endTime || isNaN(endTime.getTime())) {
        Toast({ message: '请选择有效的时间', theme: 'warning', direction: 'column' });
        return;
      }
      
      // 将Date对象转换为ISO 8601格式字符串，保留完整时间信息
      const startTimeISO = value.toISOString();
      const endTimeISO = endTime.toISOString();
      
      if (editingScheduleId !== null) {
        // 更新现有日程
        const res = await axios.put(`/schedule/${editingScheduleId}`, {
          content: inputValue,
          startTime: startTimeISO,
          endTime: endTimeISO
        });
        
        if (res.code === "1") {
          Toast({ message: '更新成功', theme: 'success', direction: 'column' });
          // 刷新当前日期的日程列表
          fetchSchedulesByDate(selectedDate);
          // 刷新日历标记
          fetchAllSchedules();
        } else {
          Toast({ message: '更新失败', theme: 'danger', direction: 'column' });
        }
      } else {
        // 添加新日程
        const res = await axios.post('/schedule-publish', {
          content: inputValue,
          startTime: startTimeISO,
          endTime: endTimeISO,
          completed: 0
        });
        
        if (res.code === "1") {
          Toast({ message: '添加成功', theme: 'success', direction: 'column' });
          // 刷新当前日期的日程列表
          fetchSchedulesByDate(selectedDate);
          // 刷新日历标记
          fetchAllSchedules();
        } else {
          Toast({ message: '添加失败', theme: 'danger', direction: 'column' });
        }
      }
      
      // 清空输入并关闭弹窗
      setInputValue('');
      setVisible(false);
      setEditingScheduleId(null);
    } catch (error) {
      Toast({ message: '操作失败', theme: 'danger', direction: 'column' });
      console.error('操作失败:', error);
    }
  };

  // 处理日程项点击事件
  const handleScheduleClick = (schedule) => {
    // 设置编辑状态
    setEditingScheduleId(schedule.id);
    // 填充表单
    setValue(new Date(schedule.start_time));
    setEndTime(new Date(schedule.end_time));
    setSelectedTime(schedule.formattedStartTime);
    setSelectedEndTime(schedule.formattedEndTime);
    setInputValue(schedule.content);
    // 打开弹窗
    setVisible(true);
  };

  // 删除日程
  const deleteSchedule = async (id, e) => {
    e.stopPropagation(); // 阻止事件冒泡到li元素
    
    try {
      // 先从本地移除
      const deletedSchedule = schedules.find(schedule => schedule.id === id);
      setSchedules(schedules.filter(schedule => schedule.id !== id));
      
      // 再调用API删除服务器上的数据
      const res = await axios.delete(`/schedule/${id}`);
      
      if (res.code !== "1") {
        // 如果删除失败，恢复本地数据
        if (deletedSchedule) { // 添加检查，确保deletedSchedule存在
          setSchedules(prev => [...prev.filter(schedule => schedule.id !== id), deletedSchedule]);
        }
        Toast({ message: '删除失败', theme: 'danger', direction: 'column' });
      } else {
        Toast({ message: '删除成功', theme: 'success', direction: 'column' });
        // 刷新日历标记
        fetchAllSchedules();
      }
    } catch (error) {
      // 出错时恢复本地数据
      if (deletedSchedule) { // 添加检查，确保deletedSchedule存在
        setSchedules(prev => [...prev.filter(schedule => schedule.id !== id), deletedSchedule]);
      }
      Toast({ message: '删除失败', theme: 'danger', direction: 'column' });
      console.error('删除失败:', error);
    }
  };

  // 跳转到AI助手页面
  const handleAIChat = () => {
    navigate('/ai-chat');
  };

  // 初始加载时获取数据
  useEffect(() => {
    // 获取所有日程用于日历标记
    fetchAllSchedules();
    // 获取当前日期的日程
    fetchSchedulesByDate(selectedDate);
  }, []);

  // 点击加号按钮，打开弹窗并设置时间选择器为当前选中日期的0点
  const handleAddClick = () => {
    setEditingScheduleId(null);
    const selectedDateTime = new Date(`${selectedDate}T00:00:00`);
    setValue(selectedDateTime);
    setEndTime(selectedDateTime);
    setSelectedTime(formatDate(selectedDateTime));
    setSelectedEndTime(formatDate(selectedDateTime));
    setInputValue('');
    setVisible(true);
  };

  return (
    <div className={style.home}>
      {/* 添加按钮 */}
      
      <div className={style.add}>
        <Add fontSize='1.5rem' color="#667eea" onClick={handleAddClick} />
      </div>
      
      {/* AI助手按钮 */}
      <div className={style.aiAssistant}>
        <ChatO fontSize='1.5rem' color="#667eea" onClick={handleAIChat} />
      </div>
      
      {/* 头部区域 */}
      <div className={style.hearder}>
        
        {/* 日历组件 */}
        <Clander 
          initialDate={selectedDate} 
          onDateSelect={handleDateSelect} 
          scheduleDates={scheduleDates} 
        />
      </div>
      
      {/* 内容区域 */}
      <div className={style.content}>
        <h3>
          <span className={style.dateIcon}>📅</span>
          {selectedDate} 的日程
          <span className={style.scheduleCount}>({schedules.length})</span>
        </h3>
        
        {loading ? (
          <div className={style.loading}>
            <p>加载中...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className={style.emptyTip}>
            <div className={style.emptyIcon}>📝</div>
            <p>暂无日程安排</p>
            <p>点击右下角的 <span className={style.addHint}>+</span> 按钮添加新日程</p>
          </div>
        ) : (
          <ul className={style.scheduleList}>
            {schedules.map((schedule, index) => (
              <li 
                key={schedule.id} 
                
                className={`${style.scheduleItem} ${schedule.completed ? style.completed : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                
                
                {/* 日程内容 */}
                <div className={style.scheduleContent} >
                  <div className={style.trueContent}>
                  <div className={style.scheduleContentDetail} onClick={() => handleScheduleClick(schedule)}>{schedule.content}</div>
                  {/* 完成状态区域 */}
                <div className={style.scheduleCheck}>
                  <Checkbox
                    checked={schedule.completed}
                    onChange={(checked) => toggleComplete(schedule.id, schedule.completed, event)} // 正确传递completed状态
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                  </div>
                <div className={style.otherContent}>
                  {/* 时间信息 */}
                <div className={style.scheduleTime}>
                  <span className={style.timeLabel}>🕐 开始: {schedule.formattedStartTime}</span>
                  <span className={style.timeLabel}>🕒 结束: {schedule.formattedEndTime}</span>
                </div>
                 {/* 删除按钮 */}
                 <div 
                  onClick={(e) => deleteSchedule(schedule.id, e)}
                  className={style.deleteBtn}
                >
                  <span>🗑️</span> 
                </div>
                </div>
                </div>
                
                
                
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* 表单弹窗 */}
      <div className={style.form}>
        <Popup 
          visible={visible} 
          onVisibleChange={handleVisibleChange} 
          placement="bottom" 
          style={{ height: '60%', padding: '20px' }}
        >
          <div className={style.popupContent}>
            <h3>
              {editingScheduleId !== null ? '✏️ 编辑日程' : '➕ 添加日程'}
            </h3>
            
            {/* 开始时间选择 */}
            <Collapse>
              <Collapse.Item title={`🕐 开始时间: ${selectedTime}`} name="1">
                <DatetimePicker
                  showToolbar={false}
                  type='datetime'
                  minDate={new Date()}
                  maxDate={new Date(2025, 10, 1)}
                  value={value && !isNaN(value.getTime()) ? value : new Date()}
                  onChange={handleStartTimeChange}
                  visibleItemCount={5}
                  // 添加额外的安全配置
                  allowSameDay={true}
                />
              </Collapse.Item>
            </Collapse>
            
            <Collapse>
              <Collapse.Item title={`🕒 结束时间: ${selectedEndTime}`} name="2">
                <DatetimePicker
                  showToolbar={false}
                  type='datetime'
                  minDate={value && !isNaN(value.getTime()) ? value : new Date()}
                  maxDate={new Date(2025, 10, 1)}
                  value={endTime && !isNaN(endTime.getTime()) ? endTime : new Date()}
                  onChange={handleEndTimeChange}
                  visibleItemCount={5}
                  allowSameDay={true}
                />
              </Collapse.Item>
            </Collapse>
            
            {/* 日程内容输入 */}
            <Input
              value={inputValue}
              onChange={setInputValue}
              placeholder="📝 请输入日程内容..."
              style={{ marginTop: '20px', fontSize: '0.7rem' }}
            />
            
            {/* 提交按钮 */}
            <Button 
              onClick={SubmitDateEvent}
              style={{ marginTop: '25px', width: '100%' }}
            >
              {editingScheduleId !== null ? '💾 更新日程' : '➕ 添加日程'}
            </Button>
          </div>
        </Popup>
      </div>
    </div>
  );
}
