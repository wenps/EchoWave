/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 18:18:09
 * @LastEditTime: 2024-02-02 16:49:24
 * @FilePath: /CWTrack/src/utils/src/global.ts
 */
import { Window } from "../../type";
import { checkParamsType } from "./typeCheck";

// 获取全局对象
export function getGlobal(): Window {
  return window as unknown as Window
}

// 生成临时变量
export function getGlobalTemp() {
  __globalObj.__cwTemp = __globalObj.__cwTemp || {}
  return __globalObj.__cwTemp
}

// 是否浏览器环境
export const isBrowserEnv = checkParamsType.isWindow(
  typeof window !== 'undefined' ? window : 0
);

// 获取全局对象
const __globalObj = getGlobal()
// 生成临时变量
const __globalTempObj = getGlobalTemp()

export {__globalObj, __globalTempObj}


// 标志位
__globalTempObj.flag = __globalTempObj.flag || {}

let flagObj = __globalTempObj.flag

export function setFlag (key:string, isSet:boolean) {
  flagObj[key] = isSet
}

export function getFlag (key:string) {
  return !!flagObj[key]
}

// 公共临时对象
__globalTempObj.common = __globalTempObj.common || {}

let common = __globalTempObj.common

export function setCommon (key:string, value: any) {
  common[key] = value
}

export function getCommon  (key:string) {
  return common[key]
}