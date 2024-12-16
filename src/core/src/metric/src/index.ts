/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-29 15:13:32
 * @LastEditTime: 2024-02-21 17:05:16
 * @FilePath: /CWTrack/cwTrack/src/core/src/metric/src/index.ts
 */

import { METRIC_TYPES } from "../../../../common"
import { getFillObj } from "../../../../utils"
import { metricObj, reportObj } from "../../global"
import { initFP, initFID, initFCP, initCLS, initLCP } from "./metricMain";
import { initNT } from "./navigationTiming";
import { initRI } from "./resourceInfo";

// 加载后初始化相关指标
const afterLoadMetricInit = (cb) => {
  if (document.readyState === 'complete') {
    setTimeout(cb);
  } else {
    window.addEventListener('pageshow', cb, { once: true, capture: true });
  }
}

// 指标上报
export function metricReport(type = METRIC_TYPES.METRIC) {
  initLCP()
  initCLS()
  afterLoadMetricInit(() => {
    initNT()
    initRI()
    initFP()
    initFID()
    initFCP()
    metricSend(type)
  })
}
// 获取指标数据
async function getMetricData() {
  const entries = Object.entries(metricObj.getMap());
  const promises = entries.map(([_key, value]) => {
    if (value instanceof Promise) {
      return value;
    } else {
      return Promise.resolve(value);
    }
  });

  const results = await Promise.allSettled(promises);

  const newObj = {};
  results.forEach((result, index) => {
    const [key] = entries[index];
    newObj[key] = result.status === 'fulfilled' ? result.value : result.reason;
  });

  return newObj;
}

// 真实上报
export async function metricSend(type = METRIC_TYPES.METRIC) {
  let metric = await getMetricData();
  let fullObj = getFillObj()
  reportObj.send({
    ...fullObj,
    type, // 上报事件类型
    metric,
  })
}