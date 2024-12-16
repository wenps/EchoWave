/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-25 14:52:02
 * @LastEditTime: 2024-01-25 14:53:06
 * @FilePath: /CWTrack/src/type/src/hijack.ts
 */

import { EVENT_TYPES } from "../../common";

// 事件处理对象类型
export interface EventHandler {
  type: EVENT_TYPES; // 事件类型
  callback: any; // 回调
}