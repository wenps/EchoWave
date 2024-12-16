/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-29 19:04:41
 * @LastEditTime: 2024-02-20 12:52:16
 * @FilePath: /CWTrack/src/utils/src/report.ts
 */

import { EVENT_TYPES,  REPORT_TYPE } from "../../common"
import { ActionData, SupportTypes, HttpParams } from "../../type"
import { getCurrentTimestamp } from "./time"
import { actionTypeGenerate } from "./action"
import { actionObj, reportObj, optionsObj } from "../../core"
import { __globalObj } from ".."
import { v4 as uuidv4 } from 'uuid';

export function commonReport(message, type) {
  const fillObj = getFillObj()
  actionObj.push({
    uuid: fillObj.uuid,
    time: getCurrentTimestamp(),
    type,
    category: actionTypeGenerate(type)
  })
  reportObj.send({
    ...fillObj,
    message,
    type,
  })
}

// 封装请求上报劫持函数
export function httpReport(result:HttpParams, type:SupportTypes) {
  const fillObj = getFillObj()
  actionObj.push({
    uuid: fillObj.uuid,
    url: result.url,
    time: getCurrentTimestamp(),
    type,
    category: actionTypeGenerate(type)
  })
  if(optionsObj.httpOnlyReportFail) {
    result.isFail && reportObj.send({
      ...fillObj,
      message: result,
      type,
    })
  } else {
    reportObj.send({
      ...fillObj,
      message: result,
      type,
    })
  }
}

// 获取补全对象
export const getFillObj  = () => {
  return {
    uuid: uuidv4(),
    proId: optionsObj.proId,
    time: getCurrentTimestamp(),
    page: __globalObj?.location?.href || '',
    action: JSON.parse(JSON.stringify(actionObj.getQueue() || []))
  }
}

// 校验是否可以发送
export function checkReportCanSend(data: ActionData, type: SupportTypes) {
  switch(type) {
    // 请求
    case EVENT_TYPES.XHR:
    case EVENT_TYPES.FETCH:
       // 上报接口不发送
      return reportObj[REPORT_TYPE.AJAX] !== data.url || ''
    // 自定义
    default:
      return true
  }
}