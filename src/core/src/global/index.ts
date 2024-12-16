/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 17:37:42
 * @LastEditTime: 2024-02-20 16:32:31
 * @FilePath: /CWTrack/cwTrack/src/core/src/global/index.ts
 */

// global 文件夹负责初始化各个基础对象，并导出

import { InitOptions } from "../../../type"
import { actionObj } from "./src/action"
import { optionsObj } from "./src/options"
import { reportObj } from "./src/report"
import { metricObj } from "./src/metric"

// 初始化全局参数对象
export function initGlobalObj (options: InitOptions) {
  // 行为队列实例配置
  actionObj.optionsSet(options)
  // 上报对象实例配置
  reportObj.optionSet(options)
  // 指标对象实例配置
  metricObj.optionSet(options)
  // 参数对象实例配置
  optionsObj.optionSet(options)
}

export * from "./src/action"
export * from "./src/options"
export * from "./src/report"
export * from "./src/metric"