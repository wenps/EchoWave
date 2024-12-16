/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-23 18:43:50
 * @LastEditTime: 2024-02-20 12:50:57
 * @FilePath: /CWTrack/src/type/src/action.ts
 */
import { ACTION_TYPES } from "../../common"
import { SupportTypes } from "./global"
export type ActionData = {
  uuid: number | string,
  time: number,
  type: SupportTypes,
  category: ACTION_TYPES,
  [props: string]: any
}

export type InitAction = {
  beforeActionFn?: (data:ActionData) => ActionData, 
  maxAction?: number
}