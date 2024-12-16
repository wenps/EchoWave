/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 17:20:30
 * @LastEditTime: 2024-02-21 11:50:06
 * @FilePath: /CWTrack/cwTrack/src/common/src/constant.ts
 */


// 上报类型
export enum REPORT_TYPE  {
  IMG = 'img',
  BEACON = 'sendBeacon',
  AJAX ='ajax'
}

// event
export enum EVENT_TYPES {
  XHR = 'XMLHttpRequest', // xhr请求
  FETCH = 'fetch', // fetch请求
  REFRESH = 'refresh', // 刷新
  ERROR = 'error', // 报错
  UNHANDLEDREJECTION = 'unhandledrejection', // promise reject
  RESOURCE = 'resource', // 资源异常
  CLICK = 'click', // 点击
  INPUT = 'input', // 输入
  HASHCHANGE = 'hashchange', // hashchange // 变更
  HISTORY = 'history', // history 变更
}

// custom
export enum CUSTOM_TYPES {
  CUSTOM = 'custom', //  自定义
}

// other
export enum OTHER_TYPES {
  VUE = 'vue', // vue
}

// action
export enum ACTION_TYPES {
  HTTP = 'http', // 请求
  CLICK = 'click', // 点击
  INPUT = 'input', // 输入
  ROUTE = 'route', // 路由跳转
  CUSTOM = 'custom', // 自定义
  RESOURCE = 'resource', // 资源
  ERROR = 'Error', // js异常
  REFRESH = 'refresh' // 刷新
}

