/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-29 15:25:30
 * @LastEditTime: 2024-12-16 13:47:25
 * @FilePath: /cave/src/core/src/event/src/index.ts
 */

import { EVENT_TYPES } from "../../../../common"
import { EventHandler } from "../../../../type"
import { hijackCheck } from "../../../../utils"
import { eventHandleHijackObj } from "../utils/hijack"
import { eventHandleReportObj } from "../utils/report"


// 批量设置事件回调
export function eventHijack() {
  const eventCallbacks = generateEventFnObj(eventHandleReportObj)

  for (const type in eventCallbacks) {
    handleEventHijack({ type: type as EVENT_TYPES, callback: eventCallbacks[type as EVENT_TYPES] });
  }
}

// 处理事件回调真实函数
function handleEventHijack(handler: EventHandler) {
  // 校验是否处理回调，并收集回调函数
  if(!hijackCheck(handler)) return 
  hijack(handler.type)
}

// 真实函数
function hijack(type: EVENT_TYPES) {
  const eventHandlers = generateEventFnObj(eventHandleHijackObj)

  const eventHandler = eventHandlers[type] as () => void;
  if (eventHandler) {
    eventHandler();
  }
}

function generateEventFnObj(eventFnObj: typeof eventHandleHijackObj | typeof eventHandleReportObj) {
  // 异常监控相关事件
  const errorEvents = {
    [EVENT_TYPES.UNHANDLEDREJECTION]: eventFnObj[EVENT_TYPES.UNHANDLEDREJECTION], // Promise异常
    [EVENT_TYPES.RESOURCE]: eventFnObj[EVENT_TYPES.RESOURCE],                      // 资源加载异常  
    [EVENT_TYPES.ERROR]: eventFnObj[EVENT_TYPES.ERROR],                           // JS异常
  };

  // 网络请求相关事件
  const networkEvents = {
    [EVENT_TYPES.FETCH]: eventFnObj[EVENT_TYPES.FETCH],                           // Fetch请求
    [EVENT_TYPES.XHR]: eventFnObj[EVENT_TYPES.XHR],                              // XMLHttpRequest请求
  };

  // 路由相关事件
  const routeEvents = {
    [EVENT_TYPES.HASHCHANGE]: eventFnObj[EVENT_TYPES.HASHCHANGE],                 // Hash路由变化
    [EVENT_TYPES.HISTORY]: eventFnObj[EVENT_TYPES.HISTORY],                       // History路由变化
    [EVENT_TYPES.REFRESH]: eventFnObj[EVENT_TYPES.REFRESH],                       // 页面刷新
  };

  // 用户交互相关事件
  const userEvents = {
    [EVENT_TYPES.CLICK]: eventFnObj[EVENT_TYPES.CLICK],                          // 点击事件
    [EVENT_TYPES.INPUT]: eventFnObj[EVENT_TYPES.INPUT],                          // 输入事件
  };

  return {
    ...errorEvents,
    ...networkEvents, 
    ...routeEvents,
    ...userEvents
  };
}