/*
 * @Author: xiaoshanwen
 * @Date: 2024-02-20 15:48:12
 * @LastEditTime: 2024-02-20 18:50:39
 * @FilePath: /CWTrack/cwTrack/src/common/src/metric.ts
 */

// metric
export enum METRIC_TYPES {
  METRIC = 'metric'
}

// metric 对应的主要类型
export enum METRIC_MAIN_TYPES {
  TTI = 'time-to-interactive', // 可交互时间
  LOAD = 'load-success', // 加载完成
  FP = 'first-paint', // 首次绘制
  FCP = 'first-contentful-paint', // 首次内容绘制
  LCP = 'largest-contentful-paint', // 最大内容绘制
  FID = 'first-input-delay', // 首次输入延迟
  CLS = 'cumulative-layout-shift', // 累积布局偏移
  NT = 'navigation-timing', // 基础性能指标
  RI = 'resource-info', // 资源加载信息
}

// 基础性能指标
export enum NAVIGATION_TIMING {
  RT = 'redirect-time', // 重定向耗时
  DNS = 'DNS-time', // DNS耗时
  TCP = 'TCP-time', // TCP耗时
  TTFB = 'TTFB-time', // 响应耗时
  HTML = 'html-load-time', // HTML加载耗时
  SSL = 'ssl-time', // 安全连接耗时
  REQ = 'request-time', // 请求耗时
  DOM = 'dom-interactive-time', // DOM解析耗时
  RES = 'resource-time', // 资源加载耗时
  TOTAL = 'total-time', // 总耗时
  UNLOAD = 'unload-time', // 卸载耗时
}

export const NAVIGATION_TIMING_VAlUES = Object.values(NAVIGATION_TIMING);