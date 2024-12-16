/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 16:49:01
 * @LastEditTime: 2024-02-22 18:17:04
 * @FilePath: /CWTrack/cwTrack/src/type/src/options.ts
 */
import { InitReport } from "./report";
import { InitAction } from "./action";
import { EVENT_TYPES, METRIC_MAIN_TYPES } from "../../common";

export interface InitOptions extends InitReport, InitAction {
  proId: string; // 项目ID
  disabled?: boolean; // 是否禁用SDK
  httpOnlyReportFail?: boolean; // 请求只上报错误
  httpSuccessStatusList?: number[] // 请求成功状态集合
  trackArr?: EVENT_TYPES[], // 事件劫持数组
  metricArr?: METRIC_MAIN_TYPES[], // 指标数组
  metricFbTime?: number, // 兜底触发时间
}