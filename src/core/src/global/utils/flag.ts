/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 18:46:39
 * @LastEditTime: 2024-02-18 14:49:49
 * @FilePath: /CWTrack/src/core/src/global/utils/flag.ts
 */
import { InitOptions } from "../../../../type";
import { setFlag } from "../../../../utils";
// 设置浏览器事件监听标志位
export function setTrackFlag(trackObj:InitOptions):void {
  const trackArr = trackObj.trackArr
  trackArr.forEach((item) => {
    setFlag(item, true)
  })
}