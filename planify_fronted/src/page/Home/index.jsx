// 修改导入语句，移除外部组件导入
import React, { useState } from "react";
import { Navbar, Popup, Button, Checkbox } from "tdesign-mobile-react";

import { Collapse, DatetimePicker, Input, Cell } from 'react-vant';
import { CalendarO, Add } from "@react-vant/icons";
import style from "./index.module.less";
import Clander from '@/components/clandar/Calendar.jsx';
import dayjs from 'dayjs';


export default function Home() {
  const [visible, setVisible] = useState(false);
  // 添加时间选择相关状态
  const [value, setValue] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(formatDate(new Date()));
  const [inputValue, setInputValue] = useState('');
  // 添加日程列表状态
  const [schedules, setSchedules] = useState([]);
  // 添加编辑状态
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [endTime, setEndTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(formatDate(new Date()));
  // 添加当前选中日期的状态
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  // 处理日历日期选择
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // 如果不是编辑状态，重置时间选择器为选中日期的0点
    if (editingScheduleId === null) {
      const selectedDateTime = new Date(`${date}T00:00:00`);
      setValue(selectedDateTime);
      setEndTime(selectedDateTime);
      setSelectedTime(formatDate(selectedDateTime));
      setSelectedEndTime(formatDate(selectedDateTime));
    }
  };

  // 格式化日期为可读字符串
  function formatDate(date) {
    if (!date) return '选择日期时间';
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
  const toggleComplete = (id, e) => {
    e.stopPropagation(); // 阻止事件冒泡到li元素
    setSchedules(schedules.map(schedule => 
      schedule.id === id
        ? { ...schedule, completed: !schedule.completed }
        : schedule
    ));
  };

  // 提交日期事件
  const SubmitDateEvent = () => {
    if (!inputValue.trim()) {
      alert('请输入日程内容');
      return;
    }

    const scheduleData = {
      startTime: value,
      endTime: endTime,
      content: inputValue,
      formattedStartTime: selectedTime,
      formattedEndTime: selectedEndTime,
      completed: false // 默认为未完成
    };

    if (editingScheduleId !== null) {
      // 编辑现有日程
      const updatedSchedules = schedules.map(schedule => 
        schedule.id === editingScheduleId
          ? { ...schedule, ...scheduleData }
          : schedule
      );
      setSchedules(updatedSchedules);
      console.log('更新日程:', { id: editingScheduleId, ...scheduleData });
      setEditingScheduleId(null);
    } else {
      // 添加新日程
      const newSchedule = {
        id: Date.now(), // 使用时间戳作为唯一ID
        ...scheduleData
      };
      setSchedules([...schedules, newSchedule]);
      console.log('添加新日程:', newSchedule);
    }

    // 清空输入并关闭弹窗
    setInputValue('');
    setVisible(false);
  };

  // 处理日程项点击事件
  const handleScheduleClick = (schedule) => {
    // 设置编辑状态
    setEditingScheduleId(schedule.id);
    // 填充表单
    setValue(new Date(schedule.startTime));
    setEndTime(new Date(schedule.endTime));
    setSelectedTime(schedule.formattedStartTime);
    setSelectedEndTime(schedule.formattedEndTime);
    setInputValue(schedule.content);
    // 打开弹窗
    setVisible(true);
  };

  // 删除日程
  const deleteSchedule = (id, e) => {
    e.stopPropagation(); // 阻止事件冒泡到li元素
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    console.log('删除日程:', id);
  };

  // 筛选出当前选中日期的日程
  const filteredSchedules = schedules.filter(schedule => {
    const scheduleDate = dayjs(schedule.startTime).format('YYYY-MM-DD');
    return scheduleDate === selectedDate;
  });

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

  // 获取所有有日程的日期
  const getScheduleDates = () => {
    const dates = new Set();
    schedules.forEach(schedule => {
      const date = dayjs(schedule.startTime).format('YYYY-MM-DD');
      dates.add(date);
    });
    return Array.from(dates);
  };

  // 有日程的日期列表
  const scheduleDates = getScheduleDates();

  return (
    <div className={style.home}>
      {/* 添加按钮 */}
      <div className={style.add}>
        <Add fontSize='80px' color="blue" onClick={handleAddClick} />
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
          <span className={style.scheduleCount}>({filteredSchedules.length})</span>
        </h3>
        
        {filteredSchedules.length === 0 ? (
          <div className={style.emptyTip}>
            <div className={style.emptyIcon}>📝</div>
            <p>暂无日程安排</p>
            <p>点击右下角的 <span className={style.addHint}>+</span> 按钮添加新日程</p>
          </div>
        ) : (
          <ul className={style.scheduleList}>
            {filteredSchedules.map((schedule, index) => (
              <li 
                key={schedule.id} 
                
                className={`${style.scheduleItem} ${schedule.completed ? style.completed : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                
                
                {/* 日程内容 */}
                <div className={style.scheduleContent} >
                  <div className={style.trueContent}>
                  <div className={style.scheduleContentDetail}  onClick={() => handleScheduleClick(schedule)}>{schedule.content}</div>
                  {/* 完成状态区域 */}
                <div className={style.scheduleCheck}>
                  <Checkbox
                    checked={schedule.completed}
                    onChange={() => toggleComplete(schedule.id, event)}
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
                  value={value}
                  onChange={handleStartTimeChange}
                  visibleItemCount={2}
                />
              </Collapse.Item>
            </Collapse>
            
            {/* 结束时间选择 */}
            <Collapse>
              <Collapse.Item title={`🕒 结束时间: ${selectedEndTime}`} name="2">
                <DatetimePicker
                  showToolbar={false}
                  type='datetime'
                  minDate={value}
                  maxDate={new Date(2025, 10, 1)}
                  value={endTime}
                  onChange={handleEndTimeChange}
                  visibleItemCount={2}
                />
              </Collapse.Item>
            </Collapse>
            
            {/* 日程内容输入 */}
            <Input
              value={inputValue}
              onChange={setInputValue}
              placeholder="📝 请输入日程内容..."
              style={{ marginTop: '20px' }}
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
