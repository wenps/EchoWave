/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-26 16:07:28
 * @LastEditTime: 2024-02-04 14:02:04
 * @FilePath: /CWTrack/src/utils/src/paramsGenerate.ts
 */
import { getCommon, setCommon, __globalObj } from "..";
import { RouteParams, RoutePathObj, HttpParams, ResourceParams } from "../../type";
import { getPageInfo } from "./base";
import { getCurrentTimestamp } from "./time";

// 资源上报参数
export function resourceParamsGenerate(target):ResourceParams {
  let message, url
  if (target instanceof HTMLScriptElement) {
    url = target.src || '';
    message = '脚本加载错误'
  } else if (target instanceof HTMLLinkElement) {
    url = target.href || '';
    message = '样式表加载错误'
  } else if (target instanceof HTMLImageElement) {
    url = target.src || '';
    message = '图像加载错误'
  }
  const resourceType = target.localName
  const resourceErrObj = {
    time: getCurrentTimestamp(),
    resourceType,
    message,
    url,
  }
  return resourceErrObj
}

// 请求上报参数
export function httpParamsGenerate(data):HttpParams {
  // 后续http相关埋点数据生成过滤要放到这里
  return data
}

// history路由上报参数
export function historyParamsGenerate(data): RouteParams {
  return generateParams('history', data);
}

// hash路由上报参数
export function hashParamsGenerate(data): RouteParams {
  return generateParams('hash', data);
}

function generateParams(type, data) {
  const locationHref = __globalObj?.location?.href || '';
  const fromRoute = getCommon(type === 'history' ? 'History' : 'Hash'); // 来源路由信息
  const oPath = fromRoute || {
    fullPath: locationHref,
    title: __globalObj?.document?.title || '',
    time: getCurrentTimestamp(),
  } as RoutePathObj;
  const nPath = {
    fullPath: locationHref,
    title: __globalObj?.document?.title || '',
    time: getCurrentTimestamp(),
  } as RoutePathObj;
  const message: RouteParams = {
    oPath,
    nPath,
    type: data.type || '',
    isLoad: !fromRoute,
    pageInfo: getPageInfo(),
    stayTime: nPath.time - oPath.time
  };
  setCommon(type === 'history' ? 'History' : 'Hash', nPath);
  return message;
}