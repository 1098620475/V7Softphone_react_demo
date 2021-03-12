import React, { Component } from 'react';
import { Button, message, Input } from 'antd';
import config from 'src/commons/config-hoc';
import './style.less';

import PhoneBarTimes from './phoneBarTimes'

import V7Softphone from 'softphone_test'

import {getLoginUser, toLogin} from 'src/commons'

// const { Option } = Select

@config({
    path: '/softphone',
    ajax: true,
    noFrame: true,
    noAuth: true,
})
export default class Softphone extends Component {
    dialoutNumber = ''
    renderMap = {
        PSTN_INVALID: ['dialout', 'stateSelect'],
        PSTN_INCOMING_CALLING: ['hangup'],
        PSTN_DIALOUT_CALLING: ['hangup'],
        PSTN_INCOMING_RING: ['hangup'],
        PSTN_DIALOUT_RING: ['hangup'],
        PSTN_INCOMING_LINK: ['hangup', 'hold', 'mute'],
        PSTN_DIALOUT_LINK: ['hangup', 'hold', 'mute'],
        PSTN_INCOMING_MUTE: ['mutecancel'],
        PSTN_DIALOUT_MUTE: ['mutecancel'],
        PSTN_INCOMING_HOLD: ['holdcancel'],
        PSTN_DIALOUT_HOLD: ['holdcancel'],
        PSTN_INCOMING_ARRANGE: ['dialout'],
        PSTN_DIALOUT_ARRANGE: ['dialout'],
        PSTN_BUSY: ['dialout', 'stateSelect'],
        //
        SIP_INVALID: ['dialout', 'stateSelect'],
        SIP_INCOMING_CALLING: ['hangup'],
        SIP_DIALOUT_CALLING: ['hangup'],
        SIP_INCOMING_RING: ['hangup'],
        SIP_DIALOUT_RING: ['hangup'],
        SIP_INCOMING_LINK: ['hangup', 'hold', 'mute'],
        SIP_DIALOUT_LINK: ['hangup', 'hold', 'mute'],
        SIP_INCOMING_MUTE: ['mutecancel'],
        SIP_DIALOUT_MUTE: ['mutecancel'],
        SIP_INCOMING_HOLD: ['holdcancel'],
        SIP_DIALOUT_HOLD: ['holdcancel'],
        SIP_INCOMING_ARRANGE: ['dialout'],
        SIP_DIALOUT_ARRANGE: ['dialout'],
        SIP_BUSY: ['dialout', 'stateSelect'],
        //
        WEBRTC_INVALID: ['dialout', 'disconnect', 'stateSelect'],
        WEBRTC_INCOMING_CALLING: ['hangup'],
        WEBRTC_DIALOUT_CALLING: ['hangup'],
        WEBRTC_INCOMING_RING: ['hangup', 'answer'],
        WEBRTC_DIALOUT_RING: ['hangup'],
        WEBRTC_INCOMING_LINK: ['hangup', 'hold', 'mute', 'key'],
        WEBRTC_DIALOUT_LINK: ['hangup', 'hold', 'mute', 'key'],
        WEBRTC_INCOMING_MUTE: ['mutecancel'],
        WEBRTC_DIALOUT_MUTE: ['mutecancel'],
        WEBRTC_INCOMING_HOLD: ['holdcancel'],
        WEBRTC_DIALOUT_HOLD: ['holdcancel'],
        WEBRTC_INCOMING_ARRANGE: ['dialout'],
        WEBRTC_DIALOUT_ARRANGE: ['dialout'],
        WEBRTC_DISCONNECTED: ['connect'],
        WEBRTC_BUSY: ['dialout', 'disconnect', 'stateSelect']
    }
    state = {
        size: '',
        currentStatus: 'PSTN_INVALID',
        currentStatusName: '空闲',
        keyList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'],
        loginTypeList: [{
            value: 'PSTN',
            label: '手机'
        }, {
            value: 'SIP',
            label: 'SIP话机'
        }, {
            value: 'WEBRTC',
            label: 'webrtc'
        }],
        agentStatusList: [],
        agentStatusNumber: '',
        loginType: ''
    };

    error = (msg) => {
        message.error(msg);
    }
    success = (msg) => {
        message.success(msg)
    }

    toLogin = () => {
        setTimeout(()=>{
          toLogin()
        }, 3000)
    }

    componentDidMount = () => {
        const loginUser = getLoginUser()
        const query = {
            accountId: loginUser.userName.split('@')[1],
            agentNumber: loginUser.userName.split('@')[0],
            debug: true,
            loginType: loginUser.loginType,
            password: loginUser.password
        }
        const account = query.accountId
        const exten = query.agentNumber
        const password = query.password
        const loginType = query.loginType
        this.setState({ loginType: loginType })
        this.setState({ agentStatusNumber: '0' })
        window.V7Softphone = new V7Softphone({
            accountId: account,
            agentNumber: exten,
            password: password,
            debug: true,
            loginType: loginType,
            error: (error) => {
                if (error) {
                    this.error(error.message)
                    this.toLogin()
                }
            },
            success: (agentInfo) => {
                console.log(agentInfo)
                this.getAgentPhoneBarList()
                this.getAvailableSipNumberList()
            }
        })
        window.V7Softphone.attachEvent({
            success: (msg) => {
                console.log(msg)
            },
            error: (error) => {
                console.error(error)
            },
            message: (res) => {
                const event = res.event
                console.log(res)
                if (res.type === 'kickOff') {
                    this.error('您当前的会话已经失效,导致该问题的原因是别的座席使用相同的帐号登录了')
                    this.toLogin()
                    return
                } else if (res.type === 'callStatus') {
                    this.setState({ currentStatusName: event.statusName })
                    const timeType = event.statusNumber === '5' ? 'countDown' : 'timing'
                    if (event.statusTime) {
                        this.timeRecording(timeType, event.statusTime)
                    } else {
                        this.timeRecording(timeType)
                    }
                }
                this.setState({ currentStatus: this.getCurrentStatus(event.statusNumber, event.callType) })
            }
        })
    }
    isVisibleBtn = (type) => {
        if (this.state.currentStatus) {
            return this.renderMap[this.state.currentStatus] && this.renderMap[this.state.currentStatus].indexOf(type) > -1
        }
    }
    getCurrentStatus = (statusNumber, type) => {
        const callType = type ? '_' + type.toUpperCase() : ''
        let statusName = ''
        switch (statusNumber) {
            case '0':
                statusName = this.state.loginType + '_INVALID'
                break
            case '1':
                statusName = this.state.loginType + callType + '_BUSY'
                break
            case '2':
                statusName = this.state.loginType + callType + '_CALLING'
                break
            case '3':
                statusName = this.state.loginType + callType + '_RING'
                break
            case '4':
                statusName = this.state.loginType + callType + '_LINK'
                break
            case '5':
                statusName = this.state.loginType + callType + '_ARRANGE'
                break
            case '6':
                statusName = this.state.loginType + callType + '_HOLD'
                break
            case '7':
                statusName = this.state.loginType + callType + '_MUTE'
                break
            case '8':
                statusName = this.state.loginType + callType + '_DISCONNECTED'
                break
            case '9':
                statusName = this.state.loginType + callType + '_NULL'
                break    
            default:
                statusName = this.state.loginType + callType + '_BUSY'
                break
        }
        return statusName
    }
    dialout = () => {
        if (!this.dialoutNumber) {
            this.error('请填写外呼号码')
            return
        }
        if (window.V7Softphone) {
            window.V7Softphone.callApi.dialout({
                calleeNumber: this.dialoutNumber,
                success: (res) => {
                    this.success('外呼成功')
                },
                fail: (error) => {
                    this.error(error.message)
                }
            })
        }
    }
    hangup = () => {
        if (window.V7Softphone) {
            window.V7Softphone.callApi.hangup({
                fail: function (error) {
                    console.log(error, 'error')
                }
            })
        }
    }
    holdOrUnHold = (type) => {
        if (window.V7Softphone) {
            window.V7Softphone.callApi.holdOrUnHold({
                type: type,
                fail: function (error) {
                    console.log(error, 'error')
                }
            })
        }
    }
    muteOrUnMute = (type) => {
        if (window.V7Softphone) {
            window.V7Softphone.callApi.muteOrUnMute({
                type: type,
                fail: (error) => {
                    console.log(error, 'error')

                }
            })
        }
    }
    accept = () => {
        window.V7Softphone.webPhoneApi.accept()
    }
    sendDTMF = (key) => {
        window.V7Softphone.webPhoneApi.sendDTMF(key)
    }
    connect = () => {
        window.V7Softphone.webPhoneApi.connect()
    }
    disconnect = () => {
        window.V7Softphone.webPhoneApi.disconnect()
    }
    keyDowndialout = (event) => {
        if (event.keyCode === 13) {
            this.dialout()
        }
    }

    numberInputChange = (e) => {
        this.dialoutNumber = e.target.value
    }

    getAgentPhoneBarList = () => {
        window.V7Softphone.agentApi.getAgentPhoneBarList({
            success: (res) => {
                this.setState({ agentStatusList: res.data })
            }
        })
    }

    updateAgentStatus = (value) => {
        this.setState({ agentStatusNumber: value })
        window.V7Softphone.agentApi.updateAgentStatus({
            statusNumber: value
        })
    }

    updateLoginType = (type) => {
        window.V7Softphone.agentApi.updateLoginType({
            loginType: type,
            success: () => {
                this.setState({ loginType: type })
                this.updateCurrentStatus()
                this.success('切换成功')
            },
            fail: () => {
                this.error('切换失败')
            }
        })
    }

    updateCurrentStatus () {
        const statusList = this.state.currentStatus.split('_')
        if (statusList[0] !== this.state.loginType) {
            statusList[0] = this.state.loginType
            this.setState({ currentStatus: statusList.join('_') })
        }
    }

    timeRecording = (type, timestamp) => {
        let second = 0
        if (timestamp) {
          const beginDate = new Date(timestamp)
          const endDate = new Date()
          const diff = endDate.getTime() - beginDate.getTime()
          second = diff / 1000
        }
        this.refs.phoneBarTimeRef.timerTypeChange({ timeType: type, statusTime: second })
    }




    render () {
        const { currentStatusName, keyList } = this.state;
        return (
            <div styleName="softphone">
                <div styleName="state">
                    {/* <Select value={agentStatusNumber} placeholder='请选择状态' style={{ width: '150px' }} onChange={this.updateAgentStatus} styleName={!this.isVisibleBtn('stateSelect')? 'hide' : ''}>
                        {
                            agentStatusList.map((item) => {
                                return <Option key={item.number} value={item.number}>{item.name}</Option>
                            })
                        }
                    </Select> */}
                    <span styleName='statusName'>{currentStatusName}</span>
                    <PhoneBarTimes ref = 'phoneBarTimeRef'></PhoneBarTimes>
                    {/* <Select value={loginType} placeholder='切换登陆方式' style={{ width: '150px' }} onChange={this.updateLoginType} >
                        {
                            loginTypeList.map((item) => {
                                return <Option key={item.value} value={item.value}>{item.label}</Option>
                            })
                        }
                    </Select> */}
                    <Button type="primary" disabled={!this.isVisibleBtn('disconnect')} onClick={this.disconnect.bind(this)}>
                        断开设备
                    </Button>
                    <Button type="primary" disabled={!this.isVisibleBtn('connect')} onClick={this.connect.bind(this)}>
                        重连设备
                    </Button>
                </div>
                <div styleName='oprate'>
                    <Input style={{ width: '150px' }} placeholder='请输入号码' onKeyUp={this.keyDowndialout.bind(this)} onChange={this.numberInputChange.bind(this)}></Input>
                    <Button type="primary" disabled={!this.isVisibleBtn('dialout')} onClick={this.dialout.bind(this)}>
                        外呼
                    </Button>
                    <Button type="primary" disabled={!this.isVisibleBtn('hangup')} onClick={this.hangup.bind(this)}>
                        挂机
                    </Button>
                    <Button type="primary" disabled={!this.isVisibleBtn('hold')} onClick={this.holdOrUnHold.bind(this, '1')}>
                        保持
                    </Button>
                    <Button type="primary" disabled={!this.isVisibleBtn('holdcancel')} onClick={this.holdOrUnHold.bind(this, '2')}>
                        取消保持
                    </Button>
                    <Button type="primary" disabled={!this.isVisibleBtn('mute')} onClick={this.muteOrUnMute.bind(this, '1')}>
                        静音
                    </Button>
                    <Button type="primary" disabled={!this.isVisibleBtn('mutecancel')} onClick={this.muteOrUnMute.bind(this, '2')}>
                        取消静音
                    </Button>
                    <Button type="primary" disabled={!this.isVisibleBtn('answer')} onClick={this.accept.bind(this)}>
                        接听
                    </Button>
                </div>
                <div styleName='dtmf'>
                    <div className="dtmf-tit">webrtc拨号盘</div>
                    <div styleName="dtmf-box">
                        {
                            keyList.map((key) => {
                                return <Button
                                    type="primary"
                                    key={key}
                                    disabled={!this.isVisibleBtn('key')}
                                    onClick={this.sendDTMF.bind(this, key)}
                                >{key}</Button>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

