/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-25 13:47:26
 * @LastEditTime: 2024-02-21 11:40:21
 * @FilePath: /CWTrack/cwTrack/src/core/src/metric/src/navigationTiming.ts
 */

import { METRIC_MAIN_TYPES, NAVIGATION_TIMING, NAVIGATION_TIMING_VAlUES } from "../../../../common";
import { getTiming } from "../../../../utils";
import { metricObj } from "../../global";


const timing: any = getTiming();

const timingObj = {
  [NAVIGATION_TIMING.RT]: async () => {
    // 重定向 耗时
    return timing.redirectEnd - timing.redirectStart;
  },

  [NAVIGATION_TIMING.HTML]: async () => {
    // HTML 加载完 耗时
    return timing.responseEnd - timing.startTime;
  },

  [NAVIGATION_TIMING.SSL]: async () => {
    // 安全连接 耗时
    return timing.connectEnd - timing.secureConnectionStart
  },

  [NAVIGATION_TIMING.DNS]: async () => {
    // DNS 耗时
    return timing.domainLookupEnd - timing.domainLookupStart;
  },

  [NAVIGATION_TIMING.TCP]: async () => {
    // TCP 耗时
    return timing.connectEnd - timing.connectStart;
  },

  [NAVIGATION_TIMING.TTFB]: async () => {
    // 首字节 耗时
    return timing.responseStart - timing.requestStart;
  },
  
  [NAVIGATION_TIMING.REQ]: async () => {
    // 请求耗时
    return timing.responseEnd - timing.responseStart;
  },

  [NAVIGATION_TIMING.DOM]: async () => {
    // DOM 解析 耗时
    return timing.domContentLoadedEventEnd - timing.responseEnd;
  },

  [NAVIGATION_TIMING.RES]: async () => {
    // 资源加载 耗时
    return timing.loadEventStart - timing.domContentLoadedEventEnd;
  },

  [NAVIGATION_TIMING.TOTAL]: async () => {
    // 总耗时
    return (
      (timing.loadEventEnd || timing.loadEventStart || timing.domComplete || timing.domLoading) -
      timing.navigationStart
    );
  },

  [NAVIGATION_TIMING.UNLOAD]: async () => {
    // 卸载耗时
    return timing.unloadEventEnd - timing.navigationStart;
  },
};

// 获取基础指标
function getNT(list: NAVIGATION_TIMING[] = NAVIGATION_TIMING_VAlUES) {
  return Promise.allSettled(list.map(item => {
    return timingObj[item]()
  })).then(res => {
    let obj = {} 
    list.forEach((item, index) => {
      obj[item] = (res[index] as any).value
    })
    return obj
  })
}

// 指标挂载
export function initNT() {
  metricObj.set(METRIC_MAIN_TYPES.NT, getNT)
}
