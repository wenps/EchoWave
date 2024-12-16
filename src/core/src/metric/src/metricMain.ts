import { METRIC_MAIN_TYPES } from "../../../../common";
import { metricFallBack } from "../../../../utils";
import { metricObj } from "../../global";

// 定义 LayoutShift 接口，继承自 PerformanceEntry
export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// 获取首次绘制（First Paint）性能条目的 Promise
export function getFP() {
  return new Promise<PerformanceEntry>((resolve, reject) => {
    let entry
    let observer = new PerformanceObserver((entryList) => {
      for (const entryData of entryList.getEntriesByName('first-paint')) {
        entry = entryData
        resolve(entry);
      }
    })
    observer.observe({ type: 'paint', buffered: true });
    metricFallBack({
      observer,
      fb: () => {
        return entry
      },
      value: entry,
      resolve,
      reject,
      key: METRIC_MAIN_TYPES.FP
    })
  });
}

// 初始化首次绘制（First Paint）
export function initFP() {
  metricObj.set(METRIC_MAIN_TYPES.FP, getFP);
}

// 获取首次内容绘制（First Contentful Paint）性能条目的 Promise
export function getFCP() {
  return new Promise<PerformanceEntry>((resolve, reject) => {
    let entry
    let observer = new PerformanceObserver((entryList) => {
      for (const entryData of entryList.getEntriesByName('first-contentful-paint')) {
        entry = entryData
        resolve(entry);
      }
    })
    observer.observe({ type: 'paint', buffered: true });
    metricFallBack({
      observer,
      fb: () => {
        return entry
      },
      value: entry,
      resolve,
      reject,
      key: METRIC_MAIN_TYPES.FCP
    })
  });
}

// 初始化首次内容绘制（First Contentful Paint）
export function initFCP() {
  metricObj.set(METRIC_MAIN_TYPES.FCP, getFCP);
}

// 获取最大内容绘制（Largest Contentful Paint）性能条目的 Promise
export function getLCP() {
  return new Promise<PerformanceEntry>((resolve, reject) => {
    let entries, entry
    let observer = new PerformanceObserver((entryList) => {
      entries = entryList.getEntries();
      entry = entries[entries.length - 1];
      resolve(entry);
    })
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    metricFallBack({
      observer,
      fb: () => {
        return entry
      },
      value: entry,
      resolve,
      reject,
      key: METRIC_MAIN_TYPES.LCP
    })
  });
}

// 初始化最大内容绘制（Largest Contentful Paint）
export function initLCP() {
  metricObj.set(METRIC_MAIN_TYPES.LCP, getLCP);
}

// 获取首次输入延迟（First Input Delay）性能条目的 Promise
export function getFID() {
  return new Promise<{ delay: number; entry: PerformanceEntry }>((resolve, reject) => {
    let entries, entry, delay
    const observer = new PerformanceObserver((entryList) => {
      entries = entryList.getEntries();
      entry = entries[entries.length - 1];
      delay = (entry as any).processingStart - entry.startTime;
      resolve({ delay, entry });
    })
    observer.observe({ type: 'first-input', buffered: true });
    metricFallBack({
      observer,
      fb: () => {
        return delay && entry
      },
      value: { delay, entry },
      resolve,
      reject,
      key: METRIC_MAIN_TYPES.FID
    })
  });
}

// 初始化首次输入延迟（First Input Delay）
export function initFID() {
  metricObj.set(METRIC_MAIN_TYPES.FID, getFID);
}

// 获取累计布局偏移（Cumulative Layout Shift）性能条目的 Promise
export function getCLS() {
  return new Promise<{ entry: LayoutShift; clsValue: number; clsEntries: any[] }>((resolve, reject) => {
    let clsValue = 0;
    let clsEntries = [];

    let sessionValue = 0;
    let sessionEntries: Array<LayoutShift> = [];

    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            clsEntries = sessionEntries;
            resolve({ entry, clsValue, clsEntries });
          }
        }
      }
    })
    observer.observe({ type: 'layout-shift', buffered: true });
    metricFallBack({
      observer,
      fb: () => {
        return clsValue > 0
      },
      value: { entry: clsEntries[0], clsValue, clsEntries },
      resolve,
      reject,
      key: METRIC_MAIN_TYPES.CLS
    })
  });
}

// 初始化累计布局偏移（Cumulative Layout Shift）
export function initCLS() {
  metricObj.set(METRIC_MAIN_TYPES.CLS, getCLS);
}