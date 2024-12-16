/*
 * @Author: xiaoshanwen
 * @Date: 2024-02-20 16:00:54
 * @LastEditTime: 2024-02-21 11:40:35
 * @FilePath: /CWTrack/cwTrack/src/core/src/global/src/metric.ts
 */

import { METRIC_MAIN_TYPES } from "../../../../common";
import { InitOptions } from "../../../../type";

/**
 * MetricObj 类用于管理多个指标值的存储和获取。
 */
export class MetricObj {
  private map: Map<METRIC_MAIN_TYPES, any>
  fbTime: number

  /**
   * 创建一个 MetricObj 实例。
   */
  constructor() {
    this.map = new Map<METRIC_MAIN_TYPES, any>();
  }

  /**
   * 清空所有指标值。
   */
  clear() {
    this.map.clear()
  }

  /**
   * 检查指定指标值是否存在。
   * @param name - 指标名。
   * @returns 如果存在指定指标值，则返回 true，否则返回 false。
   */
  has(name: METRIC_MAIN_TYPES) {
    return this.map.has(name)
  }

  /**
   * 获取指定指标值。
   * @param name - 指标名。
   * @returns 指标值。
   */
  get(name: METRIC_MAIN_TYPES) {
    return this.map.get(name)
  }

  /**
   * 设置指定指标值。
   * @param name - 指标名。
   * @param gp - 获取指标值promise。
   */
  set(name: METRIC_MAIN_TYPES, gp) {
    if(this.map.has(name)) {
      this.map.set(name, gp())
    }
  }

  /**
   * 获取所有指标的映射对象。
   * @returns 包含所有指标的映射对象。
   */
  getMap() {
    return Object.fromEntries(this.map);
  }

  /**
   * 设置 MetricObj 实例的选项。
   * @param options - 初始化选项。
   */
  optionSet(options: InitOptions): void {
    this.fbTime = options.metricFbTime || 5000;
    (options.metricArr || []).forEach(item => {
      this.map.set(item, '')
    })
  }
}

// 初始化全局实例
const metricObj = new MetricObj()

export { metricObj };