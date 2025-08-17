// 数据库相关操作
const mysql = require('mysql2/promise')
const config = require('../config/index.js')

// 创建线程池 （连接池）
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
})

// 执行 sql 的方法
const allServices = {
    async query(sql, values) {
      try {
        // 通过连接池连接mysql
        const conn = await pool.getConnection()
        // 执行各种增删改查的 sql 语句
        const [rows, fields] = await conn.query(sql, values)
        // 释放连接
        pool.releaseConnection(conn);
        // 返回查询结果
        return Promise.resolve(rows)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  // 注册要执行函数
const userRegister = (userInfo) => {
    let _sql = `insert into user (username,password,nickname,create_time) values ('${userInfo.username}','${userInfo.password}','${userInfo.nickname}',${userInfo.create_time});`
    return allServices.query(_sql)
  }
// 查找账号是否存在
const findUser = (username) => {
    let _sql = `select * from user where username='${username}' ;`
    return allServices.query(_sql)
  }

// 登录要执行函数
const userLogin = (username, password) => {
  let _sql = `select * from user where username='${username}' and password='${password}';`
  return allServices.query(_sql)
}


// 发布计划
const publishSchedule = (content, start_time, end_time, completed, create_time, update_time, user_id) => {
  let _sql = `insert into schedules (content,start_time,end_time,completed,create_time,update_time,user_id) values ('${content}','${start_time}','${end_time}',${completed},${create_time},${update_time},${user_id});`
  return allServices.query(_sql)
}
  // 获取用户的所有日程
  const getSchedules = (user_id) => {
    let _sql = `select * from schedules where user_id=${user_id} order by start_time desc,end_time desc;`;

    return allServices.query(_sql);
  }
  
  // 获取用户指定日期的日程
  const getSchedulesByDate = (user_id, date) => {
    // 修改查询逻辑，使其能够查询到在指定日期内有部分时间覆盖的所有日程
    let _sql = `
      select * from schedules 
      where user_id=${user_id} 
      and (
        -- 开始时间在指定日期
        start_time between '${date} 00:00:00' and '${date} 23:59:59' 
        -- 或者结束时间在指定日期
        or end_time between '${date} 00:00:00' and '${date} 23:59:59' 
        -- 或者开始时间早于指定日期且结束时间晚于指定日期（跨天日程）
        or (start_time < '${date} 00:00:00' and end_time > '${date} 23:59:59')
      ) 
      order by start_time desc;
    `;
    return allServices.query(_sql);
  };
  
  // 删除日程
  const deleteSchedule = (id, user_id) => {
    let _sql = `delete from schedules where id=${id} and user_id=${user_id};`;
    return allServices.query(_sql);
  }
  
  // 更新日程
  const updateSchedule = (id, content, start_time, end_time, user_id) => {
    const update_time = Date.now();
    let _sql = `update schedules set content='${content}', start_time='${start_time}', end_time='${end_time}', update_time=${update_time} where id=${id} and user_id=${user_id};`;
    return allServices.query(_sql);
  }
  
  // 更新日程完成状态
  const updateScheduleStatus = (id, completed, user_id) => {
    const update_time = Date.now();
    let _sql = `update schedules set completed=${completed}, update_time=${update_time} where id=${id} and user_id=${user_id};`;
    return allServices.query(_sql);
  }

module.exports={
  findUser,
  userRegister,
  userLogin,
  publishSchedule,
  getSchedules,
  getSchedulesByDate,
  deleteSchedule,
  updateSchedule,
  updateScheduleStatus
}