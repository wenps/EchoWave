/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 17:55:15
 * @LastEditTime: 2024-02-21 16:51:40
 * @FilePath: /CWTrack/cwTrack/src/utils/src/toolkit.ts
 */
import { checkParamsType } from "..";
export function typeofAny(target: any): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
// 参数类型校验
export function checkType(target: any, targetName: string, expectType: string): any {
  if (!target) return false;
  if (typeofAny(target) === expectType) return true;
  console.error(`参数类型异常: ${targetName}期望传入${expectType}类型，目前是${typeofAny(target)}类型`);
}

// 防抖
export function debounce(callback, delay) {
  if (!checkParamsType.isFunction(callback)) {
    return (_e) => {};
  }
  let timer = null;
  return function (e) {
    // 通过闭包存储timer，如果timer存在则拦截代码执行
    if (timer) return;
    timer = setTimeout(() => {
      callback(e);
      clearTimeout(timer);
      timer = null
    }, delay);
  };
}

export function getUrl(url:string) {
  let index = url.indexOf('?')
  if(index !== -1) {
    return url.substring(0, index)
  }
  return url
}
