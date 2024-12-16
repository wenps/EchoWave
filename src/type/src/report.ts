/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-18 10:41:47
 * @LastEditTime: 2024-02-20 16:10:01
 * @FilePath: /CWTrack/cwTrack/src/type/src/report.ts
 */
import { REPORT_TYPE } from "../../common"
import { ActionData } from "./action";
import { SupportTypes } from "./global";

export type ReportData = {
  proId: string, // 项目ID
  uuid: string, // 唯一标识id
  time: number, // 触发事件
  page: string, // 页面地址
  type: SupportTypes, // 支持类型
  action?: ActionData[], // 行为队列
  message: any, // 上报信息
  [key: string]: any,
}

export type InitReport = {
  beforeReportFn?: (data:ReportData) => ReportData, // 上报前请求函数
  topReport: REPORT_TYPE; // 优先上报方式
  ajax?: string; // ajax上报地址
  img?: string; // 图片上报地址
  sendBeacon?: string; // sendBeacon上报地址
}

export type HttpParams = {
  useTime: number; // 时长
  url: string; // 地址
  type: string; // 请求类型，fetch 或 xhr
  time: number; // 发送时间
  message: any; // 不重要信息
  method: string; // 请求方法
  status: string | number; // 请求状态
  isFail: boolean; // 是否请求失败
  request?: any;
  response?: any;
  [key: string]: any
}

export type ResourceParams = {
  time: number, // 发送时间
  resourceType: string, // 资源类型
  message: string, // 内容
  url: string, // 资源url
}

export type RouteParams = {
  oPath: RoutePathObj, // 原始路径
  nPath: RoutePathObj, // 前往路径
  isLoad: boolean, // 是否初始化
  stayTime: number, // 停留时间
  type: string, // 类型
  pageInfo: any, // 页面信息
}

// 哈希地址对象类型
export type RoutePathObj = {   
  fullPath: string, // 完整路径
  title: string, // 标题
  time: number // 进入时间
}