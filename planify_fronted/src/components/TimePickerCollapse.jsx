import React, { useState } from 'react';
import { DatetimePicker } from 'react-vant';
import { Collapse } from 'react-vant';

// 格式化日期为可读字符串
const formatDate = (date) => {
  if (!date) return '选择日期时间';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function TimePickerCollapse() {
  const [value, setValue] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(formatDate(new Date()));

  const handleChange = (newValue) => {
    setValue(newValue);
    setSelectedTime(formatDate(newValue));
  };

  return (
    <div style={{ padding: '16px' }}>
      

      <Collapse initExpanded={['1']} style={{ marginTop: '16px' }}>
        <Collapse.Item title={selectedTime} name="1">
          <DatetimePicker
          showToolbar={false}
        type='datetime'
        minDate={new Date(2020, 0, 1)}
        maxDate={new Date(2025, 10, 1)}
        value={value}
        onChange={handleChange}
      />
        </Collapse.Item>
      </Collapse>
    </div>
  );
}