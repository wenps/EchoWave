/*
 * @Author: xiaoshanwen
 * @Date: 2024-01-18 10:50:08
 * @LastEditTime: 2024-01-18 10:51:43
 * @FilePath: /CWTrack/src/utils/src/typeCheck.ts
 */
function isType(type: any) {
  return function (value: any): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}
/**
 * 检测变量类型
 * @param type
 */
export const checkParamsType = {
  isNumber: isType('Number'),
  isString: isType('String'),
  isBoolean: isType('Boolean'),
  isNull: isType('Null'),
  isUndefined: isType('Undefined'),
  isSymbol: isType('Symbol'),
  isFunction: isType('Function'),
  isObject: isType('Object'),
  isArray: isType('Array'),
  isProcess: isType('process'),
  isWindow: isType('Window'),
};