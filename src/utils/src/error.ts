/*
 * @Author: xiaoshanwen
 * @Date: 2024-02-06 11:34:33
 * @LastEditTime: 2024-02-22 17:59:10
 * @FilePath: /CWTrack/cwTrack/src/utils/src/error.ts
 */


import ErrorStackParser from "error-stack-parser";
import { checkParamsType } from "./typeCheck";

export function generateErrorDetailsMessage(error) {
  let errorDetailsMessage = {} as any
  try {
    const stackFrames = ErrorStackParser.parse(error);
    for (let i = 0; i < stackFrames.length; i++) {
      const frame = stackFrames[i];
      if (checkParamsType.isNull(frame.functionName) || checkParamsType.isUndefined(frame.functionName)) {
        continue; // 越过匿名函数
      } else {
        errorDetailsMessage.fileName = frame.fileName
        errorDetailsMessage.lineNumber = frame.lineNumber
        errorDetailsMessage.columnNumber = frame.columnNumber
        errorDetailsMessage.functionName = frame.functionName
        errorDetailsMessage.source = frame.source
        break 
      }
    }
  } catch (_error) {
    // 错误解析失败
  }
  
  return errorDetailsMessage
}