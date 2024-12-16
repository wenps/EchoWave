/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-25 13:39:01
 * @LastEditTime: 2024-02-04 20:15:52
 * @FilePath: /CWTrack/src/utils/src/performance.ts
 */

import { __globalObj } from "./global";

// 旧版本性能指标
const originTiming = __globalObj.performance.timing;
// 新版本性能指标
const currentTiming = __globalObj.performance.getEntriesByType('navigation');

export function getTiming() {
    return currentTiming.length ? currentTiming[0]:originTiming
}
export function getBasePerformance() {
    return __globalObj.performance
}