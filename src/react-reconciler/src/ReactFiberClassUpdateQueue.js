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

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;
}
