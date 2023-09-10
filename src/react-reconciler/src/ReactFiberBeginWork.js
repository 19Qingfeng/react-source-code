import logger from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";

function updateHostRoot(current, workInProgress) {
  // 获取当前 fiber 节点的子虚拟Dom
  processUpdateQueue(workInProgress); // 为 memoizedState 赋值
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  // 协调子节点 DOM-DIff 算法
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostComponent(current, workInProgress) {}

/**
 * 根据虚拟 Dom 创建新的 fiber 链接结构
 * @param {*} current 旧的（当前在使用的 fiber）
 * @param {*} workInProgress 新的（轮替的）fiber
 * @return 当前 fiber 的子节点
 */
export function beginWork(current, workInProgress) {
  logger("beginWork", workInProgress);

  // 根据不同类型 fiber 节点不同处理方法
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
