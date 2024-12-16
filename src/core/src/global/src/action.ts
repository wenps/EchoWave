/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-23 18:37:54
 * @LastEditTime: 2024-02-05 15:45:47
 * @FilePath: /CWTrack/src/core/src/global/src/action.ts
 */
import { InitOptions, ActionData } from "../../../../type";
import { checkActionCanPush, checkParamsType } from "../../../../utils";

// 行为实例对象
export class ActionObj {
  // 队列
  queue = []
  // 最大队列容量
  maxAction:number =  30
  // 行为入队列前的操作
  beforeActionFn: null | ((data:ActionData) => ActionData) = null

  // 清空队列
  clearQueue() {
    this.queue = []
  }

  // 读取队列
  getQueue() {
    return this.queue
  }

  // 出队列
  unshift() {
    this.queue.length && this.queue.unshift()
  }

  // 入队列
  push(data: ActionData) {
    if(checkActionCanPush(data, data.type)) {
      if(checkParamsType.isFunction(this.beforeActionFn)) {
        // 支持用户调用自定义hook去操作data
        data = this.beforeActionFn(data)
      }
      if(this.queue.length > this.maxAction) {
        this.unshift()
      }
      this.queue.push(data)
      this.queue.sort((a, b) => a.time - b.time);
    }
  }

  optionsSet(options: InitOptions):void {
    options.beforeActionFn && (this.beforeActionFn = options.beforeActionFn)
    options.maxAction && (this.maxAction = options.maxAction)
  }
}

// 初始化全局实例
const actionObj = new ActionObj()

export { actionObj };
