/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 17:37:42
 * @LastEditTime: 2024-02-21 17:03:17
 * @FilePath: /CWTrack/cwTrack/src/core/src/index.ts
 */
import { InitOptions } from '../../type'
import { initGlobalObj } from './global'
// 埋点初始化函数
export function init(options: InitOptions) {
  if(options.disabled) return console.log('上报禁用')
  initGlobalObj(options) // 初始化核心实例
}


export {optionsObj, reportObj, actionObj, metricObj} from './global' // 核心对象
export * from './event' // 事件劫持函数
export * from './custom' // 自定义上报函数
export * from './metric' // 指标处理函数