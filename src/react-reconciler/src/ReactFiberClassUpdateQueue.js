import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";

export function initialUpdateQueue(fiber) {
  // 创建新的更新队列
  const queue = {
    shared: {
      pending: null, // 等待生效的队列（循环链表）
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = {};
  return update;
}

/**
 * 更新入队 需要返回跟节点(ReactFiberRootNode)
 * @param {*} fiber
 * @param {*} update
 */
export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  let pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;
  // 从当前 fiber 寻找到根节点返回
  return markUpdateLaneFromFiberToRoot(fiber);
}
