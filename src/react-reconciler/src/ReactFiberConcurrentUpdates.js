/**
 * 并发更新相关文件
 */

import { HostRoot } from "./ReactWorkTags";

/**
 * 暂时先不处理 fiber 优先级问题
 * 实现向上查找到 fiber 根节点
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber; // 当前 fiber 节点
  let parent = sourceFiber.return; // 当前 fiber 的父节点
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode; // 返回真实 Node (FiberRootNode)
  }
  return null;
}
