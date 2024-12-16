/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 19:32:21
 * @LastEditTime: 2024-02-05 15:49:11
 * @FilePath: /CWTrack/src/core/src/global/src/report.ts
 */
import axios from "axios";
import { REPORT_TYPE } from "../../../../common";
import { InitOptions, ReportData } from "../../../../type";
import { checkReportCanSend, isBrowserEnv, Queue, __globalObj } from "../../../../utils";
import { checkParamsType } from "../../../../utils/src/typeCheck";
import { optionsObj } from './options'

// todo 队列优化

// 上报实例对象
export class ReportObj {
  queue: Queue = new Queue(); // 消息队列
  topReport = REPORT_TYPE.BEACON; // 优先上报方式

  // 上报地址
  [REPORT_TYPE.BEACON] = '';
  [REPORT_TYPE.IMG] = '';
  [REPORT_TYPE.AJAX] = '';

  beforeReportFn = null

  // 上报前置操作
  beforeReport = (data: ReportData) => {
    if(checkParamsType.isFunction(this.beforeReportFn)) {
      // 支持用户调用自定义hook去操作data
      data = this.beforeReportFn(data)
    }
    return data
  }


  // 上报函数映射
  sendMap = {
    [REPORT_TYPE.BEACON]: (url = '', params) => {
      return !!navigator?.sendBeacon(url, JSON.stringify({ params, }));
    },
    [REPORT_TYPE.IMG]: (url = '', params, cb = null) => {
      const requestFun = () => {
        const img = new Image();
        const spliceStr = url.indexOf('?') === -1 ? '?' : '&';
        img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(params))}`;
        img.onerror = cb && cb()
      };
      this.queue.addFn(requestFun);
    },
    [REPORT_TYPE.AJAX]:  async(url = '', params, cb = null): Promise<void> => {
      const requestFun = () => {
        axios({
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
            url: url,
            data: params
        }).catch(() => {
          cb && cb()
        })
      };
      this.queue.addFn(requestFun);
    }
  }

  // 真实上报函数
  send(data) {
    if(!checkReportCanSend(data.message, data.type)) return console.error('CWTrack: 不上报上报接口')
    if(!optionsObj.proId) return console.error('CWTrack: 未配置项目ID')
    if(!this.topReport) return console.error('CWTrack: 未设置默认方式')
    if((this.topReport && !this[this.topReport])) return console.error('CWTrack: 默认上报方式，上报地址未填')
    if(isBrowserEnv && !optionsObj.disabled) {
      // 上报参数前置处理
      const params = this.beforeReport(data)
      // sendBeacon 上报，优先级：sendBeacon > img > ajax
      if(this.topReport === REPORT_TYPE.BEACON) {
        const value = this.sendMap[REPORT_TYPE.BEACON](this[REPORT_TYPE.BEACON], params)
        if(!value) {
          let cb = () => {
            if(this[REPORT_TYPE.AJAX]) this.sendMap[REPORT_TYPE.AJAX](this[REPORT_TYPE.AJAX], params)
          }
          if(this[REPORT_TYPE.IMG]) this.sendMap[REPORT_TYPE.IMG](this[REPORT_TYPE.IMG], params, cb)
        }
      }
      // img 上报，优先级：img > sendBeacon > ajax
      if(this.topReport === REPORT_TYPE.IMG) {
        let cb = () => {
          if(this[REPORT_TYPE.BEACON]) {
            let value = this.sendMap[REPORT_TYPE.BEACON](this[REPORT_TYPE.BEACON], params)
            if(value) return
          }
          if(this[REPORT_TYPE.AJAX]) this.sendMap[REPORT_TYPE.AJAX](this[REPORT_TYPE.AJAX], params)
        }
        this.sendMap[REPORT_TYPE.IMG](this[REPORT_TYPE.IMG], params, cb)
      }
      // ajax 上报，优先级：ajax > sendBeacon > img
      if(this.topReport === REPORT_TYPE.AJAX) {
        let cb = () => {
          if(this[REPORT_TYPE.BEACON]) {
            let value = this.sendMap[REPORT_TYPE.BEACON](this[REPORT_TYPE.BEACON], params)
            if(value) return
          }
          if(this[REPORT_TYPE.IMG]) this.sendMap[REPORT_TYPE.IMG](this[REPORT_TYPE.IMG], params)
        }
        this.sendMap[REPORT_TYPE.AJAX](this[REPORT_TYPE.AJAX], params, cb)
      }
    }
  }

  // 初始化参数
  optionSet(options: InitOptions):void{
    this.topReport = options.topReport
    this[REPORT_TYPE.AJAX] = options[REPORT_TYPE.AJAX]
    this[REPORT_TYPE.IMG] = options[REPORT_TYPE.IMG]
    this[REPORT_TYPE.BEACON] = options[REPORT_TYPE.BEACON]
    this.beforeReportFn = options.beforeReportFn
  }
}

// 初始化全局实例
const reportObj = new ReportObj()

export { reportObj };
