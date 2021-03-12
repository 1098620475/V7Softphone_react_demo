import React from 'react';
import {CodeFilled} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import config from 'src/commons/config-hoc';
import {Layout, FullScreen, HeaderSetting, isMobile} from 'ra-lib';
import HeaderUser from './header-user';
import logo from './logo.png';
import cfg from 'src/config';
import './style.less';

const {isDev} = cfg;

export default config({
    connect: state => ({layoutState: state.layout}),
})(function LayoutFrame(props) {
    const {action, layoutState} = props;

    return (
        <Layout
            {...props}
            logo={logo}
            headerRight={
                <>
                    {isDev ? (<Link styleName="action" to="/gen"><CodeFilled/></Link>) : null}
                    {isMobile ? null : (
                        <>
                            <div styleName="action"><FullScreen/></div>
                            <HeaderSetting layoutState={layoutState} action={action}/>
                        </>
                    )}
                    <HeaderUser/>
                </>
            }
        />
    );
});
