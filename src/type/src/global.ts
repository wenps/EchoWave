/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-17 18:20:42
 * @LastEditTime: 2024-02-20 12:50:26
 * @FilePath: /CWTrack/src/type/src/global.ts
 */
import { EVENT_TYPES, CUSTOM_TYPES, METRIC_TYPES, OTHER_TYPES } from "../../common";
export interface Window {
  chrome: {
    app: {
      [key: string]: any;
    };
  };
  __cwTemp: {
    [key: string]: any;
  };
  screen: any,
  location: any,
  history: any;
  innerWidth: any;
  innerHeight: any;
  onpopstate: any;
  performance: {
    [key:string]: any
  };
  document: any;
  XMLHttpRequest: any;
  addEventListener: any;
}

export type SupportTypes = EVENT_TYPES | CUSTOM_TYPES | METRIC_TYPES | OTHER_TYPES