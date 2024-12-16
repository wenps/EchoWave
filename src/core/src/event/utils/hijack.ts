import { EVENT_TYPES } from "../../../../common"
import { HttpParams } from "../../../../type"
import { addListener, __globalObj, getCurrentTimestamp, rewriteAttr, debounce, executeEventCbWithDefault, baseRouteHijack, getPageInfo } from "../../../../utils"
import { optionsObj } from "../../global"

// 事件处理劫持，处理各类事件的劫持

// todo 后续考虑是否使用公共标识进行判断，当标识出现时不再劫持事件

export const eventHandleHijackObj = {
  // promise 异常事件 劫持
  [EVENT_TYPES.UNHANDLEDREJECTION]() {
    addListener(__globalObj, EVENT_TYPES.UNHANDLEDREJECTION, (e) => {
      executeEventCbWithDefault(EVENT_TYPES.UNHANDLEDREJECTION, EVENT_TYPES.UNHANDLEDREJECTION, {
        event: e
      });
    });
  },
  // 资源加载异常事件 劫持
  [EVENT_TYPES.RESOURCE]() {
    addListener(__globalObj, EVENT_TYPES.ERROR, (e) => {
      executeEventCbWithDefault(EVENT_TYPES.RESOURCE, EVENT_TYPES.RESOURCE, {
        event: e
      });
    }, true);
  },
  // js异常事件 劫持
  [EVENT_TYPES.ERROR]() {
    addListener(__globalObj, EVENT_TYPES.ERROR, (e) => {
      executeEventCbWithDefault(EVENT_TYPES.ERROR, EVENT_TYPES.ERROR, {
        event: e
      });
    });
  },
  // 刷新相关事件 劫持 
  [EVENT_TYPES.REFRESH]() {
    addListener(__globalObj, 'beforeunload', () => {
      executeEventCbWithDefault(EVENT_TYPES.REFRESH, 'beforeunload', { 
        pageInfo: getPageInfo(), message: '刷新页面' });
    });
    addListener(__globalObj, 'load', () => {
      executeEventCbWithDefault(EVENT_TYPES.REFRESH, 'load', { 
        pageInfo: getPageInfo(), message: '进入页面' });
    });
    addListener(__globalObj, 'unload', () => {
      executeEventCbWithDefault(EVENT_TYPES.REFRESH, 'unload', { 
        pageInfo: getPageInfo(), message: '关闭页面' });
    });
  },
  // hash路由 劫持
  [EVENT_TYPES.HASHCHANGE]() {
    // 初始化监听
    addListener(__globalObj, 'load', (e) => {
      executeEventCbWithDefault(EVENT_TYPES.HASHCHANGE, 'load', {
        event: e
      });
    });
    // hash监听
    addListener(__globalObj, EVENT_TYPES.HASHCHANGE, (e) => {
      executeEventCbWithDefault(EVENT_TYPES.HASHCHANGE, EVENT_TYPES.HASHCHANGE, {
        event: e
      });
    });
    // 劫持基础路由事件
    baseRouteHijack(EVENT_TYPES.HASHCHANGE);
  },
  // history路由劫持
  [EVENT_TYPES.HISTORY]() {
    // 初始化监听
    executeEventCbWithDefault(EVENT_TYPES.HISTORY, 'pushState', {});
    // popstate监听
    addListener(__globalObj, EVENT_TYPES.HISTORY, (e) => {
      executeEventCbWithDefault(EVENT_TYPES.HISTORY, 'popstate', {
        event: e
      });
    });
    // 劫持基础路由事件
    baseRouteHijack(EVENT_TYPES.HISTORY);
  },
  // 点击事件 劫持
  [EVENT_TYPES.CLICK]() {
    let debounceFn = debounce((e) => {
      executeEventCbWithDefault(EVENT_TYPES.CLICK, 'click', { event: e });
    }, 500)
    addListener(__globalObj.document, EVENT_TYPES.CLICK, debounceFn);
  },
  // 输入事件 劫持
  [EVENT_TYPES.INPUT]() {
    let debounceFn = debounce((e) => {
      executeEventCbWithDefault(EVENT_TYPES.INPUT, 'input', { event: e });
    }, 500)
    addListener(__globalObj, EVENT_TYPES.INPUT, debounceFn);
  },
  // fetch请求事件 重写
  [EVENT_TYPES.FETCH]() {
    let type = EVENT_TYPES.FETCH;
    if (!(type in __globalObj)) return;
    rewriteAttr(__globalObj, type, (origin) => {
      return function (url, config: Partial<Request> = {}) {
        let beginTime = getCurrentTimestamp();
        let data = {} as HttpParams;
        data.url = url; // 发送地址
        data.time = beginTime; // 发送时间
        data.type = type; // 发送方式
        data.method = config && config.method || 'GET'; // 默认get
        data.request = config && config.body || {}; // 请求体
        data.message = {}; // 不重要信息
        data.message.referrer = config && config.referrer; // 来源
        return origin.apply(__globalObj, [url, config]).then(res => {
          let endTime = getCurrentTimestamp();
          let cloneRes = res.clone();
          data.useTime = endTime - beginTime;
          data.status = cloneRes.status;
          cloneRes.json().then(res => {
            data.response = res;
          }).finally(()=>{
            if (!optionsObj.httpSuccessStatusList.includes(Number(data.status))) data.isFail = true;
            executeEventCbWithDefault(type, 'fetch', data);
          })
          return res;
        }).catch(err => {
          let endTime = getCurrentTimestamp();
          data.status = 5000;
          data.useTime = endTime - beginTime;
          data.response = err;
          data.isFail = true;
          executeEventCbWithDefault(type, 'fetch', data);
          throw err;
        });
      };
    });
  },
  // xhr对象 重写
  [EVENT_TYPES.XHR]() {
    let type = EVENT_TYPES.XHR;
    if (!(type in __globalObj)) return;
    let originXhrObj = __globalObj[type].prototype;
    rewriteAttr(originXhrObj, 'open', (originOpen) => {
      return function (...args) {
        let data = {} as HttpParams;
        data.type = type; // 请求类型
        data.time = getCurrentTimestamp(); // 发送时间
        data.method = args?.[0] || 'GET'; // 默认get
        data.url = args[1]; // 请求链接
        // 不重要信息
        data.message = {};
        this.data = data;
        originOpen.apply(this, args);
      };
    });
    rewriteAttr(originXhrObj, 'send', (originSend) => {
      return function (...args) {
        addListener(this, 'loadend', function () {
          let data = this.data || {};
          data.useTime = getCurrentTimestamp() - data.time; // 耗时
          data.request = args[0]; // 请求内容
          data.status = this.status; // 状态值
          // 不重要信息
          data.message.status = this.status;
          data.message.statusText = this.statusText;
          data.message.headers = this.getAllResponseHeaders();
          data.message.contentType = this.getResponseHeader('Content-Type');
          data.message.referrer = this.getResponseHeader('referrer');
          // 失败状态标注
          if (['', 'text', 'document', 'json', 'blob', 'arrayBuffer'].includes(this.responseType)) {
            if (!optionsObj.httpSuccessStatusList.includes(Number(data.status))) {
              data.isFail = true;
            } else {
              data.response = this.response && JSON.parse(this.response);
            }
          } else {
            data.isFail = true;
          }
          executeEventCbWithDefault(type, 'XMLHttpRequest', data);
        });
        originSend.apply(this, args);
      };
    });
  }
}