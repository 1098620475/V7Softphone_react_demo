/*
 * @Author: Wangtao
 * @Date: 2021-03-10 20:09:44
 * @LastEditors: Wangtao
 * @LastEditTime: 2021-03-12 11:28:26
 */
import {storage} from 'ra-lib';
import cfg from 'src/config';

const {baseName} = cfg;
const sessionStorage = window.sessionStorage;

const LOGIN_USER_STORAGE_KEY = 'login-user';


/**
 * 浏览器跳转，携带baseName
 * @param href
 * @returns {string|*}
 */
export function locationHref(href) {
    if (href?.startsWith('http')) return window.location.href = href;

    return window.location.href = `${baseName}${href}`;
}

/**
 * 判断是否有权限
 * @param code
 */
export function hasPermission(code) {
    const loginUser = getLoginUser();
    return loginUser?.permissions?.includes(code);
}

/**
 * 设置当前用户信息
 * @param loginUser 当前登录用户信息
 */
export function setLoginUser(loginUser = {}) {
    // 将用户属性在这里展开，方便查看系统都用到了那些用户属性
    const {userName, password, loginType} = loginUser;
    const userStr = JSON.stringify({
       userName,
       password,
       loginType
    });

    sessionStorage.setItem(LOGIN_USER_STORAGE_KEY, userStr);
}

/**
 * 获取当前用户信息
 * @returns {any}
 */
export function getLoginUser() {
    const loginUser = sessionStorage.getItem(LOGIN_USER_STORAGE_KEY);

    return loginUser ? JSON.parse(loginUser) : null;
}

/**
 * 判断用户是否登录 前端简单通过登录用户是否存在来判断
 * @returns {boolean}
 */
export function isLogin() {
    // 如果当前用户存在，就认为已经登录了
    return !!getLoginUser();
}

/**
 * 进入首页
 */
export function toHome() {
    // 跳转页面，优先跳转上次登出页面
    // const lastHref = window.sessionStorage.getItem('last-href');
    const lastHref = '/softphone'
    locationHref(lastHref || '/');
}

/**
 * 跳转到登录页面
 */
export function toLogin() {
    const loginPath = '/login';

    // 判断当前页面是否已经是login页面，如果是，直接返回，不进行跳转，防止出现跳转死循环
    const pathname = window.location.pathname;
    const isLogin = pathname.indexOf(loginPath) !== -1;
    if (isLogin) return null;

    // 清除相关数据
    storage.session.clear();
    sessionStorage.clear();
    sessionStorage.setItem('last-href', '/softphone');
    
    locationHref(loginPath);

    return null;
}

