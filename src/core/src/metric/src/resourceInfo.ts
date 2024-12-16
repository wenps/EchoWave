/*
 * @Author: xiaoshanwen
 * @Date: 2024-02-20 15:17:52
 * @LastEditTime: 2024-02-21 16:51:17
 * @FilePath: /CWTrack/cwTrack/src/core/src/metric/src/resourceInfo.ts
 */
import { METRIC_MAIN_TYPES, REPORT_TYPE } from "../../../../common";
import { getBasePerformance, getUrl } from "../../../../utils";
import { metricObj, reportObj } from "../../global";

const getRI = async () => {
  // 静态资源
  return new Promise((resolve, _reject) => {
    const resource = getBasePerformance().getEntries()
    let cacheHit = 0;
    let formatResourceArray = [] as any[]
    resource.forEach((item: any) => {
      // 上报接口资源不上报
      if(getUrl(item.name) !== reportObj[REPORT_TYPE.IMG]) {
        if (item.duration == 0 && item.transferSize !== 0) cacheHit++;
        formatResourceArray.push({
          startTime: item.startTime, //开始
          EndTime: item.responseEnd, //结束
          useTime: item.duration, //消耗
          path: item.name, //资源地址
          resourceType: item.initiatorType, //资源类型
          size: item.decodedBodySize, // 文件大小
          transferSize: item.transferSize, //传输大小
          initiatorType: item.initiatorType, // 加载方式
          requestTime: item.responseStart - item.requestStart, // 请求时长
          responseTime: item.responseEnd - item.responseStart, // 相应时长
          loadTime: item.responseEnd || 0 - item.responseStart - 0 // 加载时长
        });
      }
    });
    resolve({ formatResourceArray, cacheHit: (cacheHit / resource.length).toFixed(2) });
  });
}

// 资源挂载
export function initRI() {
  metricObj.set(METRIC_MAIN_TYPES.RI, getRI)
}