/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 17:38:07
 * @LastEditTime: 2024-02-20 16:32:39
 * @FilePath: /CWTrack/cwTrack/src/core/src/global/src/options.ts
 */

import { InitOptions } from "../../../../type";
import { setTrackFlag } from "../utils/flag";

// 基础信息实例对象
export class OptionsObj {
  proId // 项目唯一标识ID
  disabled // 是否禁用上报
  httpOnlyReportFail // 是否只上报错误接口
  httpSuccessStatusList // 请求上报成功状态列表
  optionSet(options: InitOptions):void {
    // 设置标识位
    setTrackFlag(options)
    this.disabled = options.disabled
    this.proId = options.proId
    this.httpOnlyReportFail = options.httpOnlyReportFail
    this.httpSuccessStatusList = options.httpSuccessStatusList
  }
}

// 初始化全局实例
const optionsObj = new OptionsObj()

export { optionsObj }