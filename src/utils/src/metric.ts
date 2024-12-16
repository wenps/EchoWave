
/*
 * @Author: xiaoshanwen
 * @Date: 2024-02-21 10:49:20
 * @LastEditTime: 2024-02-21 11:22:23
 * @FilePath: /CWTrack/cwTrack/src/utils/src/metric.ts
 */
import { METRIC_MAIN_TYPES } from "../../common";
import { metricObj } from "../../core";

type metricFbObj = {observer: PerformanceObserver, fb: ()=>boolean, value: any, resolve, reject: (ErrorConstructor) => void, key: METRIC_MAIN_TYPES}
export function metricFallBack(obj: metricFbObj) {
  setTimeout(() => {
    obj.observer.disconnect();
  
    if ( obj.fb()) {
      obj.resolve( obj.value);
    } else {
      obj.reject(new Error(`No ${obj.key} found.`));
    }
  }, metricObj.fbTime);
}