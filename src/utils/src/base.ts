
/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-25 11:31:38
 * @LastEditTime: 2024-02-05 15:44:10
 * @FilePath: /CWTrack/src/utils/src/base.ts
 */
import { NAVIGATION_TYPE } from "../../common";
import { __globalObj } from "./global";

export function getPageInfo() { // 页面基础信息
  const { host, hostname, href, protocol, origin, port, pathname, search, hash } = __globalObj.location;
  const { width, height } = __globalObj.screen;
  const { language, userAgent } = navigator;
  const referrer = document.referrer
  const enterType = __globalObj.performance?.navigation?.type || 501

  return {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
    title: document.title,
    language: language.substr(0, 2),
    userAgent,
    referrer,
    enterType: NAVIGATION_TYPE[enterType],
    winScreen: `${width}x${height}`,
    docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${
      document.documentElement.clientHeight || document.body.clientHeight
    }`,
  };
}