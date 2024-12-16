/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-29 15:23:56
 * @LastEditTime: 2024-12-16 13:51:07
 * @FilePath: /cave/src/core/src/event/utils/report.ts
 */
import { EVENT_TYPES } from "../../../../common";
import {
  resourceParamsGenerate,
  httpParamsGenerate,
  commonReport,
  httpReport,
  hashParamsGenerate,
  historyParamsGenerate,
  checkParamsType,
  extractDefaultProperties,
  generateErrorDetailsMessage
} from "../../../../utils";

// 事件处理上报对象，处理各类基础事件的上报
export const eventHandleReportObj = {
  // promise 异常上报
  [EVENT_TYPES.UNHANDLEDREJECTION](params: { event: PromiseRejectionEvent | Error }): void {
    let errMessage, errorDetailsMessage;
    let e = params.event;
    if (e instanceof PromiseRejectionEvent) {
      errMessage = e.reason.message || e.reason.stack;
      errorDetailsMessage = generateErrorDetailsMessage(e.reason)
    } else if (checkParamsType.isString(e)) {
      errMessage = String(e);
    }
    const message = errMessage ? JSON.stringify(errMessage) : 'undefined';
    commonReport({
      ...extractDefaultProperties(params),
      errorType: EVENT_TYPES.UNHANDLEDREJECTION,
      type: (e as any)?.type || '',
      message,
      errorDetailsMessage
    }, EVENT_TYPES.UNHANDLEDREJECTION);
  },

  // 资源异常上报
  [EVENT_TYPES.RESOURCE](params: { event: Event }): void {
    let e = params.event;
    const target = e.target;
    if (!(target as any)?.localName) return;
    if (target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement) {
      let resourceErrObj = resourceParamsGenerate(target);
      commonReport({
        ...extractDefaultProperties(params),
        ...resourceErrObj
      }, EVENT_TYPES.RESOURCE);
    }
  },

  // js 错误上报
  [EVENT_TYPES.ERROR](params: { event: ErrorEvent }): void {
    let e = params.event;
    if (e instanceof ErrorEvent) {
      const error = e.error;
      let errorDetailsMessage = generateErrorDetailsMessage(error)
      let message = {
        message: e.message || error.message || error.stack,
        errorType: error?.constructor?.name || '',
        type: e.type,
        filename: e.filename,
        errorDetailsMessage
      };
      const jsErrObj = {
        ...extractDefaultProperties(params),
        ...message,
      };
      commonReport(jsErrObj, EVENT_TYPES.ERROR);
    }
  },

  // 刷新相关事件 监听
  [EVENT_TYPES.REFRESH](message) {
    commonReport(message, EVENT_TYPES.REFRESH);
  },

  // hash路由 劫持
  [EVENT_TYPES.HASHCHANGE](e) {
    const result = hashParamsGenerate(e);
    commonReport({
      ...extractDefaultProperties(e),
      ...result
    }, EVENT_TYPES.HASHCHANGE);
  },

  // history路由 劫持
  [EVENT_TYPES.HISTORY](e) {
    const result = historyParamsGenerate(e);
    commonReport({
      ...extractDefaultProperties(e),
      ...result
    }, EVENT_TYPES.HISTORY);
  },

  // 点击相关事件 监听
  [EVENT_TYPES.CLICK](data) {
    let { event } = data;
    let target = event?.target || {};
    let message = {
      ...extractDefaultProperties(data),
      baseURI: target.baseURI,
      id: target.id,
      className: target.className,
      localName: target.localName,
      x: event.x,
      y: event.y,
      screenX: event.screenX,
      screenY: event.screenY,
      pointerType: event.pointerType
    };
    commonReport(message, EVENT_TYPES.CLICK);
  },

  // 输入相关事件 监听
  [EVENT_TYPES.INPUT](data) {
    let { event } = data;
    let target = event?.target || {};
    let message = {
      ...extractDefaultProperties(data),
      baseURI: target.baseURI,
      id: target.id,
      value: target.value || '',
      className: target.className,
      localName: target.localName,
    };
    commonReport(message, EVENT_TYPES.INPUT);
  },


  // fetch 上报
  [EVENT_TYPES.FETCH](data): void {
    // 生成上报基础参数
    const message = httpParamsGenerate(data);
    httpReport({
      ...extractDefaultProperties(data),
      ...message
    }, EVENT_TYPES.FETCH);
  },

  // XMLHttpRequest 上报
  [EVENT_TYPES.XHR](data): void {
    // 生成上报基础参数
    const message = httpParamsGenerate(data);
    httpReport({
      ...extractDefaultProperties(data),
      ...message
    }, EVENT_TYPES.XHR);
  }
};