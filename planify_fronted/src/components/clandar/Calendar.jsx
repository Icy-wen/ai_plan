import dayjs from 'dayjs'
import React, { Component } from 'react'
import { Calendar } from 'react-h5-calendar'

export default class Demo extends Component {
  state = {
    currentDate: dayjs().format('YYYY-MM-DD'),
  }
  
  componentDidMount() {
    // 如果父组件传入了日期，使用它
    if (this.props.initialDate) {
      this.setState({ currentDate: this.props.initialDate });
    }
  }
  
  // 当props变化时更新状态
  componentDidUpdate(prevProps) {
    if (prevProps.initialDate !== this.props.initialDate) {
      this.setState({ currentDate: this.props.initialDate });
    }
  }
  
  onChangeDate = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    this.setState({ currentDate: formattedDate });
    console.log(formattedDate);
    // 调用父组件的回调函数
    if (this.props.onDateSelect) {
      this.props.onDateSelect(formattedDate);
    }
  };
  
  // 添加返回今天的方法
  handleTodayClick = () => {
    const today = dayjs().format('YYYY-MM-DD')
    this.setState({ currentDate: today })
    console.log('返回到今天:', today)
    // 通知父组件
    if (this.props.onDateSelect) {
      this.props.onDateSelect(today);
    }
  };
  
  render() {
    // 基础标记（今天）
    const baseMarks = [
      { date: dayjs().format('YYYY-MM-DD'), markType: 'circle' },
    ];
    
    // 有日程的日期标记
    const scheduleMarks = this.props.scheduleDates || [];
    const scheduleDateMarks = scheduleMarks.map(date => ({
      date: date,
      markType: 'dot',
    }));
    
    // 合并所有标记
    const allMarks = [...baseMarks, ...scheduleDateMarks];
    
    return (
      <div className="calendar-container">
        {/* 添加返回今天按钮 */}
        <button onClick={this.handleTodayClick} className="today-button">
          今天
        </button>
        <Calendar
          onDateClick={this.onChangeDate}
          showType={'week'}
          markDates={allMarks}
          currentDate={this.state.currentDate}
          onTouchEnd={(a, b) => console.log(a, b)}
        />
      </div>
    );
  }
}