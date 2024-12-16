/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-25 15:17:52
 * @LastEditTime: 2024-02-04 13:47:00
 * @FilePath: /CWTrack/src/utils/src/hijack.ts
 */
import { EVENT_TYPES } from "../../common";
import { EventHandler } from "../../type";
import { checkParamsType, getFlag } from "..";

const defaultProperKey = 'cwDefaultMessage_'

// 事件回调映射
const eventCbMap: { [key in EVENT_TYPES]?: any[] } = {};

// 校验是否进行劫持
export function hijackCheck(handler: EventHandler) {
  if(!handler || !getFlag(handler.type)) return false
  setHijackCallback(handler.type, handler.callback)
  return true
}

// 设置回调, 要增加回调函数时，使用这个方法
export function setHijackCallback(type: EVENT_TYPES, callback) {
  if(getFlag(type)) {
    eventCbMap[type] =eventCbMap[type] || []
    eventCbMap[type].push(callback)
  }
}

// 执行事件回调
export function executeEventCb(type: EVENT_TYPES, data) {
  if(type && eventCbMap[type]) {
    eventCbMap[type].forEach(cb => {
      checkParamsType.isFunction(cb) && cb(data)
    })
  }
}

// 携带默认参数执行回调
export function executeEventCbWithDefault(originType:EVENT_TYPES, type, params:Object = {}) {
  executeEventCb(originType, {
    [defaultProperKey + 'realEventType']: type,
    ...params,
  });
}

// 去除默认属性
export function extractDefaultProperties(obj) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key.startsWith(defaultProperKey)) {
      result[key] = obj[key];
    }
  }
  return result;
}


// 新增监听器
export function addListener(obj, eventName: EVENT_TYPES | string, cb: (e:any)=>void, options = false) {
  obj.addEventListener(eventName, cb, options)
}

// 重写属性
export function rewriteAttr(obj, attr:string, cb:(origin)=>any) {
  if(!obj) return 
  if(attr in obj) {
    let origin = obj[attr]
    let newVal = cb(origin)
    if(checkParamsType.isFunction(newVal)) obj[attr] = newVal
  }
}