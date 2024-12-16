/*
 * @Author: xiaoshanwen
 * @Date: 2024-02-02 09:46:09
 * @LastEditTime: 2024-02-20 16:01:54
 * @FilePath: /CWTrack/cwTrack/src/utils/src/action.ts
 */

import { EVENT_TYPES, ACTION_TYPES, REPORT_TYPE } from "../../common"
import { reportObj } from "../../core"
import { SupportTypes, HttpParams } from "../../type"

// 行为类型生成
export function actionTypeGenerate(type: SupportTypes ): ACTION_TYPES{
  switch(type) {
    // 请求
    case EVENT_TYPES.XHR:
    case EVENT_TYPES.FETCH:
      return ACTION_TYPES.HTTP
    // 点击
    case EVENT_TYPES.CLICK:
      return ACTION_TYPES.CLICK
    // 输入
    case EVENT_TYPES.INPUT:
      return ACTION_TYPES.INPUT
    // 异常
    case EVENT_TYPES.ERROR:
    case EVENT_TYPES.UNHANDLEDREJECTION:
      return ACTION_TYPES.ERROR
    // 资源
    case EVENT_TYPES.RESOURCE:
      return ACTION_TYPES.RESOURCE
    // 路由
    case EVENT_TYPES.HISTORY:
    case EVENT_TYPES.HASHCHANGE:
      return ACTION_TYPES.ROUTE
    // 刷新
    case EVENT_TYPES.REFRESH:
      return ACTION_TYPES.REFRESH
    // 自定义
    default:
      return ACTION_TYPES.CUSTOM
  }
}

// 校验是否可以入用户行为队列
export function checkActionCanPush(data, type: SupportTypes) {
  switch(type) {
    // 请求
    case EVENT_TYPES.XHR:
    case EVENT_TYPES.FETCH:
       // 上报接口不存到用户行为队列
      return reportObj[REPORT_TYPE.AJAX] !== (data as HttpParams).url
    // 自定义
    default:
      return true
  }
}