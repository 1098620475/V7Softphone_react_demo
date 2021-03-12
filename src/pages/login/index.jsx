import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Input, Button, Form, Select } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { setLoginUser, toHome } from 'src/commons';
import config from 'src/commons/config-hoc';
import Banner from './banner/index';
import './style.less';

const {Option} = Select

@config({
    path: '/login',
    ajax: true,
    noFrame: true,
    noAuth: true,
})
export default class Login extends Component {
    state = {
        loading: false,
        message: '',
        isMount: false,
    };

    componentDidMount () {
        // 开发时方便测试，填写表单
        if (process.env.NODE_ENV === 'development' || process.env.PREVIEW) {
            this.form.setFieldsValue({ userName: '', password: '', loginType: 'WEBRTC' });
        }
        setTimeout(() => this.setState({ isMount: true }), 300);
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const { userName, password, loginType } = values;
        const params = {
            userName,
            password,
            loginType
        };

        setLoginUser({
            userName: params.userName,
            password: params.password,
            loginType: params.loginType
        });
        toHome();
    };

    render () {
        const { loading, message, isMount } = this.state;
        const formItemStyleName = isMount ? 'form-item active' : 'form-item';

        return (
            <div styleName="root">
                <Helmet title="欢迎登陆" />
                <div styleName="banner">
                    <Banner />
                </div>
                <div styleName="box">
                    <Form
                        ref={form => this.form = form}
                        name="login"
                        className='inputLine'
                        onFinish={this.handleSubmit}
                    >
                        <div styleName={formItemStyleName}>
                            <div styleName="header">欢迎登录</div>
                        </div>
                        <div styleName={formItemStyleName}>
                            <Form.Item
                                name="userName"
                                rules={[{ required: true, message: '坐席号@账户编号' }]}
                            >
                                <Input allowClear autoFocus prefix={<UserOutlined className="site-form-item-icon" />} placeholder="坐席号@账户编号" />
                            </Form.Item>
                        </div>
                        <div styleName={formItemStyleName}>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '座席密码' }]}
                            >
                                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="座席密码" />
                            </Form.Item>
                        </div>
                        <div styleName={formItemStyleName}>
                            <Form.Item
                                name='loginType'
                                rules={[{ required: true, message: '' }]}
                            >
                                <Select placeholder="登陆方式">
                                    <Option value="PSTN">手机方式</Option>
                                    <Option value="SIP">SIP话机</Option>
                                    <Option value="WEBRTC">软电话</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <div styleName={formItemStyleName}>
                            <Form.Item shouldUpdate={true} style={{ marginBottom: 0 }}>
                                {() => (
                                    <Button
                                        styleName="submit-btn"
                                        loading={loading}
                                        type="primary"
                                        htmlType="submit"
                                        disabled={
                                            !this.form?.isFieldsTouched(true) ||
                                            this.form?.getFieldsError().filter(({ errors }) => errors.length).length
                                        }
                                    >
                                        登录
                                    </Button>
                                )}
                            </Form.Item>
                        </div>
                    </Form>
                    <div styleName="error-tip">{message}</div>
                </div>
            </div>
        );
    }
}

