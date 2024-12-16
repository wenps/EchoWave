/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 19:45:18
 * @LastEditTime: 2024-02-04 11:12:49
 * @FilePath: /CWTrack/src/utils/src/queue.ts
 */
import { __globalObj } from "./global";

// 任务队列
export class Queue {
  private stack: any[] = [];
  private isFlushing = false;
  constructor() {}
  addFn(fn: ()=>void): void {
    if (typeof fn !== 'function') return;
    if (!('requestIdleCallback' in __globalObj || 'Promise' in __globalObj)) {
      fn();
      return;
    }
    this.stack.push(fn);
    if (!this.isFlushing) {
      this.isFlushing = true;
      if ('requestIdleCallback' in __globalObj) {
        // 优先使用requestIdleCallback
        requestIdleCallback(() => this.flushStack());
      } else {
        // 其次使用微任务上报
        Promise.resolve().then(() => this.flushStack());
      }
    }
  }
  // 清空队列
  clear() {
    this.stack = [];
  }
  // 获取队列
  getStack() {
    return this.stack;
  }
  flushStack(): void {
    // 生成副本
    const temp = this.stack.slice(0);
    this.stack = [];
    this.isFlushing = false;
    // 批量上报
    for (let i = 0; i < temp.length; i++) {
      temp[i]();
    }
  }
}
