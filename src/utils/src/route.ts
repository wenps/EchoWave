/*
 * @Author: xiaoshanwen
 * @Date: 2024-02-02 18:23:59
 * @LastEditTime: 2024-02-04 11:52:53
 * @FilePath: /CWTrack/src/utils/src/route.ts
 */

import { EVENT_TYPES } from "../../common";
import { __globalObj } from "./global";
import { executeEventCbWithDefault, rewriteAttr } from "./hijack";


let originHistory = __globalObj.history

// 重写History相关事件
export function rewriteHistoryEvent(originType, type, argsObj) {
  rewriteAttr(originHistory, type, (origin) => {
    return function (...args) {
      executeEventCbWithDefault(originType, type, argsObj);
      origin.apply(this, args);
    };
  })
}

export function baseRouteHijack(type: EVENT_TYPES ) {
    // pushState 重写
    rewriteHistoryEvent(type, 'pushState', {})
    // replaceStateState 重写
    rewriteHistoryEvent(type, 'replaceState', {})
}