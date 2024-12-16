/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-19 10:28:53
 * @LastEditTime: 2024-12-16 13:42:28
 * @FilePath: /cave/src/core/src/custom/index.ts
 */

// custom 表示自定义模块

import { CUSTOM_TYPES } from "../../../common";
import { commonReport } from "../../../utils";

// 自定义上报
export function custom(message = '', type = CUSTOM_TYPES.CUSTOM) {
    try {
    commonReport(message, type)
  } catch (error) {
    console.error(error);
  }
}