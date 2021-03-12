/*
 * @Author: Wangtao
 * @Date: 2021-03-10 20:09:44
 * @LastEditors: Wangtao
 * @LastEditTime: 2021-03-12 15:00:17
 */
const {
    AJAX_PREFIX,
    BASE_NAME,
    MOCK,
    NODE_ENV,
    PUBLIC_URL,
} = process.env;

const isDev = NODE_ENV === 'development';

export default {
    appName: 'V7 react 电话条 demo',
    // 默认ajax url前缀
    ajaxPrefix: AJAX_PREFIX || '/api',
    // 默认ajax超时时间
    ajaxTimeout: 1000 * 60,

    // 页面路由前缀
    baseName: BASE_NAME || '',

    // 是否启用mock
    mock: MOCK || isDev,

    // 静态文件前缀
    publicUrl: PUBLIC_URL || '',

    // 运行环境
    nodeEnv: NODE_ENV || 'development',

    isDev,

};
