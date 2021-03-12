import React, { Component } from 'react';

export default class PhoneBarTimes extends Component {
  phoneBarTimer =  null
  state = {
    timing: '00:00:00', // 页面展示的计数
    currentTime: 0 // 当前计时
  };

  timerTypeChange = (obj) => { // 检测当前是正计时还是倒计时,由父组件调用
    this.setState({currentTime: parseInt(obj.statusTime, 10) || 0})
    if (obj.timeType === 'timing') { // 正计时
      this.timingInterval()
    } else if (obj.timeType === 'countDown') { // 倒计时
      this.countDownInterval()
    }
  }
  timingInterval = () => { // 正计时
    const self = this
    if (this.phoneBarTimer !== null) {
      window.clearInterval(this.phoneBarTimer)
    }
    this.phoneBarTimer = window.setInterval(() => {
      self.setState({timing: self.ctiUiGetTimer(self.state.currentTime)})
      self.setState({currentTime: self.state.currentTime - 0 + 1})
    }, 1000)
  }
  countDownInterval = () => { // 话后整理，倒计时
    const self = this
    let autoBusyTime = 30
    autoBusyTime = parseInt(autoBusyTime, 10) - this.state.currentTime || 0 // 话后整理时长 -  服务端跑的时间(eg: 后处理读秒的时候，刷新系统)
    if (autoBusyTime < 1) {
      return
    }
    if (this.phoneBarTimer !== null) {
      window.clearInterval(this.phoneBarTimer) // 清除定时器
    }
    this.phoneBarTimer = window.setInterval(() => {
      autoBusyTime--
      if (autoBusyTime <= 1) { // 倒计时为0的时候，让正计时也为0
        self.setState({ currentTime: 0 })
      }
      self.setState({ timing: self.ctiUiAutoBusyTime(autoBusyTime) })
    }, 1000)
  }
  ctiUiGetTimer = (countTimer) => {
    let minute
    let hour
    countTimer = 1 + parseInt(countTimer, 10)
    hour = countTimer / 3600
    hour = parseInt(hour, 10)
    minute = (countTimer % 3600) / 60
    minute = parseInt(minute, 10)
    const second = (countTimer % 3600) % 60
    let mtime = (hour < 10) ? '0' + hour : hour
    mtime += ':'
    mtime += (minute < 10) ? '0' + minute : minute
    mtime += ':'
    mtime += (second < 10) ? '0' + second : second
    return mtime
  }
  ctiUiAutoBusyTime = (autoBusyTime) => {
    let minute
    let second
    let hour
    if (autoBusyTime >= 60 * 60) {
      hour = autoBusyTime / (60 * 60)
      hour = parseInt(hour, 10)
      minute = (autoBusyTime - hour * (60 * 60)) / (60)
      minute = parseInt(minute, 10)
      second = autoBusyTime - hour * (60 * 60) - minute * (60)
    } else if (autoBusyTime >= 60 && (autoBusyTime < 60 * 60)) {
      hour = '0'
      minute = autoBusyTime / 60
      minute = parseInt(minute, 10)
      second = autoBusyTime - minute * 60
    } else if (autoBusyTime > 0 && autoBusyTime < 60) {
      hour = '0'
      minute = '0'
      second = autoBusyTime
    } else if (autoBusyTime <= 0) {
      hour = '0'
      minute = '0'
      second = '0'
    }
    if (hour < 0) {
      hour = 0
    }
    if (minute < 0) {
      minute = 0
    }
    if (second < 0) {
      second = 0
    }
    const timeStr = ((hour < 10) ? ('0' + hour) : hour) + ':' + ((minute < 10) ? ('0' + minute) : minute) + ':' + ((second < 10) ? ('0' + second) : second)
    return timeStr
  }
  clearPhonebarTimer = () => {
    window.clearInterval(this.phoneBarTimer)
  }

  render () {
    const { timing } = this.state;
    return (
      <span>{
        timing
      }</span>
    );
  }
}

